const BaseModel = require('./BaseModel');
const logger = require('../utils/logger');

class BankReconciliation extends BaseModel {
  constructor() {
    super('bank_reconciliation');
  }

  async findPendingReconciliations(userId) {
    try {
      const [rows] = await this.pool.execute(
        `SELECT * FROM ${this.tableName} 
         WHERE user_id = ? AND status = 'PENDING'
         ORDER BY created_at DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      logger.error('Error finding pending reconciliations:', error);
      throw error;
    }
  }

  async updateReconciliationStatus(id, status, details) {
    try {
      const [result] = await this.pool.execute(
        `UPDATE ${this.tableName} 
         SET status = ?, details = ?, processed_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [status, JSON.stringify(details), id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('Error updating reconciliation status:', error);
      throw error;
    }
  }
}

module.exports = new BankReconciliation(); 