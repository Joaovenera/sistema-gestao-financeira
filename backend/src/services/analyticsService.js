const { pool } = require('../config/database');
const logger = require('../utils/logger');

const analyticsService = {
  async getPredictions(userId) {
    try {
      // Buscar transações dos últimos 6 meses
      const [transactions] = await pool.execute(
        `SELECT amount, type, date 
         FROM transactions 
         WHERE user_id = ? 
         AND date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
         ORDER BY date ASC`,
        [userId]
      );

      // Calcular médias mensais
      const monthlyData = transactions.reduce((acc, transaction) => {
        const month = new Date(transaction.date).getMonth();
        if (!acc[month]) {
          acc[month] = { income: 0, expense: 0 };
        }
        if (transaction.type === 'INCOME') {
          acc[month].income += transaction.amount;
        } else {
          acc[month].expense += transaction.amount;
        }
        return acc;
      }, {});

      // Converter para arrays
      const income = Object.values(monthlyData).map(m => m.income);
      const expense = Object.values(monthlyData).map(m => m.expense);
      const balance = income.map((inc, i) => inc - expense[i]);

      // Calcular score de confiança baseado na variância dos dados
      const confidence_score = 85; // Implementar cálculo real depois

      return {
        balance: balance[balance.length - 1] || 0,
        income: income[income.length - 1] || 0,
        expenses: expense[expense.length - 1] || 0,
        predictions: {
          income,
          expense,
          balance
        },
        confidence_score
      };
    } catch (error) {
      logger.error('Error getting predictions:', error);
      throw error;
    }
  },

  async getAnomalies(userId) {
    try {
      // Buscar transações dos últimos 3 meses
      const [transactions] = await pool.execute(
        `SELECT t.id as transaction_id, t.amount, t.date, c.name as category_name,
         (SELECT AVG(amount) 
          FROM transactions t2 
          WHERE t2.category_id = t.category_id 
          AND t2.user_id = ?) as average_amount
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = ?
         AND t.date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)`,
        [userId, userId]
      );

      // Detectar anomalias (transações que desviam mais de 2x da média)
      const anomalies = transactions.filter(t => {
        const z_score = Math.abs((t.amount - t.average_amount) / t.average_amount);
        t.z_score = z_score;
        return z_score > 2;
      });

      return {
        anomalies,
        metadata: {
          total_analyzed: transactions.length,
          anomalies_found: anomalies.length,
          threshold: 2,
          analysis_date: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Error getting anomalies:', error);
      throw error;
    }
  },

  async getCategoryDistribution(userId) {
    try {
      const [distribution] = await pool.execute(
        `SELECT c.name, SUM(t.amount) as total
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = ?
         AND t.date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
         GROUP BY c.id, c.name
         ORDER BY total DESC`,
        [userId]
      );

      return distribution;
    } catch (error) {
      logger.error('Error getting category distribution:', error);
      throw error;
    }
  }
};

module.exports = analyticsService; 