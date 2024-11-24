const metricsService = require('../services/advancedMetricsService');

const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;

    metricsService.recordHttpRequest({
      method: req.method,
      route: req.route?.path || req.path,
      statusCode: res.statusCode,
      duration: durationInSeconds
    });
  });

  next();
};

module.exports = metricsMiddleware; 