const logger = require('../utils/logger');

function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.reduce((acc, curr) => {
          const key = curr.path[0];
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(curr.message);
          return acc;
        }, {});

        return res.status(400).json({
          message: 'Dados inválidos',
          errors
        });
      }

      next();
    } catch (error) {
      logger.error('Validation error:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
}

module.exports = { validateRequest }; 