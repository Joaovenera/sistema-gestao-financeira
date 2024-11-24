const ActivityLog = require('../models/ActivityLog');
const logger = require('../utils/logger');

const logService = {
  async logActivity(data) {
    try {
      const { user_id, action, entity_type = 'auth', entity_id = null, details = null, ip_address } = data;
      
      await ActivityLog.create({
        user_id,
        action,
        entity_type,
        entity_id,
        details: details ? JSON.stringify(details) : null,
        ip_address
      });

      logger.info('Activity logged:', { ...data });
    } catch (error) {
      logger.error('Error logging activity:', error);
    }
  }
};

module.exports = logService; 