const { pool } = require('../config/database');
const logger = require('../utils/logger');

const transactionService = {
  createTransaction: async (data) => {
    const { user_id, type, amount, category_id, date, description } = data;

    const [result] = await pool.execute(
      'INSERT INTO transactions (user_id, type, amount, category_id, date, description) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, type, amount, category_id, date, description]
    );

    return { id: result.insertId, ...data };
  },

  listTransactions: async (filters) => {
    const { user_id, start_date, end_date, category, type } = filters;
    let query = 'SELECT t.*, c.name as category_name FROM transactions t JOIN categories c ON t.category_id = c.id WHERE t.user_id = ?';
    const params = [user_id];

    if (start_date) {
      query += ' AND t.date >= ?';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND t.date <= ?';
      params.push(end_date);
    }

    if (category) {
      query += ' AND t.category_id = ?';
      params.push(category);
    }

    if (type) {
      query += ' AND t.type = ?';
      params.push(type);
    }

    query += ' ORDER BY t.date DESC';

    const [transactions] = await pool.execute(query, params);
    return transactions;
  },

  // ... outros métodos do serviço
};

module.exports = transactionService; 