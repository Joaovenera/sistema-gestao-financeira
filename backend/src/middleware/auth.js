const jwt = require('jsonwebtoken');
const { ERROR_MESSAGES } = require('../utils/constants');
const logger = require('../utils/logger');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: ERROR_MESSAGES.TOKEN_REQUIRED });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: ERROR_MESSAGES.INVALID_TOKEN });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ error: ERROR_MESSAGES.INVALID_TOKEN });
  }
};

module.exports = authMiddleware; 