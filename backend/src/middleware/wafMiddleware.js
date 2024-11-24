const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');
const logger = require('../utils/logger');

// Configuração do WAF
const setupWAF = (app) => {
  // Proteção contra XSS
  app.use(xss());

  // Proteção contra HTTP Parameter Pollution
  app.use(hpp());

  // Headers de segurança com Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true
  }));

  // Rate limiting avançado por IP
  const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: 'Muitas requisições deste IP, tente novamente mais tarde.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit excedido:', {
        ip: req.ip,
        path: req.path,
        headers: req.headers
      });
      res.status(429).json({
        error: 'Muitas requisições, tente novamente mais tarde.',
        retryAfter: Math.ceil(strictLimiter.windowMs / 1000)
      });
    }
  });

  return {
    standardSecurity: [
      helmet(),
      xss(),
      hpp()
    ],
    strictSecurity: [
      strictLimiter,
      ...this.standardSecurity
    ]
  };
};

module.exports = setupWAF; 