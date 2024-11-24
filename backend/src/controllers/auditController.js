const auditService = require('../services/auditService');
const logger = require('../utils/logger');

const auditController = {
  async getAuditTrail(req, res) {
    try {
      const filters = req.query;
      const logs = await auditService.getAuditTrail(filters);
      res.json(logs);
    } catch (error) {
      logger.error('Error getting audit trail:', error);
      res.status(500).json({ error: 'Erro ao buscar trilha de auditoria' });
    }
  },

  async getSecurityEvents(req, res) {
    try {
      const events = await auditService.getSecurityEvents(req.query);
      res.json(events);
    } catch (error) {
      logger.error('Error getting security events:', error);
      res.status(500).json({ error: 'Erro ao buscar eventos de segurança' });
    }
  },

  async getComplianceReport(req, res) {
    try {
      const { period } = req.query;
      const report = await auditService.generateComplianceReport(period);
      res.json(report);
    } catch (error) {
      logger.error('Error generating compliance report:', error);
      res.status(500).json({ error: 'Erro ao gerar relatório de compliance' });
    }
  }
};

module.exports = auditController; 