const User = require('../models/User');
const logger = require('../utils/logger');

const userController = {
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Remover senha e outros campos sensíveis
      const { password, ...userData } = user;
      
      res.json(userData);
    } catch (error) {
      logger.error('Error getting user profile:', error);
      res.status(500).json({ message: 'Erro ao buscar perfil do usuário' });
    }
  },

  async updateProfile(req, res) {
    try {
      const { name, email } = req.body;

      // Verificar se email já está em uso
      if (email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.id !== req.user.id) {
          return res.status(400).json({ message: 'Email já está em uso' });
        }
      }

      const updated = await User.update(req.user.id, { name, email });

      if (!updated) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
      logger.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Verificar senha atual
      const isValidPassword = await User.validatePassword(user, currentPassword);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Senha atual incorreta' });
      }

      // Atualizar senha
      await User.updatePassword(user.id, newPassword);

      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      logger.error('Error changing password:', error);
      res.status(500).json({ message: 'Erro ao alterar senha' });
    }
  }
};

module.exports = userController; 