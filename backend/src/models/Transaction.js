const BaseModel = require('./BaseModel');

class Transaction extends BaseModel {
  constructor() {
    super('transactions');
  }

  async findByUserId(userId, filters = {}) {
    try {
      let query = `
        SELECT t.*, c.name as category_name 
        FROM ${this.tableName} t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ?
      `;
      const params = [userId];

      if (filters.start_date) {
        query += ' AND t.date >= ?';
        params.push(filters.start_date);
      }

      if (filters.end_date) {
        query += ' AND t.date <= ?';
        params.push(filters.end_date);
      }

      if (filters.type) {
        query += ' AND t.type = ?';
        params.push(filters.type);
      }

      if (filters.category_id) {
        query += ' AND t.category_id = ?';
        params.push(filters.category_id);
      }

      query += ' ORDER BY t.date DESC';

      if (filters.limit) {
        query += ' LIMIT ?';
        params.push(parseInt(filters.limit));
      }

      if (filters.offset) {
        query += ' OFFSET ?';
        params.push(parseInt(filters.offset));
      }

      const [rows] = await this.pool.execute(query, params);
      return rows;
    } catch (error) {
      logger.error('Error finding transactions:', error);
      throw error;
    }
  }

  async getBalance(userId, date = new Date()) {
    try {
      const query = `
        SELECT 
          SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as total_income,
          SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as total_expense
        FROM ${this.tableName}
        WHERE user_id = ? AND date <= ?
      `;

      const [rows] = await this.pool.execute(query, [userId, date]);
      const { total_income = 0, total_expense = 0 } = rows[0];
      
      return {
        income: parseFloat(total_income),
        expense: parseFloat(total_expense),
        balance: parseFloat(total_income) - parseFloat(total_expense)
      };
    } catch (error) {
      logger.error('Error calculating balance:', error);
      throw error;
    }
  }
}

module.exports = new Transaction(); 