const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const transactionRoutes = require('./transactions');
const analyticsRoutes = require('./analytics');
const goalsRoutes = require('./goals');

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/goals', goalsRoutes);

module.exports = router; 