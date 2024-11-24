const authController = require('../../../src/controllers/authController');
const User = require('../../../src/models/User');
const emailService = require('../../../src/services/emailService');

jest.mock('../../../src/models/User');
jest.mock('../../../src/services/emailService');

describe('AuthController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      };

      User.findByEmail.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
      emailService.sendWelcomeEmail.mockResolvedValue();

      await authController.register(req, res);

      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        name: req.body.name,
        email: req.body.email
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email
          })
        })
      );
    });

    it('should return error if email already exists', async () => {
      User.findByEmail.mockResolvedValue({ id: 1 });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String)
        })
      );
    });
  });
}); 