const BaseModel = require('./BaseModel');
const logger = require('../utils/logger');

class CreditCard extends BaseModel {
  constructor() {
    super('credit_cards');
  }

  async findByUserId(userId) {
    try {
      const query = `
        SELECT 
          cc.*,
          (SELECT SUM(amount) 
           FROM credit_card_transactions 
           WHERE card_id = cc.id 
           AND status = 'PENDING') as current_balance
        FROM ${this.tableName} cc
        WHERE cc.user_id = ?
      `;

      const [rows] = await this.pool.execute(query, [userId]);
      return rows;
    } catch (error) {
      logger.error('Error finding credit cards:', error);
      throw error;
    }
  }

  async getInvoice(cardId, month, year) {
    try {
      const query = `
        SELECT 
          cct.*,
          c.name as category_name
        FROM credit_card_transactions cct
        JOIN categories c ON cct.category_id = c.id
        WHERE cct.card_id = ?
          AND MONTH(cct.transaction_date) = ?
          AND YEAR(cct.transaction_date) = ?
        ORDER BY cct.transaction_date ASC
      `;

      const [transactions] = await this.pool.execute(query, [cardId, month, year]);

      const [summary] = await this.pool.execute(
        `SELECT 
          SUM(amount) as total_amount,
          COUNT(*) as transaction_count
         FROM credit_card_transactions
         WHERE card_id = ?
           AND MONTH(transaction_date) = ?
           AND YEAR(transaction_date) = ?`,
        [cardId, month, year]
      );

      return {
        transactions,
        summary: summary[0]
      };
    } catch (error) {
      logger.error('Error getting credit card invoice:', error);
      throw error;
    }
  }

  async addTransaction(cardId, transactionData) {
    try {
      const { amount, description, category_id, transaction_date } = transactionData;

      const [result] = await this.pool.execute(
        `INSERT INTO credit_card_transactions 
         (card_id, amount, description, category_id, transaction_date) 
         VALUES (?, ?, ?, ?, ?)`,
        [cardId, amount, description, category_id, transaction_date]
      );

      return { id: result.insertId, ...transactionData };
    } catch (error) {
      logger.error('Error adding credit card transaction:', error);
      throw error;
    }
  }

  async getLimitsStatus(cardId) {
    try {
      const [card] = await this.pool.execute(
        'SELECT credit_limit FROM credit_cards WHERE id = ?',
        [cardId]
      );

      const [usage] = await this.pool.execute(
        `SELECT SUM(amount) as used_amount 
         FROM credit_card_transactions 
         WHERE card_id = ? AND status = 'PENDING'`,
        [cardId]
      );

      const creditLimit = card[0].credit_limit;
      const usedAmount = usage[0].used_amount || 0;
      const availableLimit = creditLimit - usedAmount;

      return {
        credit_limit: creditLimit,
        used_amount: usedAmount,
        available_limit: availableLimit,
        usage_percentage: (usedAmount / creditLimit) * 100
      };
    } catch (error) {
      logger.error('Error getting credit card limits:', error);
      throw error;
    }
  }
}

module.exports = new CreditCard(); 