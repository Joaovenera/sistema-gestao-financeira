const { pool } = require('../config/database');
const logger = require('../utils/logger');

const goalsService = {
  async getGoals(userId) {
    try {
      const [goals] = await pool.execute(
        `SELECT * FROM goals WHERE user_id = ? ORDER BY deadline ASC`,
        [userId]
      );
      return goals;
    } catch (error) {
      logger.error('Error getting goals:', error);
      throw error;
    }
  },

  async createGoal(userId, goalData) {
    try {
      const { name, target, type, deadline } = goalData;
      
      const [result] = await pool.execute(
        `INSERT INTO goals (user_id, name, target, current, type, deadline)
         VALUES (?, ?, ?, 0, ?, ?)`,
        [userId, name, target, type, deadline]
      );

      return {
        id: result.insertId,
        user_id: userId,
        name,
        target,
        current: 0,
        type,
        deadline
      };
    } catch (error) {
      logger.error('Error creating goal:', error);
      throw error;
    }
  },

  async updateGoal(goalId, userId, goalData) {
    try {
      const { name, target, current, type, deadline } = goalData;
      
      const [result] = await pool.execute(
        `UPDATE goals 
         SET name = ?, target = ?, current = ?, type = ?, deadline = ?
         WHERE id = ? AND user_id = ?`,
        [name, target, current, type, deadline, goalId, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Meta não encontrada');
      }

      return {
        id: goalId,
        user_id: userId,
        ...goalData
      };
    } catch (error) {
      logger.error('Error updating goal:', error);
      throw error;
    }
  },

  async deleteGoal(goalId, userId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM goals WHERE id = ? AND user_id = ?',
        [goalId, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Meta não encontrada');
      }

      return true;
    } catch (error) {
      logger.error('Error deleting goal:', error);
      throw error;
    }
  }
};

module.exports = goalsService; 