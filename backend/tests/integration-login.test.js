const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const { login } = require('../controllers/authController');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Login Integration Tests', () => {

  it('should return user not found message for non-existent user', async () => {
    const req = {
      body: {
        username: 'usuario_inexistente',
        password: 'senha_qualquer'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await login(req, res);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuário ainda não cadastrado. Faça seu registro!',
      errorType: 'user_not_found'
    });
  });

  it('should return generic message for existing user with wrong password', async () => {
    // Criar um usuário primeiro
    await User.create({
      username: 'usuario_teste',
      password: 'senha_correta123'
    });
    
    const req = {
      body: {
        username: 'usuario_teste',
        password: 'senha_errada123'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await login(req, res);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Nome de usuário ou senha inválidos',
      errorType: 'invalid_password'
    });
  });

  it('should login successfully with correct credentials', async () => {
    // Criar um usuário primeiro
    await User.create({
      username: 'usuario_teste',
      password: 'senha_correta123'
    });
    
    const req = {
      body: {
        username: 'usuario_teste',
        password: 'senha_correta123'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await login(req, res);
    
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Login realizado com sucesso',
        token: expect.any(String),
        user: expect.objectContaining({
          username: 'usuario_teste'
        })
      })
    );
  });
}); 