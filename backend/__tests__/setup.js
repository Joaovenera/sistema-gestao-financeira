require('dotenv').config({ path: '.env.test' });
const { pool } = require('../src/config/database');

beforeAll(async () => {
  // Limpar banco de dados de teste
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  const [tables] = await pool.query('SHOW TABLES');
  for (const table of tables) {
    const tableName = Object.values(table)[0];
    await pool.query(`TRUNCATE TABLE ${tableName}`);
  }
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');
});

afterAll(async () => {
  await pool.end();
}); 