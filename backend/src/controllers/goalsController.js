const goalsService = require('../services/goalsService');
const logger = require('../utils/logger');

const goalsController = {
  async getGoals(req, res) {
    try {
      const goals = await goalsService.getGoals(req.user.id);
      res.json(goals);
    } catch (error) {
      logger.error('Error getting goals:', error);
      res.status(500).json({ message: 'Erro ao buscar metas' });
    }
  },

  async createGoal(req, res) {
    try {
      const goal = await goalsService.createGoal(req.user.id, req.body);
      res.status(201).json(goal);
    } catch (error) {
      logger.error('Error creating goal:', error);
      res.status(500).json({ message: 'Erro ao criar meta' });
    }
  },

  async updateGoal(req, res) {
    try {
      const goal = await goalsService.updateGoal(req.params.id, req.body);
      res.json(goal);
    } catch (error) {
      logger.error('Error updating goal:', error);
      res.status(500).json({ message: 'Erro ao atualizar meta' });
    }
  },

  async deleteGoal(req, res) {
    try {
      await goalsService.deleteGoal(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting goal:', error);
      res.status(500).json({ message: 'Erro ao deletar meta' });
    }
  }
};

module.exports = goalsController; 