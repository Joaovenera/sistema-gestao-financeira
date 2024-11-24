const express = require('express');
const router = express.Router();
const bankReconciliationController = require('../controllers/bankReconciliationController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/upload', bankReconciliationController.uploadFile);
router.get('/status', bankReconciliationController.getReconciliationStatus);

module.exports = router; 