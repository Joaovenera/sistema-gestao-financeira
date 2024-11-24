const os = require('os');
const { pool } = require('../config/database');
const logger = require('../utils/logger');

const metricsService = {
  async collectMetrics() {
    try {
      const systemMetrics = this.getSystemMetrics();
      const dbMetrics = await this.getDatabaseMetrics();
      const appMetrics = await this.getApplicationMetrics();

      return {
        timestamp: new Date(),
        system: systemMetrics,
        database: dbMetrics,
        application: appMetrics
      };
    } catch (error) {
      logger.error('Error collecting metrics:', error);
      throw error;
    }
  },

  getSystemMetrics() {
    return {
      cpuUsage: os.loadavg(),
      memoryUsage: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem()
      },
      uptime: os.uptime()
    };
  },

  async getDatabaseMetrics() {
    const [result] = await pool.query('SHOW STATUS');
    const metrics = {};
    
    result.forEach(row => {
      metrics[row.Variable_name] = row.Value;
    });

    return metrics;
  },

  async getApplicationMetrics() {
    const [activeUsers] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE last_login > DATE_SUB(NOW(), INTERVAL 24 HOUR)'
    );

    const [transactionsToday] = await pool.query(
      'SELECT COUNT(*) as count FROM transactions WHERE created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)'
    );

    return {
      activeUsers: activeUsers[0].count,
      transactionsToday: transactionsToday[0].count,
      processUptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    };
  }
};

module.exports = metricsService; 