const request = require('supertest');
const app = require('../../src/app');
const factories = require('../helpers/factories');
const { generateTestToken } = require('../helpers/auth');

describe('Transaction Routes', () => {
  let user;
  let token;

  beforeEach(async () => {
    user = await factories.user();
    token = generateTestToken(user);
  });

  describe('POST /api/transactions', () => {
    it('should create a transaction when authenticated', async () => {
      const transactionData = await factories.transaction({ user_id: user.id });

      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send(transactionData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe(transactionData.amount);
      expect(response.body.type).toBe(transactionData.type);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
    });
  });

  describe('GET /api/transactions', () => {
    beforeEach(async () => {
      // Criar algumas transações para teste
      await Promise.all([
        factories.transaction({ user_id: user.id }),
        factories.transaction({ user_id: user.id }),
        factories.transaction({ user_id: user.id })
      ]);
    });

    it('should list user transactions', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('amount');
    });

    it('should filter transactions by date range', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .query({
          start_date: '2024-01-01',
          end_date: '2024-12-31'
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
}); 