const { ElasticsearchTransport } = require('winston-elasticsearch');
const { Client } = require('@elastic/elasticsearch');
const logger = require('../utils/logger');

const setupLogAggregation = () => {
  if (process.env.ELASTICSEARCH_ENABLED !== 'true') return;

  const client = new Client({
    node: process.env.ELASTICSEARCH_URL,
    auth: {
      username: process.env.ELASTICSEARCH_USER,
      password: process.env.ELASTICSEARCH_PASSWORD
    }
  });

  const esTransport = new ElasticsearchTransport({
    client,
    level: 'info',
    index: 'financial-api-logs',
    indexPrefix: 'logs-',
    indexSuffixPattern: 'YYYY.MM.DD',
    messageType: 'log',
    ensureMappingTemplate: true,
    mappingTemplate: {
      index_patterns: ['logs-*'],
      settings: {
        number_of_shards: 2,
        number_of_replicas: 1
      },
      mappings: {
        properties: {
          '@timestamp': { type: 'date' },
          level: { type: 'keyword' },
          message: { type: 'text' },
          service: { type: 'keyword' },
          trace_id: { type: 'keyword' },
          span_id: { type: 'keyword' },
          user_id: { type: 'keyword' },
          path: { type: 'keyword' },
          method: { type: 'keyword' },
          status_code: { type: 'integer' },
          response_time: { type: 'float' },
          error: {
            properties: {
              stack: { type: 'text' },
              code: { type: 'keyword' },
              message: { type: 'text' }
            }
          }
        }
      }
    }
  });

  logger.add(esTransport);
  logger.info('Elasticsearch transport added to logger');
};

module.exports = { setupLogAggregation }; 