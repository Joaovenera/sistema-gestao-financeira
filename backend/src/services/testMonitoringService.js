const { pool } = require('../config/database');
const logger = require('../utils/logger');

const testMonitoringService = {
  async recordTestRun(data) {
    try {
      const { 
        type,
        total,
        passed,
        failed,
        skipped,
        duration,
        coverage,
        branch,
        commit_hash
      } = data;

      const [result] = await pool.execute(
        `INSERT INTO test_runs (
          type, total, passed, failed, skipped, 
          duration, coverage, branch, commit_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          type, total, passed, failed, skipped,
          duration, coverage, branch, commit_hash
        ]
      );

      // Registrar falhas detalhadas se houver
      if (data.failures && data.failures.length > 0) {
        for (const failure of data.failures) {
          await pool.execute(
            `INSERT INTO test_failures (
              test_run_id, test_name, error_message, 
              file_path, line_number
            ) VALUES (?, ?, ?, ?, ?)`,
            [
              result.insertId,
              failure.testName,
              failure.errorMessage,
              failure.filePath,
              failure.lineNumber
            ]
          );
        }
      }

      return result.insertId;
    } catch (error) {
      logger.error('Error recording test run:', error);
      throw error;
    }
  },

  async getTestHistory(filters = {}) {
    try {
      let query = `
        SELECT 
          tr.*,
          COUNT(tf.id) as failure_count
        FROM test_runs tr
        LEFT JOIN test_failures tf ON tr.id = tf.test_run_id
      `;

      const conditions = [];
      const params = [];

      if (filters.type) {
        conditions.push('tr.type = ?');
        params.push(filters.type);
      }

      if (filters.branch) {
        conditions.push('tr.branch = ?');
        params.push(filters.branch);
      }

      if (filters.start_date) {
        conditions.push('tr.created_at >= ?');
        params.push(filters.start_date);
      }

      if (filters.end_date) {
        conditions.push('tr.created_at <= ?');
        params.push(filters.end_date);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ' GROUP BY tr.id ORDER BY tr.created_at DESC';

      const [runs] = await pool.execute(query, params);
      return runs;
    } catch (error) {
      logger.error('Error getting test history:', error);
      throw error;
    }
  },

  async analyzeTestTrends() {
    try {
      const [results] = await pool.execute(`
        SELECT 
          DATE(created_at) as date,
          AVG(duration) as avg_duration,
          AVG(coverage) as avg_coverage,
          SUM(failed) / SUM(total) * 100 as failure_rate
        FROM test_runs
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);

      return {
        trends: results,
        analysis: this.analyzeTrendData(results)
      };
    } catch (error) {
      logger.error('Error analyzing test trends:', error);
      throw error;
    }
  },

  analyzeTrendData(data) {
    const analysis = {
      duration: {
        trend: 'stable',
        change: 0
      },
      coverage: {
        trend: 'stable',
        change: 0
      },
      failureRate: {
        trend: 'stable',
        change: 0
      }
    };

    if (data.length < 2) return analysis;

    // Calcular tendências
    const first = data[0];
    const last = data[data.length - 1];

    analysis.duration.change = ((last.avg_duration - first.avg_duration) / first.avg_duration) * 100;
    analysis.coverage.change = last.avg_coverage - first.avg_coverage;
    analysis.failureRate.change = last.failure_rate - first.failure_rate;

    // Determinar tendências
    analysis.duration.trend = this.determineTrend(analysis.duration.change);
    analysis.coverage.trend = this.determineTrend(analysis.coverage.change);
    analysis.failureRate.trend = this.determineTrend(-analysis.failureRate.change); // Negativo porque menos falhas é melhor

    return analysis;
  },

  determineTrend(change) {
    if (change > 5) return 'improving';
    if (change < -5) return 'degrading';
    return 'stable';
  }
};

module.exports = testMonitoringService; 