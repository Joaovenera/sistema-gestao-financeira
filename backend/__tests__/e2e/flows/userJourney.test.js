const request = require('supertest');
const app = require('../../../src/app');
const factories = require('../../helpers/factories');
const { generateTestToken } = require('../../helpers/auth');

describe('User Journey Tests', () => {
  let user;
  let token;

  beforeAll(async () => {
    // Registrar usuário
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

  describe('Financial Management Flow', () => {
    it('should complete a full financial management cycle', async () => {
      // 1. Criar categoria
      const categoryResponse = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Salário',
          type: 'INCOME',
          description: 'Rendimentos mensais'
        });

      expect(categoryResponse.status).toBe(201);
      const category = categoryResponse.body;

      // 2. Criar transação
      const transactionResponse = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'INCOME',
          amount: 5000,
          category_id: category.id,
          date: new Date().toISOString(),
          description: 'Salário mensal'
        });

      expect(transactionResponse.status).toBe(201);
      const transaction = transactionResponse.body;

      // 3. Verificar balanço
      const balanceResponse = await request(app)
        .get('/api/reports/balance')
        .set('Authorization', `Bearer ${token}`);

      expect(balanceResponse.status).toBe(200);
      expect(balanceResponse.body.balance).toBe(5000);

      // 4. Gerar relatório
      const reportResponse = await request(app)
        .get('/api/reports/financial-summary')
        .set('Authorization', `Bearer ${token}`)
        .query({
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0]
        });

      expect(reportResponse.status).toBe(200);
      expect(reportResponse.body.income).toBe(5000);
    });
  });
}); 