const analyticsService = require('../services/analyticsService');
const logger = require('../utils/logger');

const analyticsController = {
  async getPredictions(req, res) {
    try {
      const predictions = await analyticsService.getPredictions(req.user.id);
      res.json(predictions);
    } catch (error) {
      logger.error('Error getting predictions:', error);
      res.status(500).json({ message: 'Erro ao buscar previsões' });
    }
  },

  async getAnomalies(req, res) {
    try {
      const anomalies = await analyticsService.getAnomalies(req.user.id);
      res.json(anomalies);
    } catch (error) {
      logger.error('Error getting anomalies:', error);
      res.status(500).json({ message: 'Erro ao buscar anomalias' });
    }
  },

  async getCategoryDistribution(req, res) {
    try {
      const distribution = await analyticsService.getCategoryDistribution(req.user.id);
      res.json(distribution);
    } catch (error) {
      logger.error('Error getting category distribution:', error);
      res.status(500).json({ message: 'Erro ao buscar distribuição por categoria' });
    }
  }
};

module.exports = analyticsController; 