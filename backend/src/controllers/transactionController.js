const transactionService = require('../services/transactionService');
const logger = require('../utils/logger');

const transactionController = {
  async getTransactions(req, res) {
    try {
      const { startDate, endDate, category, type } = req.query;
      const transactions = await transactionService.getTransactions(req.user.id, {
        startDate,
        endDate,
        category,
        type
      });
      res.json(transactions);
    } catch (error) {
      logger.error('Error getting transactions:', error);
      res.status(500).json({ message: 'Erro ao buscar transações' });
    }
  },

  async createTransaction(req, res) {
    try {
      const transaction = await transactionService.createTransaction(req.user.id, req.body);
      res.status(201).json(transaction);
    } catch (error) {
      logger.error('Error creating transaction:', error);
      res.status(500).json({ message: 'Erro ao criar transação' });
    }
  },

  async updateTransaction(req, res) {
    try {
      const transaction = await transactionService.updateTransaction(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json(transaction);
    } catch (error) {
      logger.error('Error updating transaction:', error);
      res.status(500).json({ message: 'Erro ao atualizar transação' });
    }
  },

  async deleteTransaction(req, res) {
    try {
      await transactionService.deleteTransaction(req.params.id, req.user.id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting transaction:', error);
      res.status(500).json({ message: 'Erro ao deletar transação' });
    }
  }
};

module.exports = transactionController; 