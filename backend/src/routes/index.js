const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const validateRequest = require('../middleware/validateRequest');
const authValidator = require('../validators/authValidator');
const transactionValidator = require('../validators/transactionValidator');

// Controllers
const authController = require('../controllers/authController');
const transactionController = require('../controllers/transactionController');
const reportController = require('../controllers/reportController');
const logController = require('../controllers/logController');

// Rotas de autenticação
router.post('/auth/register', 
  validateRequest(authValidator.register),
  authController.register
);

router.post('/auth/login', 
  validateRequest(authValidator.login),
  authController.login
);

router.post('/auth/recover', 
  validateRequest(authValidator.passwordRecovery),
  authController.recoverPassword
);

router.post('/auth/reset-password',
  validateRequest(authValidator.resetPassword),
  authController.resetPassword
);

// Middleware de autenticação para rotas protegidas
router.use(authMiddleware);

// Rotas de transações
router.post('/transactions',
  validateRequest(transactionValidator.create),
  transactionController.create
);

router.get('/transactions',
  validateRequest(transactionValidator.listFilters, 'query'),
  transactionController.list
);

router.get('/transactions/:id', transactionController.getById);

router.put('/transactions/:id',
  validateRequest(transactionValidator.update),
  transactionController.update
);

router.delete('/transactions/:id', transactionController.delete);

// Rotas de relatórios
router.get('/reports/financial-summary', reportController.getFinancialSummary);
router.get('/reports/categories', reportController.getCategorySummary);

// Rotas administrativas (requer privilégios de admin)
router.use('/admin', adminMiddleware);
router.get('/admin/logs', logController.list);

module.exports = router; 