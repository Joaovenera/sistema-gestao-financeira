const Joi = require('joi');

const billValidator = {
  create: Joi.object({
    type: Joi.string().valid('PAYABLE', 'RECEIVABLE').required(),
    category_id: Joi.number().integer().positive().required(),
    description: Joi.string().max(500).allow('', null),
    amount: Joi.number().positive().required(),
    due_date: Joi.date().iso().required(),
    recurrence: Joi.string().valid('NONE', 'MONTHLY', 'YEARLY').default('NONE')
  }),

  update: Joi.object({
    type: Joi.string().valid('PAYABLE', 'RECEIVABLE'),
    category_id: Joi.number().integer().positive(),
    description: Joi.string().max(500).allow('', null),
    amount: Joi.number().positive(),
    due_date: Joi.date().iso(),
    recurrence: Joi.string().valid('NONE', 'MONTHLY', 'YEARLY')
  }),

  markAsPaid: Joi.object({
    paid_amount: Joi.number().positive().required(),
    paid_date: Joi.date().iso().required(),
    payment_method: Joi.string().required()
  }),

  listFilters: Joi.object({
    status: Joi.string().valid('PENDING', 'PAID', 'CANCELLED'),
    type: Joi.string().valid('PAYABLE', 'RECEIVABLE'),
    due_date_start: Joi.date().iso(),
    due_date_end: Joi.date().iso().min(Joi.ref('due_date_start')),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};

module.exports = billValidator; 