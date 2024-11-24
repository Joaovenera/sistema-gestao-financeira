const logService = require('../services/logService');
const logger = require('../utils/logger');

const auditMiddleware = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    const startTime = process.hrtime();

    res.send = function (data) {
      res.locals.responseBody = data;
      originalSend.apply(res, arguments);
    };

    res.on('finish', async () => {
      const duration = process.hrtime(startTime);
      const durationInMs = (duration[0] * 1000) + (duration[1] / 1e6);

      try {
        await logService.logActivity({
          user_id: req.user?.id,
          action,
          entity_type: req.baseUrl.split('/').pop(),
          entity_id: req.params.id,
          details: {
            method: req.method,
            path: req.path,
            query: req.query,
            body: req.method !== 'GET' ? req.body : undefined,
            status: res.statusCode,
            duration: durationInMs,
            ip: req.ip,
            user_agent: req.headers['user-agent']
          }
        });
      } catch (error) {
        logger.error('Error logging audit activity:', error);
      }
    });

    next();
  };
};

module.exports = auditMiddleware; 