module.exports = {
  displayName: 'integration',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/integration/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.integration.js'],
  testTimeout: 30000
}; 