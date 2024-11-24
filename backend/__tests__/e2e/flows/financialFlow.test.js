const request = require('supertest');
const app = require('../../../src/app');
const factories = require('../../helpers/factories');

describe('Financial Management Flow', () => {
  let user;
  let token;
  let category;

  beforeAll(async () => {
    // Registrar usuário
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@123'
      });

    user = registerResponse.body.user;
    token = registerResponse.body.token;

    // Criar categoria
    const categoryResponse = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Salário',
        type: 'INCOME',
        description: 'Rendimentos mensais'
      });

    category = categoryResponse.body;
  });

  describe('Fluxo Completo de Gestão Financeira', () => {
    it('deve completar um ciclo financeiro mensal', async () => {
      // 1. Criar transação de receita
      const incomeResponse = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'INCOME',
          amount: 5000,
          category_id: category.id,
          date: new Date().toISOString(),
          description: 'Salário mensal'
        });

      expect(incomeResponse.status).toBe(201);

      // 2. Criar cartão de crédito
      const cardResponse = await request(app)
        .post('/api/credit-cards')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Cartão Principal',
          last_digits: '1234',
          brand: 'VISA',
          credit_limit: 10000,
          closing_day: 5,
          due_day: 10
        });

      expect(cardResponse.status).toBe(201);
      const card = cardResponse.body;

      // 3. Criar transação no cartão
      const cardTransactionResponse = await request(app)
        .post(`/api/credit-cards/${card.id}/transactions`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 1000,
          description: 'Compra parcelada',
          category_id: category.id,
          transaction_date: new Date().toISOString(),
          installments: 3
        });

      expect(cardTransactionResponse.status).toBe(201);

      // 4. Criar conta a pagar
      const billResponse = await request(app)
        .post('/api/bills')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'PAYABLE',
          category_id: category.id,
          description: 'Aluguel',
          amount: 2000,
          due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          recurrence: 'MONTHLY'
        });

      expect(billResponse.status).toBe(201);

      // 5. Verificar relatório financeiro
      const reportResponse = await request(app)
        .get('/api/reports/financial-summary')
        .set('Authorization', `Bearer ${token}`)
        .query({
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });

      expect(reportResponse.status).toBe(200);
      expect(reportResponse.body.income).toBe(5000);
      expect(reportResponse.body.expenses).toBeGreaterThan(0);
      expect(reportResponse.body.balance).toBeDefined();

      // 6. Verificar análise preditiva
      const analysisResponse = await request(app)
        .get('/api/analytics/predictions')
        .set('Authorization', `Bearer ${token}`)
        .query({ months_ahead: 3 });

      expect(analysisResponse.status).toBe(200);
      expect(analysisResponse.body.predictions).toBeDefined();
      expect(analysisResponse.body.confidence_score).toBeDefined();
    });

    it('deve lidar com cenários de erro corretamente', async () => {
      // 1. Tentar criar transação com valor negativo
      const invalidTransactionResponse = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'INCOME',
          amount: -100,
          category_id: category.id,
          date: new Date().toISOString()
        });

      expect(invalidTransactionResponse.status).toBe(400);

      // 2. Tentar acessar cartão inexistente
      const invalidCardResponse = await request(app)
        .get('/api/credit-cards/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(invalidCardResponse.status).toBe(404);

      // 3. Tentar criar conta com data passada
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const invalidBillResponse = await request(app)
        .post('/api/bills')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'PAYABLE',
          category_id: category.id,
          amount: 100,
          due_date: pastDate.toISOString()
        });

      expect(invalidBillResponse.status).toBe(400);
    });
  });
}); 