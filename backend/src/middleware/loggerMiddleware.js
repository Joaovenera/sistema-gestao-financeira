const logService = require('../services/logService');
const logger = require('../utils/logger');

const loggerMiddleware = async (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function (data) {
    res.locals.responseBody = data;
    originalSend.apply(res, arguments);
  };

  res.on('finish', async () => {
    try {
      if (req.user) {
        const logData = {
          user_id: req.user.id,
          action: req.method,
          entity_type: req.baseUrl.split('/').pop(),
          entity_id: req.params.id,
          details: {
            path: req.path,
            query: req.query,
            body: req.method !== 'GET' ? req.body : undefined,
            status: res.statusCode,
            response: res.locals.responseBody
          },
          ip_address: req.ip
        };

        await logService.createLog(logData);
      }
    } catch (error) {
      logger.error('Error creating activity log:', error);
    }
  });

  next();
};

module.exports = loggerMiddleware; 