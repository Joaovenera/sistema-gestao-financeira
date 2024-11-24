const ActivityLog = require('../models/ActivityLog');
const logger = require('../utils/logger');

const logService = {
  async logActivity(data) {
    try {
      const { user_id, action, entity_type, entity_id, details, ip_address } = data;
      
      await ActivityLog.create({
        user_id,
        action,
        entity_type,
        entity_id,
        details: JSON.stringify(details),
        ip_address
      });

      logger.info('Activity logged:', { ...data });
    } catch (error) {
      logger.error('Error logging activity:', error);
    }
  },

  async getActivityLogs(filters) {
    try {
      return await ActivityLog.findWithFilters(filters);
    } catch (error) {
      logger.error('Error getting activity logs:', error);
      throw error;
    }
  }
};

module.exports = logService; 