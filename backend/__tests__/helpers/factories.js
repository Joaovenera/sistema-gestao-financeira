const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const factories = {
  user: async (overrides = {}) => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: await bcrypt.hash('Test@123', 10),
    role: 'user',
    status: 'active',
    ...overrides
  }),

  transaction: (overrides = {}) => ({
    type: faker.helpers.arrayElement(['INCOME', 'EXPENSE']),
    amount: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
    description: faker.finance.transactionDescription(),
    date: faker.date.recent(),
    category_id: faker.number.int({ min: 1, max: 10 }),
    ...overrides
  }),

  category: (overrides = {}) => ({
    name: faker.commerce.department(),
    type: faker.helpers.arrayElement(['INCOME', 'EXPENSE']),
    description: faker.lorem.sentence(),
    ...overrides
  }),

  bill: (overrides = {}) => ({
    type: faker.helpers.arrayElement(['PAYABLE', 'RECEIVABLE']),
    amount: faker.number.float({ min: 100, max: 5000, precision: 0.01 }),
    description: faker.commerce.productDescription(),
    due_date: faker.date.future(),
    status: 'PENDING',
    ...overrides
  })
};

module.exports = factories; 