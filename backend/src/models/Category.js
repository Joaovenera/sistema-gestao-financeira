const BaseModel = require('./BaseModel');

class Category extends BaseModel {
  constructor() {
    super('categories');
  }

  async findByType(type) {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM categories WHERE type = ?',
        [type]
      );
      return rows;
    } catch (error) {
      logger.error('Error finding categories by type:', error);
      throw error;
    }
  }

  async getTransactionCount(categoryId) {
    try {
      const [rows] = await this.pool.execute(
        'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?',
        [categoryId]
      );
      return rows[0].count;
    } catch (error) {
      logger.error('Error counting transactions for category:', error);
      throw error;
    }
  }
}

module.exports = new Category(); 