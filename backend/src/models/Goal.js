const BaseModel = require('./BaseModel');
const db = require('../config/database');

class Goal extends BaseModel {
  static async findByUserId(userId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(data) {
    try {
      const [result] = await db.query(
        'INSERT INTO goals (user_id, title, target_amount, current_amount, deadline, category_id) VALUES (?, ?, ?, ?, ?, ?)',
        [data.user_id, data.title, data.target_amount, data.current_amount || 0, data.deadline, data.category_id]
      );
      return { id: result.insertId, ...data };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    try {
      await db.query(
        'UPDATE goals SET title = ?, target_amount = ?, current_amount = ?, deadline = ?, category_id = ? WHERE id = ?',
        [data.title, data.target_amount, data.current_amount, data.deadline, data.category_id, id]
      );
      return { id, ...data };
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db.query('DELETE FROM goals WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Goal; 