const securityAnalysisService = require('../services/securityAnalysisService');
const logger = require('../utils/logger');
const adminMiddleware = require('../middleware/adminMiddleware');

const securityController = {
  async runSecurityScan(req, res) {
    try {
      const results = await securityAnalysisService.runSecurityScan();
      res.json(results);
    } catch (error) {
      logger.error('Erro ao executar scan de segurança:', error);
      res.status(500).json({ error: 'Falha na análise de segurança' });
    }
  },

  async getSecurityMetrics(req, res) {
    try {
      const dependencyCheck = await securityAnalysisService.runDependencyCheck();
      const headerCheck = await securityAnalysisService.checkSecurityHeaders(process.env.API_URL);
      const configCheck = securityAnalysisService.checkSecurityConfig();

      res.json({
        dependencyCheck,
        headerCheck,
        configCheck,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Erro ao obter métricas de segurança:', error);
      res.status(500).json({ error: 'Falha ao obter métricas de segurança' });
    }
  }
};

module.exports = securityController; 