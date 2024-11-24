const BaseModel = require('./BaseModel');
const logger = require('../utils/logger');

class ActivityLog extends BaseModel {
  constructor() {
    super('activity_logs');
  }

  async create(data) {
    try {
      const { user_id, action, entity_type, entity_id, details, ip_address } = data;
      
      const [result] = await this.pool.execute(
        `INSERT INTO ${this.tableName} 
         (user_id, action, entity_type, entity_id, details, ip_address) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, action, entity_type, entity_id, JSON.stringify(details), ip_address]
      );

      return { id: result.insertId, ...data };
    } catch (error) {
      logger.error('Error creating activity log:', error);
      throw error;
    }
  }

  async findWithFilters(filters = {}) {
    try {
      let query = `
        SELECT al.*, u.name as user_name 
        FROM ${this.tableName} al
        LEFT JOIN users u ON al.user_id = u.id
        WHERE 1=1
      `;
      const params = [];

      if (filters.user_id) {
        query += ' AND al.user_id = ?';
        params.push(filters.user_id);
      }

      if (filters.action) {
        query += ' AND al.action = ?';
        params.push(filters.action);
      }

      if (filters.entity_type) {
        query += ' AND al.entity_type = ?';
        params.push(filters.entity_type);
      }

      if (filters.start_date) {
        query += ' AND al.created_at >= ?';
        params.push(filters.start_date);
      }

      if (filters.end_date) {
        query += ' AND al.created_at <= ?';
        params.push(filters.end_date);
      }

      query += ' ORDER BY al.created_at DESC';

      if (filters.limit) {
        query += ' LIMIT ?';
        params.push(parseInt(filters.limit));
      }

      const [logs] = await this.pool.execute(query, params);
      return logs;
    } catch (error) {
      logger.error('Error finding activity logs:', error);
      throw error;
    }
  }

  async getSecurityEvents(period = '24 hours') {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE action IN ('LOGIN_FAILED', 'PASSWORD_RESET', 'PERMISSION_DENIED')
          AND created_at >= DATE_SUB(NOW(), INTERVAL ?)
        ORDER BY created_at DESC
      `;

      const [events] = await this.pool.execute(query, [period]);
      return events;
    } catch (error) {
      logger.error('Error getting security events:', error);
      throw error;
    }
  }
}

module.exports = new ActivityLog(); 