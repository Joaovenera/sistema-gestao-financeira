module.exports = {
  displayName: 'unit',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/unit/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/database/migrations/**'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.unit.js']
}; 