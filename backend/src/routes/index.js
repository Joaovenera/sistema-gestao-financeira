const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./userRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const goalsRoutes = require('./goalsRoutes');
const transactionRoutes = require('./transactionRoutes');
const cardRoutes = require('./cardRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/goals', goalsRoutes);
router.use('/transactions', transactionRoutes);
router.use('/cards', cardRoutes);

module.exports = router; 