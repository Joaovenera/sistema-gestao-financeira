const Joi = require('joi');

const creditCardValidator = {
  create: Joi.object({
    name: Joi.string().required(),
    last_digits: Joi.string().length(4).pattern(/^\d+$/).required(),
    brand: Joi.string().required(),
    credit_limit: Joi.number().positive().required(),
    closing_day: Joi.number().integer().min(1).max(31).required(),
    due_day: Joi.number().integer().min(1).max(31).required()
  }),

  addTransaction: Joi.object({
    amount: Joi.number().positive().required(),
    description: Joi.string().max(500).required(),
    category_id: Joi.number().integer().positive().required(),
    transaction_date: Joi.date().iso().required(),
    installments: Joi.number().integer().min(1).max(48).default(1)
  }),

  listInvoice: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2000).max(2100).required()
  })
};

module.exports = creditCardValidator; 