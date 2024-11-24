const Bill = require('../models/Bill');
const logger = require('../utils/logger');
const notificationService = require('./notificationService');

const billService = {
  createBill: async (billData) => {
    try {
      const bill = await Bill.create(billData);
      
      // Notificar se for uma conta próxima do vencimento
      if (isNearDueDate(bill.due_date)) {
        await notificationService.notifyBillDueDate(bill);
      }

      return bill;
    } catch (error) {
      logger.error('Error creating bill:', error);
      throw error;
    }
  },

  // ... outros métodos do serviço
};

module.exports = billService; 