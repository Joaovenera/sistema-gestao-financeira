const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/predictions', analyticsController.getPredictions);
router.get('/anomalies', analyticsController.getAnomalies);
router.get('/categories', analyticsController.getCategoryDistribution);

module.exports = router; 