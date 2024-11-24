const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');
const authValidator = require('../validators/authValidator');

router.post('/login', validateRequest(authValidator.login), authController.login);
router.post('/register', validateRequest(authValidator.register), authController.register);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', validateRequest(authValidator.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validateRequest(authValidator.resetPassword), authController.resetPassword);

module.exports = router; 