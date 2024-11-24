const CreditCard = require('../models/CreditCard');
const logger = require('../utils/logger');
const notificationService = require('./notificationService');

const creditCardService = {
  createCard: async (cardData) => {
    try {
      const card = await CreditCard.create(cardData);
      return card;
    } catch (error) {
      logger.error('Error creating credit card:', error);
      throw error;
    }
  },

  // ... outros métodos do serviço
};

module.exports = creditCardService; 