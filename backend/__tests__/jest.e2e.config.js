module.exports = {
  displayName: 'e2e',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/e2e/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.e2e.js'],
  testTimeout: 60000, // Timeout maior para testes E2E
  maxConcurrency: 1 // Executar testes sequencialmente
}; 