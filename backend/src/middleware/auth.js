const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      req.user = user;
      return next();
    } catch (error) {
      logger.error('Token verification error:', error);
      return res.status(401).json({ message: 'Token inválido' });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = authMiddleware; 