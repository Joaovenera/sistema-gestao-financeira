const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logService = require('../services/logService');
const logger = require('../utils/logger');
const emailService = require('../services/emailService');
const crypto = require('crypto');

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        await logService.logActivity({
          user_id: user.id,
          action: 'LOGIN_FAILED',
          ip_address: req.ip
        });
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      await logService.logActivity({
        user_id: user.id,
        action: 'LOGIN_SUCCESS',
        ip_address: req.ip
      });

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ message: 'Erro ao fazer login' });
    }
  },

  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword
      });

      await logService.logActivity({
        user_id: user.id,
        action: 'USER_REGISTERED',
        ip_address: req.ip
      });

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
  },

  async logout(req, res) {
    try {
      await logService.logActivity({
        user_id: req.user.id,
        action: 'LOGOUT',
        ip_address: req.ip
      });

      res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({ message: 'Erro ao fazer logout' });
    }
  },

  async refreshToken(req, res) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: 'Token não fornecido' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const newToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({ token: newToken });
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(401).json({ message: 'Token inválido ou expirado' });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hora

      await User.update(user.id, {
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry
      });

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      await emailService.sendPasswordResetEmail(user.email, resetUrl);
      
      await logService.logActivity({
        user_id: user.id,
        action: 'PASSWORD_RESET_REQUESTED',
        ip_address: req.ip
      });

      res.json({ message: 'Email de recuperação enviado' });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({ message: 'Erro ao processar recuperação de senha' });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      
      const user = await User.findOne({
        reset_token: token,
        reset_token_expiry: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ message: 'Token inválido ou expirado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      await User.update(user.id, {
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      });

      await logService.logActivity({
        user_id: user.id,
        action: 'PASSWORD_RESET_COMPLETED',
        ip_address: req.ip
      });

      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(500).json({ message: 'Erro ao redefinir senha' });
    }
  }
};

module.exports = authController; 