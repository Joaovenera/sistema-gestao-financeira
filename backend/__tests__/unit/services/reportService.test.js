const reportService = require('../../../src/services/reportService');
const Transaction = require('../../../src/models/Transaction');
const { pool } = require('../../../src/config/database');
const logger = require('../../../src/utils/logger');

jest.mock('../../../src/models/Transaction');
jest.mock('../../../src/config/database');
jest.mock('../../../src/utils/logger');

describe('ReportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFinancialSummary', () => {
    const mockUserId = 1;
    const mockFilters = {
      start_date: '2024-01-01',
      end_date: '2024-12-31'
    };

    it('deve gerar resumo financeiro com sucesso', async () => {
      const mockTransactions = [
        { type: 'INCOME', amount: 1000 },
        { type: 'EXPENSE', amount: 600 }
      ];

      pool.execute.mockResolvedValue([mockTransactions]);

      const result = await reportService.getFinancialSummary({
        user_id: mockUserId,
        ...mockFilters
      });

      expect(result).toEqual({
        income: 1000,
        expense: 600,
        balance: 400,
        period: mockFilters
      });
    });

    it('deve retornar saldo zerado se não houver transações', async () => {
      pool.execute.mockResolvedValue([[]]);

      const result = await reportService.getFinancialSummary({
        user_id: mockUserId,
        ...mockFilters
      });

      expect(result).toEqual({
        income: 0,
        expense: 0,
        balance: 0,
        period: mockFilters
      });
    });

    it('deve logar erro se a consulta falhar', async () => {
      const error = new Error('Database error');
      pool.execute.mockRejectedValue(error);

      await expect(
        reportService.getFinancialSummary({
          user_id: mockUserId,
          ...mockFilters
        })
      ).rejects.toThrow(error);

      expect(logger.error).toHaveBeenCalledWith(
        'Error generating financial summary:',
        error
      );
    });
  });

  describe('getCategorySummary', () => {
    const mockUserId = 1;
    const mockFilters = {
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      type: 'EXPENSE'
    };

    it('deve gerar resumo por categoria com sucesso', async () => {
      const mockCategories = [
        { 
          category_name: 'Alimentação',
          transaction_count: 5,
          total_amount: 500,
          average_amount: 100
        }
      ];

      pool.execute.mockResolvedValue([mockCategories]);

      const result = await reportService.getCategorySummary({
        user_id: mockUserId,
        ...mockFilters
      });

      expect(result).toEqual({
        categories: mockCategories,
        period: {
          start_date: mockFilters.start_date,
          end_date: mockFilters.end_date
        },
        type: mockFilters.type
      });
    });

    it('deve retornar array vazio se não houver dados', async () => {
      pool.execute.mockResolvedValue([[]]);

      const result = await reportService.getCategorySummary({
        user_id: mockUserId,
        ...mockFilters
      });

      expect(result.categories).toEqual([]);
    });
  });

  describe('getMonthlyTrend', () => {
    const mockUserId = 1;
    const mockMonths = 6;

    it('deve gerar tendência mensal com sucesso', async () => {
      const mockTrends = [
        { month: '2024-01', income: 5000, expense: 3000 },
        { month: '2024-02', income: 5500, expense: 3200 }
      ];

      pool.execute.mockResolvedValue([mockTrends]);

      const result = await reportService.getMonthlyTrend(mockUserId, mockMonths);

      expect(result).toEqual({
        trends: mockTrends,
        analysis: expect.any(Object)
      });
    });

    it('deve calcular variações percentuais', async () => {
      const mockTrends = [
        { month: '2024-01', income: 5000, expense: 3000 },
        { month: '2024-02', income: 5500, expense: 3200 }
      ];

      pool.execute.mockResolvedValue([mockTrends]);

      const result = await reportService.getMonthlyTrend(mockUserId, mockMonths);

      expect(result.analysis).toEqual({
        income_variation: 10, // (5500 - 5000) / 5000 * 100
        expense_variation: 6.67, // (3200 - 3000) / 3000 * 100
        trend: expect.any(String)
      });
    });
  });
}); 