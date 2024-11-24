require('dotenv').config({ path: '.env.test' });
const { pool } = require('../src/config/database');
const { runMigrations } = require('../src/database/migrate');
const redis = require('../src/config/redis');

beforeAll(async () => {
  // Garantir banco limpo e migrado
  await runMigrations();
  // Conectar ao Redis
  await redis.connect();
});

afterAll(async () => {
  await pool.end();
  await redis.disconnect();
});

beforeEach(async () => {
  // Limpar dados antes de cada teste
  await cleanDatabase();
  await redis.flushAll();
});

const cleanDatabase = async () => {
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  const [tables] = await pool.query('SHOW TABLES');
  for (const table of tables) {
    const tableName = Object.values(table)[0];
    await pool.query(`TRUNCATE TABLE ${tableName}`);
  }
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');
}; 