const transactionService = require('../services/transactionService');
const logger = require('../utils/logger');

const transactionController = {
  create: async (req, res) => {
    try {
      const { type, amount, category_id, date, description } = req.body;
      const user_id = req.user.id;

      const transaction = await transactionService.createTransaction({
        user_id,
        type,
        amount,
        category_id,
        date,
        description
      });

      res.status(201).json(transaction);
    } catch (error) {
      logger.error('Error creating transaction:', error);
      res.status(500).json({ error: 'Erro ao criar transação' });
    }
  },

  list: async (req, res) => {
    try {
      const { start_date, end_date, category, type } = req.query;
      const user_id = req.user.id;

      const transactions = await transactionService.listTransactions({
        user_id,
        start_date,
        end_date,
        category,
        type
      });

      res.json(transactions);
    } catch (error) {
      logger.error('Error listing transactions:', error);
      res.status(500).json({ error: 'Erro ao listar transações' });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const transaction = await transactionService.getTransactionById(id, user_id);

      if (!transaction) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }

      res.json(transaction);
    } catch (error) {
      logger.error('Error getting transaction:', error);
      res.status(500).json({ error: 'Erro ao buscar transação' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const updateData = req.body;

      const updated = await transactionService.updateTransaction(id, user_id, updateData);

      if (!updated) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }

      res.json({ message: 'Transação atualizada com sucesso' });
    } catch (error) {
      logger.error('Error updating transaction:', error);
      res.status(500).json({ error: 'Erro ao atualizar transação' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const deleted = await transactionService.deleteTransaction(id, user_id);

      if (!deleted) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }

      res.json({ message: 'Transação excluída com sucesso' });
    } catch (error) {
      logger.error('Error deleting transaction:', error);
      res.status(500).json({ error: 'Erro ao excluir transação' });
    }
  }
};

module.exports = transactionController; 