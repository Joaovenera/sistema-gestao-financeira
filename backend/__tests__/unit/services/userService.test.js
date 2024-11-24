const userService = require('../../../src/services/userService');
const User = require('../../../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ERROR_MESSAGES } = require('../../../src/utils/constants');

jest.mock('../../../src/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const mockUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test@123'
    };

    it('deve criar um usuário com sucesso', async () => {
      const hashedPassword = 'hashed_password';
      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.findByEmail.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 1, ...mockUserData });

      const result = await userService.createUser(mockUserData);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        ...mockUserData,
        password: hashedPassword
      });
      expect(result).toHaveProperty('id');
      expect(result).not.toHaveProperty('password');
    });

    it('deve lançar erro se email já existir', async () => {
      User.findByEmail.mockResolvedValue({ id: 1 });

      await expect(userService.createUser(mockUserData))
        .rejects.toThrow(ERROR_MESSAGES.EMAIL_IN_USE);
    });
  });

  describe('validateCredentials', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'Test@123'
    };

    it('deve validar credenciais com sucesso', async () => {
      const mockUser = {
        id: 1,
        email: mockCredentials.email,
        password: 'hashed_password'
      };

      User.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await userService.validateCredentials(mockCredentials);

      expect(User.findByEmail).toHaveBeenCalledWith(mockCredentials.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockCredentials.password,
        mockUser.password
      );
      expect(result).toEqual(mockUser);
    });

    it('deve lançar erro se usuário não existir', async () => {
      User.findByEmail.mockResolvedValue(null);

      await expect(userService.validateCredentials(mockCredentials))
        .rejects.toThrow(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });

    it('deve lançar erro se senha estiver incorreta', async () => {
      User.findByEmail.mockResolvedValue({ id: 1, password: 'hashed_password' });
      bcrypt.compare.mockResolvedValue(false);

      await expect(userService.validateCredentials(mockCredentials))
        .rejects.toThrow(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });
  });

  describe('generateToken', () => {
    it('deve gerar token JWT válido', () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockToken = 'valid_token';

      jwt.sign.mockReturnValue(mockToken);

      const token = userService.generateToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      expect(token).toBe(mockToken);
    });
  });

  describe('validateToken', () => {
    it('deve validar token com sucesso', () => {
      const mockToken = 'valid_token';
      const mockDecodedToken = { id: 1, email: 'test@example.com' };

      jwt.verify.mockReturnValue(mockDecodedToken);

      const result = userService.validateToken(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(result).toEqual(mockDecodedToken);
    });

    it('deve lançar erro se token for inválido', () => {
      const mockToken = 'invalid_token';
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => userService.validateToken(mockToken))
        .toThrow(ERROR_MESSAGES.INVALID_TOKEN);
    });
  });

  describe('updateUserProfile', () => {
    const mockUserId = 1;
    const mockUpdateData = {
      name: 'Updated Name',
      email: 'updated@example.com'
    };

    it('deve atualizar perfil com sucesso', async () => {
      User.findById.mockResolvedValue({ id: mockUserId });
      User.findByEmail.mockResolvedValue(null);
      User.update.mockResolvedValue(true);

      const result = await userService.updateUserProfile(mockUserId, mockUpdateData);

      expect(User.update).toHaveBeenCalledWith(mockUserId, mockUpdateData);
      expect(result).toBe(true);
    });

    it('deve lançar erro se email já estiver em uso', async () => {
      User.findById.mockResolvedValue({ id: mockUserId });
      User.findByEmail.mockResolvedValue({ id: 2 });

      await expect(userService.updateUserProfile(mockUserId, mockUpdateData))
        .rejects.toThrow(ERROR_MESSAGES.EMAIL_IN_USE);
    });
  });
}); 