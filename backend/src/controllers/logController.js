const logService = require('../services/logService');
const logger = require('../utils/logger');

const logController = {
  list: async (req, res) => {
    try {
      const { start_date, end_date, action, entity_type } = req.query;

      const logs = await logService.listLogs({
        start_date,
        end_date,
        action,
        entity_type
      });

      res.json(logs);
    } catch (error) {
      logger.error('Error listing logs:', error);
      res.status(500).json({ error: 'Erro ao listar logs' });
    }
  }
};

module.exports = logController; 