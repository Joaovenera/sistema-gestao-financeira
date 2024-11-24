const apm = require('elastic-apm-node');
const logger = require('../utils/logger');

const setupAPM = () => {
  try {
    const apmInstance = apm.start({
      serviceName: 'financial-api',
      serverUrl: process.env.APM_SERVER_URL,
      environment: process.env.NODE_ENV,
      active: process.env.APM_ENABLED === 'true',
      logLevel: 'error',
      captureBody: 'errors',
      errorOnAbortedRequests: true,
      captureErrorLogStackTraces: 'always',
      metricsInterval: '30s',
      transactionSampleRate: 1.0,
      centralConfig: true,
      cloudProvider: 'none',
      stackTraceLimit: 50,
      captureSpanStackTraces: true,
      usePathAsTransactionName: true
    });

    logger.info('APM initialized successfully');
    return apmInstance;
  } catch (error) {
    logger.error('Error initializing APM:', error);
    return null;
  }
};

module.exports = { setupAPM }; 