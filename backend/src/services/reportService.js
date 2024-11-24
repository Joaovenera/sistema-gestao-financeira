const { pool } = require('../config/database');
const logger = require('../utils/logger');

const reportService = {
  getFinancialSummary: async ({ user_id, start_date, end_date }) => {
    try {
      const query = `
        SELECT 
          type,
          SUM(amount) as total,
          COUNT(*) as count,
          MIN(amount) as min_value,
          MAX(amount) as max_value,
          AVG(amount) as average
        FROM transactions 
        WHERE user_id = ?
          AND date BETWEEN ? AND ?
        GROUP BY type
      `;

      const [results] = await pool.execute(query, [user_id, start_date, end_date]);

      // Calcular saldo
      const income = results.find(r => r.type === 'INCOME')?.total || 0;
      const expense = results.find(r => r.type === 'EXPENSE')?.total || 0;
      const balance = income - expense;

      return {
        summary: results,
        balance,
        period: { start_date, end_date }
      };
    } catch (error) {
      logger.error('Error generating financial summary:', error);
      throw error;
    }
  },

  getCategorySummary: async ({ user_id, start_date, end_date, type }) => {
    try {
      const query = `
        SELECT 
          c.name as category_name,
          c.type as category_type,
          COUNT(*) as transaction_count,
          SUM(t.amount) as total_amount,
          AVG(t.amount) as average_amount
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ?
          AND t.date BETWEEN ? AND ?
          ${type ? 'AND t.type = ?' : ''}
        GROUP BY c.id, c.name, c.type
        ORDER BY total_amount DESC
      `;

      const params = [user_id, start_date, end_date];
      if (type) params.push(type);

      const [results] = await pool.execute(query, params);

      return {
        categories: results,
        period: { start_date, end_date },
        type: type || 'ALL'
      };
    } catch (error) {
      logger.error('Error generating category summary:', error);
      throw error;
    }
  }
};

module.exports = reportService; 