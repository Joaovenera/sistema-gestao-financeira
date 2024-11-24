const logger = require('../utils/logger');
const metricsService = require('../services/metricsService');

const metricsController = {
  async getMetrics(req, res) {
    try {
      const metrics = await metricsService.collectMetrics();
      res.json(metrics);
    } catch (error) {
      logger.error('Error getting metrics:', error);
      res.status(500).json({ message: 'Erro ao buscar métricas' });
    }
  }
};

module.exports = metricsController; 