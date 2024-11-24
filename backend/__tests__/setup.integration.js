require('dotenv').config({ path: '.env.test' });
const { pool } = require('../src/config/database');
const { runMigrations } = require('../src/database/migrate');

beforeAll(async () => {
  await runMigrations();
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await cleanDatabase();
}); 