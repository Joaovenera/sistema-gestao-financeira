const express = require('express');
const os = require('os');

const setupMetricsServer = () => {
  const metricsApp = express();
  const metricsPort = process.env.METRICS_PORT || 9090;

  metricsApp.get('/metrics', (req, res) => {
    const metrics = {
      process: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      system: {
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        loadAvg: os.loadavg(),
        cpus: os.cpus().length
      },
      timestamp: new Date()
    };

    res.json(metrics);
  });

  metricsApp.listen(metricsPort);
};

module.exports = { setupMetricsServer }; 