const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../models/User');

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

describe('User Controller', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(userData);
      
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.password).toBeUndefined();
      
      // Verificar se o usuário foi criado no banco de dados
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
    });
    
    it('should return 400 for invalid user data', async () => {
      const invalidUserData = {
        name: 'Test User',
        // email está faltando
        password: 'password123',
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(invalidUserData);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Dados inválidos');
      expect(response.body.errors).toBeDefined();
    });
  });
  
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Criar um usuário para teste
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);
      
      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
    });
    
    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Credenciais inválidas');
    });
  });
}); 