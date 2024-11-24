const { WebClient } = require('@slack/web-api');
const emailService = require('./emailService');
const logger = require('../utils/logger');

const slack = process.env.SLACK_TOKEN ? 
  new WebClient(process.env.SLACK_TOKEN) : 
  null;

const notificationService = {
  notify: async (userId, type, data) => {
    try {
      const notifications = [];

      // Notificação por email
      if (process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true') {
        notifications.push(
          emailService.sendEmail(data.userEmail, type, data)
        );
      }

      // Notificação via Slack
      if (process.env.SLACK_NOTIFICATIONS_ENABLED === 'true' && slack) {
        notifications.push(
          slack.chat.postMessage({
            channel: process.env.SLACK_CHANNEL,
            text: `Nova notificação: ${type}\nDetalhes: ${JSON.stringify(data)}`
          })
        );
      }

      await Promise.all(notifications);
      logger.info(`Notifications sent successfully for user ${userId}`);
    } catch (error) {
      logger.error('Error sending notifications:', error);
      throw error;
    }
  },

  notifyTransactionCreated: async (userId, transaction) => {
    return notificationService.notify(userId, 'transactionAlert', {
      userEmail: transaction.userEmail,
      ...transaction
    });
  },

  notifyLowBalance: async (userId, balance) => {
    return notificationService.notify(userId, 'lowBalanceAlert', {
      userEmail: balance.userEmail,
      currentBalance: balance.amount,
      threshold: balance.threshold
    });
  }
};

module.exports = notificationService; 