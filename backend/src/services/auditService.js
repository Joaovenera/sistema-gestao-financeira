const { pool } = require('../config/database');
const logger = require('../utils/logger');

const auditService = {
  async getAuditTrail(filters = {}) {
    try {
      let query = `
        SELECT 
          al.*,
          u.name as user_name,
          u.email as user_email
        FROM activity_logs al
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

      const [logs] = await pool.execute(query, params);
      return logs;
    } catch (error) {
      logger.error('Error getting audit trail:', error);
      throw error;
    }
  },

  async getSecurityEvents(filters = {}) {
    try {
      const query = `
        SELECT * FROM activity_logs
        WHERE action IN ('LOGIN_FAILED', 'PASSWORD_RESET', 'PERMISSION_DENIED')
          AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        ORDER BY created_at DESC
      `;

      const [events] = await pool.execute(query);
      return events;
    } catch (error) {
      logger.error('Error getting security events:', error);
      throw error;
    }
  },

  async generateComplianceReport(period) {
    try {
      const reports = {
        user_activity: await this.getUserActivitySummary(period),
        security_events: await this.getSecurityEventsSummary(period),
        data_access: await this.getDataAccessSummary(period),
        system_changes: await this.getSystemChangesSummary(period)
      };

      return {
        period,
        generated_at: new Date(),
        reports
      };
    } catch (error) {
      logger.error('Error generating compliance report:', error);
      throw error;
    }
  },

  async getUserActivitySummary(period) {
    // Implementar resumo de atividades do usuário
  },

  async getSecurityEventsSummary(period) {
    // Implementar resumo de eventos de segurança
  },

  async getDataAccessSummary(period) {
    // Implementar resumo de acesso a dados
  },

  async getSystemChangesSummary(period) {
    // Implementar resumo de mudanças no sistema
  }
};

module.exports = auditService; 