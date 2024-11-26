const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/predictions', analyticsController.getPredictions);
router.get('/anomalies', analyticsController.getAnomalies);
router.get('/categories', analyticsController.getCategoryDistribution);

module.exports = router; 