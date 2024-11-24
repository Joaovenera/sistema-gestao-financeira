const backupService = require('../services/backupService');
const logger = require('../utils/logger');

const backupController = {
  createBackup: async (req, res) => {
    try {
      const backupPath = await backupService.createBackup();
      res.json({
        message: 'Backup criado com sucesso',
        path: backupPath
      });
    } catch (error) {
      logger.error('Error creating backup:', error);
      res.status(500).json({ error: 'Erro ao criar backup' });
    }
  },

  restoreBackup: async (req, res) => {
    try {
      const { id } = req.params;
      await backupService.restoreBackup(id);
      res.json({ message: 'Backup restaurado com sucesso' });
    } catch (error) {
      logger.error('Error restoring backup:', error);
      res.status(500).json({ error: 'Erro ao restaurar backup' });
    }
  },

  listBackups: async (req, res) => {
    try {
      const filters = req.query;
      const backups = await backupService.listBackups(filters);
      res.json(backups);
    } catch (error) {
      logger.error('Error listing backups:', error);
      res.status(500).json({ error: 'Erro ao listar backups' });
    }
  }
};

module.exports = backupController; 