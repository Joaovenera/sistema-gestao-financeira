const creditCardService = require('../services/creditCardService');
const logger = require('../utils/logger');

const creditCardController = {
  create: async (req, res) => {
    try {
      const cardData = req.body;
      const user_id = req.user.id;

      const card = await creditCardService.createCard({
        ...cardData,
        user_id
      });

      res.status(201).json(card);
    } catch (error) {
      logger.error('Error creating credit card:', error);
      res.status(500).json({ error: 'Erro ao criar cartão' });
    }
  },

  list: async (req, res) => {
    try {
      const user_id = req.user.id;
      const cards = await creditCardService.listCards(user_id);
      res.json(cards);
    } catch (error) {
      logger.error('Error listing credit cards:', error);
      res.status(500).json({ error: 'Erro ao listar cartões' });
    }
  },

  getInvoice: async (req, res) => {
    try {
      const { id } = req.params;
      const { month, year } = req.query;
      const user_id = req.user.id;

      const invoice = await creditCardService.getCardInvoice(id, user_id, {
        month: parseInt(month),
        year: parseInt(year)
      });

      if (!invoice) {
        return res.status(404).json({ error: 'Fatura não encontrada' });
      }

      res.json(invoice);
    } catch (error) {
      logger.error('Error getting credit card invoice:', error);
      res.status(500).json({ error: 'Erro ao buscar fatura' });
    }
  },

  addTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const transactionData = req.body;
      const user_id = req.user.id;

      const transaction = await creditCardService.addCardTransaction(id, user_id, transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      logger.error('Error adding credit card transaction:', error);
      res.status(500).json({ error: 'Erro ao adicionar transação' });
    }
  },

  getLimits: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const limits = await creditCardService.getCardLimits(id, user_id);

      if (!limits) {
        return res.status(404).json({ error: 'Cartão não encontrado' });
      }

      res.json(limits);
    } catch (error) {
      logger.error('Error getting credit card limits:', error);
      res.status(500).json({ error: 'Erro ao buscar limites do cartão' });
    }
  }
};

module.exports = creditCardController; 