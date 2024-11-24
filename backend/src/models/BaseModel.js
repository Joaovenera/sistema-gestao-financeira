const { pool } = require('../config/database');
const logger = require('../utils/logger');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = pool;
  }

  async findById(id) {
    try {
      const [rows] = await this.pool.execute(
        `SELECT * FROM ${this.tableName} WHERE id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      logger.error(`Error finding ${this.tableName} by id:`, error);
      throw error;
    }
  }

  async findOne(conditions) {
    try {
      const entries = Object.entries(conditions);
      const where = entries.map(([key]) => `${key} = ?`).join(' AND ');
      const values = entries.map(([_, value]) => value);

      const [rows] = await this.pool.execute(
        `SELECT * FROM ${this.tableName} WHERE ${where} LIMIT 1`,
        values
      );
      return rows[0];
    } catch (error) {
      logger.error(`Error finding ${this.tableName}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map(() => '?').join(', ');

      const [result] = await this.pool.execute(
        `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
        values
      );

      return { id: result.insertId, ...data };
    } catch (error) {
      logger.error(`Error creating ${this.tableName}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const entries = Object.entries(data);
      const set = entries.map(([key]) => `${key} = ?`).join(', ');
      const values = [...entries.map(([_, value]) => value), id];

      const [result] = await this.pool.execute(
        `UPDATE ${this.tableName} SET ${set} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      logger.error(`Error updating ${this.tableName}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const [result] = await this.pool.execute(
        `DELETE FROM ${this.tableName} WHERE id = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      logger.error(`Error deleting ${this.tableName}:`, error);
      throw error;
    }
  }
}

module.exports = BaseModel; 