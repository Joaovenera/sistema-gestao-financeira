const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { MySQLInstrumentation } = require('@opentelemetry/instrumentation-mysql2');
const { RedisInstrumentation } = require('@opentelemetry/instrumentation-redis');

const setupTracing = () => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'financial-api',
      environment: process.env.NODE_ENV
    })
  });

  const jaegerExporter = new JaegerExporter({
    endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces'
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));
  provider.register();

  registerInstrumentations({
    instrumentations: [
      new ExpressInstrumentation(),
      new MySQLInstrumentation(),
      new RedisInstrumentation()
    ]
  });

  return opentelemetry.trace.getTracer('financial-api');
};

module.exports = { setupTracing }; 