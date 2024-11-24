const logger = require('../utils/logger');
const ActivityLog = require('../models/ActivityLog');

const logController = {
  async getLogs(req, res) {
    try {
      const filters = req.query;
      const logs = await ActivityLog.findAll(filters);
      res.json(logs);
    } catch (error) {
      logger.error('Error getting logs:', error);
      res.status(500).json({ message: 'Erro ao buscar logs' });
    }
  },

  async getSecurityEvents(req, res) {
    try {
      const period = req.query.period || '24 hours';
      const events = await ActivityLog.getSecurityEvents(period);
      res.json(events);
    } catch (error) {
      logger.error('Error getting security events:', error);
      res.status(500).json({ message: 'Erro ao buscar eventos de segurança' });
    }
  }
};

module.exports = logController; 