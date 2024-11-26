const { pool } = require('../config/database');
const logger = require('../utils/logger');

const cardService = {
  async getCards(userId) {
    try {
      const [cards] = await pool.execute(
        `SELECT * FROM credit_cards WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
      );
      return cards;
    } catch (error) {
      logger.error('Error getting cards:', error);
      throw error;
    }
  },

  async createCard(userId, cardData) {
    try {
      const { name, last_digits, brand, credit_limit, closing_day, due_day } = cardData;

      const [result] = await pool.execute(
        `INSERT INTO credit_cards (user_id, name, last_digits, brand, credit_limit, closing_day, due_day)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, name, last_digits, brand, credit_limit, closing_day, due_day]
      );

      return {
        id: result.insertId,
        user_id: userId,
        ...cardData
      };
    } catch (error) {
      logger.error('Error creating card:', error);
      throw error;
    }
  },

  async updateCard(cardId, userId, cardData) {
    try {
      const { name, last_digits, brand, credit_limit, closing_day, due_day } = cardData;

      const [result] = await pool.execute(
        `UPDATE credit_cards 
         SET name = ?, last_digits = ?, brand = ?, credit_limit = ?, closing_day = ?, due_day = ?
         WHERE id = ? AND user_id = ?`,
        [name, last_digits, brand, credit_limit, closing_day, due_day, cardId, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Cartão não encontrado');
      }

      return {
        id: cardId,
        user_id: userId,
        ...cardData
      };
    } catch (error) {
      logger.error('Error updating card:', error);
      throw error;
    }
  },

  async deleteCard(cardId, userId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM credit_cards WHERE id = ? AND user_id = ?',
        [cardId, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Cartão não encontrado');
      }

      return true;
    } catch (error) {
      logger.error('Error deleting card:', error);
      throw error;
    }
  }
};

module.exports = cardService; 