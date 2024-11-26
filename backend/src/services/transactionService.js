const { pool } = require('../config/database');
const logger = require('../utils/logger');

const transactionService = {
  async getTransactions(userId, filters = {}) {
    try {
      let query = `
        SELECT t.*, c.name as category_name
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ?
      `;
      const queryParams = [userId];

      if (filters.startDate) {
        query += ' AND t.date >= ?';
        queryParams.push(filters.startDate);
      }

      if (filters.endDate) {
        query += ' AND t.date <= ?';
        queryParams.push(filters.endDate);
      }

      if (filters.category) {
        query += ' AND t.category_id = ?';
        queryParams.push(filters.category);
      }

      if (filters.type) {
        query += ' AND t.type = ?';
        queryParams.push(filters.type);
      }

      query += ' ORDER BY t.date DESC';

      const [transactions] = await pool.execute(query, queryParams);
      return transactions;
    } catch (error) {
      logger.error('Error getting transactions:', error);
      throw error;
    }
  },

  async createTransaction(userId, transactionData) {
    try {
      const { category_id, type, amount, description, date } = transactionData;

      const [result] = await pool.execute(
        `INSERT INTO transactions (user_id, category_id, type, amount, description, date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, category_id, type, amount, description, date]
      );

      return {
        id: result.insertId,
        user_id: userId,
        ...transactionData
      };
    } catch (error) {
      logger.error('Error creating transaction:', error);
      throw error;
    }
  },

  async updateTransaction(transactionId, userId, transactionData) {
    try {
      const { category_id, type, amount, description, date } = transactionData;

      const [result] = await pool.execute(
        `UPDATE transactions 
         SET category_id = ?, type = ?, amount = ?, description = ?, date = ?
         WHERE id = ? AND user_id = ?`,
        [category_id, type, amount, description, date, transactionId, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Transação não encontrada');
      }

      return {
        id: transactionId,
        user_id: userId,
        ...transactionData
      };
    } catch (error) {
      logger.error('Error updating transaction:', error);
      throw error;
    }
  },

  async deleteTransaction(transactionId, userId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM transactions WHERE id = ? AND user_id = ?',
        [transactionId, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Transação não encontrada');
      }

      return true;
    } catch (error) {
      logger.error('Error deleting transaction:', error);
      throw error;
    }
  }
};

module.exports = transactionService; 