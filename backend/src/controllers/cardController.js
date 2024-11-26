const cardService = require('../services/cardService');
const logger = require('../utils/logger');

const cardController = {
  async getCards(req, res) {
    try {
      const cards = await cardService.getCards(req.user.id);
      res.json(cards);
    } catch (error) {
      logger.error('Error getting cards:', error);
      res.status(500).json({ message: 'Erro ao buscar cartões' });
    }
  },

  async createCard(req, res) {
    try {
      const card = await cardService.createCard(req.user.id, req.body);
      res.status(201).json(card);
    } catch (error) {
      logger.error('Error creating card:', error);
      res.status(500).json({ message: 'Erro ao criar cartão' });
    }
  },

  async updateCard(req, res) {
    try {
      const card = await cardService.updateCard(req.params.id, req.user.id, req.body);
      res.json(card);
    } catch (error) {
      logger.error('Error updating card:', error);
      res.status(500).json({ message: 'Erro ao atualizar cartão' });
    }
  },

  async deleteCard(req, res) {
    try {
      await cardService.deleteCard(req.params.id, req.user.id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting card:', error);
      res.status(500).json({ message: 'Erro ao deletar cartão' });
    }
  }
};

module.exports = cardController; 