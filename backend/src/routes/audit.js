const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');

// Todas as rotas requerem autenticação e privilégios de admin
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/trail', auditController.getAuditTrail);
router.get('/security-events', auditController.getSecurityEvents);
router.get('/compliance-report', auditController.getComplianceReport);

module.exports = router; 