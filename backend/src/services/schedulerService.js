const schedule = require('node-schedule');
const { backupDatabase } = require('./backupService');
const logger = require('../utils/logger');

const setupScheduledJobs = () => {
  // Backup diário
  if (process.env.BACKUP_ENABLED === 'true') {
    schedule.scheduleJob(process.env.BACKUP_CRON, async () => {
      try {
        await backupDatabase();
        logger.info('Database backup completed successfully');
      } catch (error) {
        logger.error('Database backup failed:', error);
      }
    });
  }

  // Outros jobs agendados podem ser adicionados aqui
};

module.exports = { setupScheduledJobs }; 