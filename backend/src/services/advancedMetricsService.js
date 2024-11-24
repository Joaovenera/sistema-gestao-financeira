const promClient = require('prom-client');
const logger = require('../utils/logger');

// Criar registro padrão de métricas
const register = new promClient.Registry();

// Adicionar métricas padrão do Node.js
promClient.collectDefaultMetrics({ register });

// Métricas customizadas
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const activeUsers = new promClient.Gauge({
  name: 'active_users_total',
  help: 'Número total de usuários ativos'
});

const transactionCounter = new promClient.Counter({
  name: 'transactions_total',
  help: 'Número total de transações processadas',
  labelNames: ['type', 'status']
});

const databaseQueryDuration = new promClient.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duração das queries no banco de dados',
  labelNames: ['query_type'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

const redisOperationDuration = new promClient.Histogram({
  name: 'redis_operation_duration_seconds',
  help: 'Duração das operações no Redis',
  labelNames: ['operation_type'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5]
});

register.registerMetric(httpRequestDuration);
register.registerMetric(activeUsers);
register.registerMetric(transactionCounter);
register.registerMetric(databaseQueryDuration);
register.registerMetric(redisOperationDuration);

const metricsService = {
  register,
  
  recordHttpRequest: ({ method, route, statusCode, duration }) => {
    httpRequestDuration.labels(method, route, statusCode).observe(duration);
  },

  updateActiveUsers: (count) => {
    activeUsers.set(count);
  },

  incrementTransaction: (type, status) => {
    transactionCounter.labels(type, status).inc();
  },

  recordDatabaseQuery: (queryType, duration) => {
    databaseQueryDuration.labels(queryType).observe(duration);
  },

  recordRedisOperation: (operationType, duration) => {
    redisOperationDuration.labels(operationType).observe(duration);
  }
};

module.exports = metricsService; 