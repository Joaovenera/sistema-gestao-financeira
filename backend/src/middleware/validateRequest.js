const logger = require('../utils/logger');

const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (!error) return next();

    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    logger.warn('Validation error:', { 
      path: req.path, 
      errors,
      body: req.body 
    });

    res.status(400).json({
      error: 'Dados inválidos',
      details: errors
    });
  };
};

module.exports = validateRequest; 