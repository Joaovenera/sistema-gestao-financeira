const billService = require('../services/billService');
const logger = require('../utils/logger');

const billController = {
  create: async (req, res) => {
    try {
      const billData = req.body;
      const user_id = req.user.id;

      const bill = await billService.createBill({
        ...billData,
        user_id
      });

      res.status(201).json(bill);
    } catch (error) {
      logger.error('Error creating bill:', error);
      res.status(500).json({ error: 'Erro ao criar conta' });
    }
  },

  list: async (req, res) => {
    try {
      const filters = req.query;
      const user_id = req.user.id;

      const bills = await billService.listBills(user_id, filters);
      res.json(bills);
    } catch (error) {
      logger.error('Error listing bills:', error);
      res.status(500).json({ error: 'Erro ao listar contas' });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const bill = await billService.getBillById(id, user_id);

      if (!bill) {
        return res.status(404).json({ error: 'Conta não encontrada' });
      }

      res.json(bill);
    } catch (error) {
      logger.error('Error getting bill:', error);
      res.status(500).json({ error: 'Erro ao buscar conta' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const updateData = req.body;

      const updated = await billService.updateBill(id, user_id, updateData);

      if (!updated) {
        return res.status(404).json({ error: 'Conta não encontrada' });
      }

      res.json({ message: 'Conta atualizada com sucesso' });
    } catch (error) {
      logger.error('Error updating bill:', error);
      res.status(500).json({ error: 'Erro ao atualizar conta' });
    }
  },

  markAsPaid: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const paymentData = req.body;

      const updated = await billService.markBillAsPaid(id, user_id, paymentData);

      if (!updated) {
        return res.status(404).json({ error: 'Conta não encontrada' });
      }

      res.json({ message: 'Conta marcada como paga com sucesso' });
    } catch (error) {
      logger.error('Error marking bill as paid:', error);
      res.status(500).json({ error: 'Erro ao marcar conta como paga' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const deleted = await billService.deleteBill(id, user_id);

      if (!deleted) {
        return res.status(404).json({ error: 'Conta não encontrada' });
      }

      res.json({ message: 'Conta excluída com sucesso' });
    } catch (error) {
      logger.error('Error deleting bill:', error);
      res.status(500).json({ error: 'Erro ao excluir conta' });
    }
  }
};

module.exports = billController; 