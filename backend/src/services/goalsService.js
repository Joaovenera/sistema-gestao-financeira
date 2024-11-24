const Goal = require('../models/Goal');
const logger = require('../utils/logger');

const goalsService = {
  async getGoals(userId) {
    try {
      return await Goal.findByUserId(userId);
    } catch (error) {
      logger.error('Error in getGoals:', error);
      throw error;
    }
  },

  async createGoal(userId, data) {
    try {
      return await Goal.create({
        ...data,
        user_id: userId
      });
    } catch (error) {
      logger.error('Error in createGoal:', error);
      throw error;
    }
  },

  async updateGoal(id, data) {
    try {
      return await Goal.update(id, data);
    } catch (error) {
      logger.error('Error in updateGoal:', error);
      throw error;
    }
  },

  async deleteGoal(id) {
    try {
      return await Goal.delete(id);
    } catch (error) {
      logger.error('Error in deleteGoal:', error);
      throw error;
    }
  }
};

module.exports = goalsService; 