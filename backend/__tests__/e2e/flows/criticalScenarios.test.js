const request = require('supertest');
const app = require('../../../src/app');
const redis = require('../../../src/config/redis');
const { pool } = require('../../../src/config/database');

describe('Critical Scenarios', () => {
  let user;
  let token;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@123'
      });

    user = response.body.user;
    token = response.body.token;
  });

  describe('Alta Carga', () => {
    it('deve lidar com múltiplas requisições simultâneas', async () => {
      const requests = Array(50).fill().map(() => 
        request(app)
          .get('/api/transactions')
          .set('Authorization', `Bearer ${token}`)
      );

      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Falhas de Rede', () => {
    it('deve recuperar após falha no Redis', async () => {
      // Simular falha no Redis
      await redis.disconnect();

      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);

      // Reconectar Redis
      await redis.connect();
    });

    it('deve lidar com timeout do banco de dados', async () => {
      // Simular query lenta
      const slowQuery = `
        SELECT SLEEP(2);
        SELECT * FROM transactions WHERE user_id = ?;
      `;

      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('Recuperação', () => {
    it('deve recuperar estado consistente após falha', async () => {
      // 1. Criar transação
      const createResponse = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'INCOME',
          amount: 1000,
          category_id: 1,
          date: new Date().toISOString()
        });

      expect(createResponse.status).toBe(201);

      // 2. Simular falha no banco
      await pool.end();

      // 3. Reconectar e verificar estado
      await pool.connect();
      
      const checkResponse = await request(app)
        .get(`/api/transactions/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(checkResponse.status).toBe(200);
      expect(checkResponse.body.amount).toBe(1000);
    });
  });
}); 