const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const User = require('../models/User');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: ERROR_MESSAGES.EMAIL_IN_USE });
      }

      const user = await User.create({ name, email, password });
      await emailService.sendWelcomeEmail(user.email);
      
      const token = generateToken(user);
      res.status(201).json({ token, user: sanitizeUser(user) });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const user = users[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  },

  recoverPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findByEmail(email);
      
      if (user) {
        const token = generateRecoveryToken();
        await User.updateRecoveryToken(user.id, token);
        await emailService.sendPasswordRecoveryEmail(email, token);
      }

      // Sempre retorna sucesso para não expor informações sobre emails cadastrados
      res.json({ message: SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL });
    } catch (error) {
      handleControllerError(error, res);
    }
  }
};

module.exports = authController; 