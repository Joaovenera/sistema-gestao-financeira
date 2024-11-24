const authService = require('../../../src/services/authService');
const User = require('../../../src/models/User');
const emailService = require('../../../src/services/emailService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../../src/models/User');
jest.mock('../../../src/services/emailService');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const mockUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test@123'
    };

    it('deve registrar um novo usuário com sucesso', async () => {
      const hashedPassword = 'hashed_password';
      const mockCreatedUser = { id: 1, ...mockUserData, password: hashedPassword };

      User.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.create.mockResolvedValue(mockCreatedUser);
      jwt.sign.mockReturnValue('mock_token');

      const result = await authService.register(mockUserData);

      expect(User.findByEmail).toHaveBeenCalledWith(mockUserData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        ...mockUserData,
        password: hashedPassword
      });
      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(mockUserData.email);
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user).not.toHaveProperty('password');
    });

    it('deve lançar erro se email já existir', async () => {
      User.findByEmail.mockResolvedValue({ id: 1 });

      await expect(
        authService.register(mockUserData)
      ).rejects.toThrow('Email já está em uso');
    });
  });

  describe('login', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'Test@123'
    };

    it('deve fazer login com sucesso', async () => {
      const mockUser = {
        id: 1,
        email: mockCredentials.email,
        password: 'hashed_password'
      };

      User.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock_token');

      const result = await authService.login(mockCredentials);

      expect(User.findByEmail).toHaveBeenCalledWith(mockCredentials.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockCredentials.password,
        mockUser.password
      );
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user).not.toHaveProperty('password');
    });

    it('deve lançar erro se usuário não existir', async () => {
      User.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login(mockCredentials)
      ).rejects.toThrow('Credenciais inválidas');
    });

    it('deve lançar erro se senha estiver incorreta', async () => {
      User.findByEmail.mockResolvedValue({ id: 1, password: 'hashed_password' });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authService.login(mockCredentials)
      ).rejects.toThrow('Credenciais inválidas');
    });
  });

  describe('recoverPassword', () => {
    const mockEmail = 'test@example.com';

    it('deve enviar email de recuperação com sucesso', async () => {
      const mockUser = { id: 1, email: mockEmail };
      const mockToken = 'recovery_token';

      User.findByEmail.mockResolvedValue(mockUser);
      User.updateRecoveryToken.mockResolvedValue(true);

      await authService.recoverPassword(mockEmail);

      expect(User.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(User.updateRecoveryToken).toHaveBeenCalledWith(
        mockUser.id,
        expect.any(String)
      );
      expect(emailService.sendPasswordRecoveryEmail).toHaveBeenCalledWith(
        mockEmail,
        expect.any(String)
      );
    });

    it('não deve lançar erro se email não existir', async () => {
      User.findByEmail.mockResolvedValue(null);

      await expect(
        authService.recoverPassword(mockEmail)
      ).resolves.not.toThrow();

      expect(emailService.sendPasswordRecoveryEmail).not.toHaveBeenCalled();
    });
  });
}); 