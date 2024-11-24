const notificationService = require('../../../src/services/notificationService');
const emailService = require('../../../src/services/emailService');
const { WebClient } = require('@slack/web-api');
const logger = require('../../../src/utils/logger');

jest.mock('../../../src/services/emailService');
jest.mock('@slack/web-api');
jest.mock('../../../src/utils/logger');

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('notify', () => {
    const mockUserId = 1;
    const mockType = 'transactionAlert';
    const mockData = {
      userEmail: 'test@example.com',
      amount: 1000,
      type: 'EXPENSE'
    };

    it('deve enviar notificação por email com sucesso', async () => {
      process.env.EMAIL_NOTIFICATIONS_ENABLED = 'true';
      process.env.SLACK_NOTIFICATIONS_ENABLED = 'false';

      await notificationService.notify(mockUserId, mockType, mockData);

      expect(emailService.sendEmail).toHaveBeenCalledWith(
        mockData.userEmail,
        mockType,
        mockData
      );
    });

    it('deve enviar notificação para o Slack com sucesso', async () => {
      process.env.EMAIL_NOTIFICATIONS_ENABLED = 'false';
      process.env.SLACK_NOTIFICATIONS_ENABLED = 'true';

      const mockSlack = {
        chat: {
          postMessage: jest.fn().mockResolvedValue({ ok: true })
        }
      };

      WebClient.mockImplementation(() => mockSlack);

      await notificationService.notify(mockUserId, mockType, mockData);

      expect(mockSlack.chat.postMessage).toHaveBeenCalledWith({
        channel: process.env.SLACK_CHANNEL,
        text: expect.stringContaining(mockType)
      });
    });

    it('deve logar erro se o envio falhar', async () => {
      const error = new Error('Email service error');
      emailService.sendEmail.mockRejectedValue(error);

      process.env.EMAIL_NOTIFICATIONS_ENABLED = 'true';

      await expect(
        notificationService.notify(mockUserId, mockType, mockData)
      ).rejects.toThrow(error);

      expect(logger.error).toHaveBeenCalledWith(
        'Error sending notifications:',
        error
      );
    });
  });

  describe('notifyTransactionCreated', () => {
    const mockUserId = 1;
    const mockTransaction = {
      userEmail: 'test@example.com',
      amount: 1000,
      type: 'EXPENSE',
      description: 'Test transaction'
    };

    it('deve notificar criação de transação', async () => {
      const notifySpy = jest.spyOn(notificationService, 'notify');

      await notificationService.notifyTransactionCreated(
        mockUserId,
        mockTransaction
      );

      expect(notifySpy).toHaveBeenCalledWith(
        mockUserId,
        'transactionAlert',
        expect.objectContaining(mockTransaction)
      );
    });
  });

  describe('notifyLowBalance', () => {
    const mockUserId = 1;
    const mockBalance = {
      userEmail: 'test@example.com',
      amount: 100,
      threshold: 500
    };

    it('deve notificar saldo baixo', async () => {
      const notifySpy = jest.spyOn(notificationService, 'notify');

      await notificationService.notifyLowBalance(mockUserId, mockBalance);

      expect(notifySpy).toHaveBeenCalledWith(
        mockUserId,
        'lowBalanceAlert',
        expect.objectContaining({
          userEmail: mockBalance.userEmail,
          currentBalance: mockBalance.amount,
          threshold: mockBalance.threshold
        })
      );
    });
  });
}); 