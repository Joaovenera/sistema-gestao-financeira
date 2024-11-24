const metricsService = require('../services/advancedMetricsService');
const logger = require('../utils/logger');

const metricsController = {
  getMetrics: async (req, res) => {
    try {
      const metrics = await metricsService.register.metrics();
      res.set('Content-Type', metricsService.register.contentType);
      res.end(metrics);
    } catch (error) {
      logger.error('Error collecting metrics:', error);
      res.status(500).json({ error: 'Erro ao coletar métricas' });
    }
  }
};

module.exports = metricsController; 