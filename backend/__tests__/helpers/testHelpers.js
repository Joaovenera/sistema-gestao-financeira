const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../../src/config/database');

const testHelpers = {
  async createTestUser(userData = {}) {
    const defaultUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('Test@123', 10),
      role: 'user',
      status: 'active'
    };

    const user = { ...defaultUser, ...userData };
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      [user.name, user.email, user.password, user.role, user.status]
    );

    return { id: result.insertId, ...user };
  },

  generateTestToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  },

  async cleanDatabase() {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    const [tables] = await pool.query('SHOW TABLES');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      await pool.query(`TRUNCATE TABLE ${tableName}`);
    }
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};

module.exports = testHelpers; 