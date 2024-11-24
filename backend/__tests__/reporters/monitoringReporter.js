const testMonitoringService = require('../../src/services/testMonitoringService');

class MonitoringReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(contexts, results) {
    const {
      numTotalTests,
      numPassedTests,
      numFailedTests,
      numPendingTests,
      testResults
    } = results;

    const failures = testResults
      .filter(result => result.numFailingTests > 0)
      .flatMap(result => 
        result.testResults
          .filter(test => test.status === 'failed')
          .map(test => ({
            testName: test.title,
            errorMessage: test.failureMessages.join('\n'),
            filePath: result.testFilePath,
            lineNumber: this.extractLineNumber(test.failureMessages[0])
          }))
      );

    testMonitoringService.recordTestRun({
      type: process.env.TEST_TYPE || 'unit',
      total: numTotalTests,
      passed: numPassedTests,
      failed: numFailedTests,
      skipped: numPendingTests,
      duration: Date.now() - results.startTime,
      coverage: this.getCoveragePercentage(results),
      branch: process.env.GITHUB_REF,
      commit_hash: process.env.GITHUB_SHA,
      failures
    }).catch(error => {
      console.error('Error recording test results:', error);
    });
  }

  getCoveragePercentage(results) {
    if (!results.coverageMap) return null;

    const summary = results.coverageMap.getCoverageSummary();
    return summary.lines.pct;
  }

  extractLineNumber(errorMessage) {
    const match = errorMessage.match(/:(\d+):\d+\)/);
    return match ? parseInt(match[1]) : null;
  }
}

module.exports = MonitoringReporter; 