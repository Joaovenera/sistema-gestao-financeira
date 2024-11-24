const transactionService = require('../../../src/services/transactionService');
const Transaction = require('../../../src/models/Transaction');
const notificationService = require('../../../src/services/notificationService');
const { pool } = require('../../../src/config/database');

jest.mock('../../../src/models/Transaction');
jest.mock('../../../src/services/notificationService');
jest.mock('../../../src/config/database');

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    const mockTransactionData = {
      user_id: 1,
      type: 'EXPENSE',
      amount: 100.50,
      category_id: 1,
      description: 'Test transaction',
      date: new Date().toISOString()
    };

    it('deve criar uma transação com sucesso', async () => {
      const mockCreatedTransaction = { id: 1, ...mockTransactionData };
      Transaction.create.mockResolvedValue(mockCreatedTransaction);

      const result = await transactionService.createTransaction(mockTransactionData);

      expect(Transaction.create).toHaveBeenCalledWith(mockTransactionData);
      expect(result).toEqual(mockCreatedTransaction);
      expect(notificationService.notifyTransactionCreated).toHaveBeenCalledWith(
        mockTransactionData.user_id,
        expect.objectContaining(mockCreatedTransaction)
      );
    });

    it('deve lançar erro se a criação falhar', async () => {
      const error = new Error('Database error');
      Transaction.create.mockRejectedValue(error);

      await expect(
        transactionService.createTransaction(mockTransactionData)
      ).rejects.toThrow(error);
    });

    it('deve validar valor negativo', async () => {
      const invalidData = { ...mockTransactionData, amount: -100 };

      await expect(
        transactionService.createTransaction(invalidData)
      ).rejects.toThrow('Valor da transação deve ser positivo');
    });
  });

  describe('listTransactions', () => {
    const mockFilters = {
      user_id: 1,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      category_id: 1,
      type: 'EXPENSE'
    };

    it('deve listar transações com filtros', async () => {
      const mockTransactions = [
        { id: 1, amount: 100 },
        { id: 2, amount: 200 }
      ];

      Transaction.findByUserId.mockResolvedValue(mockTransactions);

      const result = await transactionService.listTransactions(mockFilters);

      expect(Transaction.findByUserId).toHaveBeenCalledWith(
        mockFilters.user_id,
        expect.objectContaining({
          start_date: mockFilters.start_date,
          end_date: mockFilters.end_date,
          category_id: mockFilters.category_id,
          type: mockFilters.type
        })
      );
      expect(result).toEqual(mockTransactions);
    });

    it('deve retornar array vazio se não encontrar transações', async () => {
      Transaction.findByUserId.mockResolvedValue([]);

      const result = await transactionService.listTransactions(mockFilters);

      expect(result).toEqual([]);
    });
  });

  describe('getBalance', () => {
    const mockUserId = 1;

    it('deve calcular saldo corretamente', async () => {
      const mockBalance = {
        income: 1000,
        expense: 600,
        balance: 400
      };

      Transaction.getBalance.mockResolvedValue(mockBalance);

      const result = await transactionService.getBalance(mockUserId);

      expect(Transaction.getBalance).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockBalance);
    });

    it('deve retornar saldo zerado se não houver transações', async () => {
      Transaction.getBalance.mockResolvedValue({
        income: 0,
        expense: 0,
        balance: 0
      });

      const result = await transactionService.getBalance(mockUserId);

      expect(result).toEqual({
        income: 0,
        expense: 0,
        balance: 0
      });
    });
  });

  describe('deleteTransaction', () => {
    const mockTransactionId = 1;
    const mockUserId = 1;

    it('deve deletar transação com sucesso', async () => {
      Transaction.delete.mockResolvedValue(true);

      const result = await transactionService.deleteTransaction(mockTransactionId, mockUserId);

      expect(Transaction.delete).toHaveBeenCalledWith(mockTransactionId);
      expect(result).toBe(true);
    });

    it('deve retornar false se transação não existir', async () => {
      Transaction.delete.mockResolvedValue(false);

      const result = await transactionService.deleteTransaction(mockTransactionId, mockUserId);

      expect(result).toBe(false);
    });

    it('deve verificar permissão antes de deletar', async () => {
      Transaction.findById.mockResolvedValue({ user_id: 2 });

      await expect(
        transactionService.deleteTransaction(mockTransactionId, mockUserId)
      ).rejects.toThrow('Não autorizado a deletar esta transação');
    });
  });
}); 