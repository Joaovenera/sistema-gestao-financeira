const analyticsService = require('../services/analyticsService');
const logger = require('../utils/logger');

const analyticsController = {
  async getFlowPrediction(req, res) {
    try {
      const { months_ahead } = req.query;
      const user_id = req.user.id;

      const prediction = await analyticsService.getFlowPrediction({
        user_id,
        months_ahead: parseInt(months_ahead) || 3
      });

      res.json(prediction);
    } catch (error) {
      logger.error('Error getting flow prediction:', error);
      res.status(500).json({ error: 'Erro ao gerar previsão de fluxo' });
    }
  },

  async detectAnomalies(req, res) {
    try {
      const { threshold } = req.query;
      const user_id = req.user.id;

      const anomalies = await analyticsService.detectAnomalies({
        user_id,
        threshold: parseFloat(threshold) || 2
      });

      res.json(anomalies);
    } catch (error) {
      logger.error('Error detecting anomalies:', error);
      res.status(500).json({ error: 'Erro ao detectar anomalias' });
    }
  },

  async getRecommendations(req, res) {
    try {
      const user_id = req.user.id;
      const recommendations = await analyticsService.getRecommendations({
        user_id
      });

      res.json(recommendations);
    } catch (error) {
      logger.error('Error getting recommendations:', error);
      res.status(500).json({ error: 'Erro ao gerar recomendações' });
    }
  }
};

module.exports = analyticsController; 