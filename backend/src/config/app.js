const config = {
  security: {
    bcryptRounds: 10,
    jwtExpiresIn: '24h',
    rateLimiting: {
      window: 15 * 60 * 1000, // 15 minutos
      max: 100
    }
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },
  uploads: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['text/csv', 'application/pdf']
  }
};

module.exports = config; 