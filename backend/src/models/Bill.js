const BaseModel = require('./BaseModel');
const logger = require('../utils/logger');

class Bill extends BaseModel {
  constructor() {
    super('bills');
  }

  async findByUserId(userId, filters = {}) {
    try {
      let query = `
        SELECT b.*, c.name as category_name 
        FROM ${this.tableName} b
        JOIN categories c ON b.category_id = c.id
        WHERE b.user_id = ?
      `;
      const params = [userId];

      if (filters.status) {
        query += ' AND b.status = ?';
        params.push(filters.status);
      }

      if (filters.due_date_start) {
        query += ' AND b.due_date >= ?';
        params.push(filters.due_date_start);
      }

      if (filters.due_date_end) {
        query += ' AND b.due_date <= ?';
        params.push(filters.due_date_end);
      }

      if (filters.type) {
        query += ' AND b.type = ?';
        params.push(filters.type);
      }

      query += ' ORDER BY b.due_date ASC';

      const [rows] = await this.pool.execute(query, params);
      return rows;
    } catch (error) {
      logger.error('Error finding bills:', error);
      throw error;
    }
  }

  async getOverdueBills(userId) {
    try {
      const query = `
        SELECT * FROM ${this.tableName}
        WHERE user_id = ?
          AND status = 'PENDING'
          AND due_date < CURDATE()
        ORDER BY due_date ASC
      `;

      const [rows] = await this.pool.execute(query, [userId]);
      return rows;
    } catch (error) {
      logger.error('Error getting overdue bills:', error);
      throw error;
    }
  }

  async markAsPaid(billId, userId, paymentData) {
    try {
      const [result] = await this.pool.execute(
        `UPDATE ${this.tableName} 
         SET status = 'PAID', 
             paid_amount = ?,
             paid_date = ?,
             payment_method = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND user_id = ?`,
        [
          paymentData.amount,
          paymentData.date,
          paymentData.method,
          billId,
          userId
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      logger.error('Error marking bill as paid:', error);
      throw error;
    }
  }
}

module.exports = new Bill(); 