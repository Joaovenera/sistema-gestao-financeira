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

  async findAll(filters = {}) {
    try {
      let query = `SELECT * FROM ${this.tableName} WHERE 1=1`;
      const params = [];

      Object.entries(filters).forEach(([key, value]) => {
        query += ` AND ${key} = ?`;
        params.push(value);
      });

      const [rows] = await this.pool.execute(query, params);
      return rows;
    } catch (error) {
      logger.error(`Error finding all ${this.tableName}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);

      const [result] = await this.pool.execute(
        `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
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
      const sets = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), id];

      const [result] = await this.pool.execute(
        `UPDATE ${this.tableName} SET ${sets} WHERE id = ?`,
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