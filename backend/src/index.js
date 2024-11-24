require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('redis');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const routes = require('./routes');
const { testConnection } = require('./config/database');
const { setupScheduledJobs } = require('./services/schedulerService');
const { setupMetricsServer } = require('./services/metricsService');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const { setupTracing } = require('./services/tracingService');
const { setupAPM } = require('./services/apmService');
const { setupLogAggregation } = require('./services/logAggregationService');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do Redis
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD
});

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento Financeiro',
      version: '1.0.0',
      description: 'Documentação da API de gerenciamento financeiro empresarial'
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: 'Servidor de desenvolvimento'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Rate limiting
const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate_limit:'
  }),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10)
});

// Middlewares
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV
  });
});

// Error handling
app.use(errorHandler);

// Inicialização do servidor
const startServer = async () => {
  try {
    // Inicializar APM
    if (process.env.APM_ENABLED === 'true') {
      setupAPM();
      logger.info('APM initialized');
    }

    // Inicializar Tracing
    if (process.env.TRACING_ENABLED === 'true') {
      setupTracing();
      logger.info('Distributed tracing initialized');
    }

    // Configurar agregação de logs
    setupLogAggregation();
    
    // Conectar ao Redis
    await redisClient.connect();
    logger.info('Redis connected successfully');

    // Testar conexão com o banco
    await testConnection();
    logger.info('Database connected successfully');

    // Configurar jobs agendados
    setupScheduledJobs();
    logger.info('Scheduled jobs configured');

    // Configurar servidor de métricas
    if (process.env.ENABLE_METRICS === 'true') {
      setupMetricsServer();
      logger.info('Metrics server started');
    }

    // Iniciar servidor principal
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      logger.info(`Swagger documentation available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Starting graceful shutdown...');
  
  // Fechar conexões
  await redisClient.quit();
  await pool.end();
  
  process.exit(0);
});

startServer(); 