const Transaction = require('../models/Transaction');
const logger = require('../utils/logger');

const transactionService = {
  async getTransactions(userId) {
    try {
      return await Transaction.findByUserId(userId);
    } catch (error) {
      logger.error('Error in getTransactions:', error);
      throw error;
    }
  },

  async createTransaction(userId, data) {
    try {
      return await Transaction.create({
        ...data,
        user_id: userId
      });
    } catch (error) {
      logger.error('Error in createTransaction:', error);
      throw error;
    }
  },

  async updateTransaction(id, data) {
    try {
      return await Transaction.update(id, data);
    } catch (error) {
      logger.error('Error in updateTransaction:', error);
      throw error;
    }
  },

  async deleteTransaction(id) {
    try {
      return await Transaction.delete(id);
    } catch (error) {
      logger.error('Error in deleteTransaction:', error);
      throw error;
    }
  }
};

module.exports = transactionService; 