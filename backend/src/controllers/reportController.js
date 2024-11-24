const reportService = require('../services/reportService');
const logger = require('../utils/logger');

const reportController = {
  getFinancialSummary: async (req, res) => {
    try {
      const { start_date, end_date } = req.query;
      const user_id = req.user.id;

      const summary = await reportService.getFinancialSummary({
        user_id,
        start_date,
        end_date
      });

      res.json(summary);
    } catch (error) {
      logger.error('Error getting financial summary:', error);
      res.status(500).json({ error: 'Erro ao gerar resumo financeiro' });
    }
  },

  getCategorySummary: async (req, res) => {
    try {
      const { start_date, end_date, type } = req.query;
      const user_id = req.user.id;

      const summary = await reportService.getCategorySummary({
        user_id,
        start_date,
        end_date,
        type
      });

      res.json(summary);
    } catch (error) {
      logger.error('Error getting category summary:', error);
      res.status(500).json({ error: 'Erro ao gerar resumo por categorias' });
    }
  }
};

module.exports = reportController; 