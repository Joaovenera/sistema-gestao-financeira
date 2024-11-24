const Joi = require('joi');

const transactionValidator = {
  create: Joi.object({
    type: Joi.string().valid('INCOME', 'EXPENSE').required(),
    amount: Joi.number().positive().required(),
    category_id: Joi.number().integer().positive().required(),
    date: Joi.date().iso().required(),
    description: Joi.string().max(500).allow('', null)
  }),

  update: Joi.object({
    type: Joi.string().valid('INCOME', 'EXPENSE'),
    amount: Joi.number().positive(),
    category_id: Joi.number().integer().positive(),
    date: Joi.date().iso(),
    description: Joi.string().max(500).allow('', null)
  }),

  listFilters: Joi.object({
    start_date: Joi.date().iso(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')),
    category: Joi.number().integer().positive(),
    type: Joi.string().valid('INCOME', 'EXPENSE'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};

module.exports = transactionValidator; 