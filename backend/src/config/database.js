const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    await pool.getConnection();
    logger.info('Database connection successful');
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
}

module.exports = {
  pool,
  testConnection
}; 