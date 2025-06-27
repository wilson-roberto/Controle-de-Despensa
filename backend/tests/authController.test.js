const request = require('supertest');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authRoutes = require('../routes/authRoutes');
const User = require('../models/User');

// Criar uma instância do Express para testes
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

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

// Mock do console.error para evitar logs durante os testes
console.error = jest.fn();

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a user successfully', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Usuário registrado com sucesso');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.createdAt).toBeDefined();
      
      // Verificar se o usuário foi criado no banco de dados
      const user = await User.findOne({ username: userData.username });
      expect(user).toBeDefined();
      expect(user.username).toBe(userData.username);
    });

    it('should return 400 for duplicate username', async () => {
      // Criar usuário primeiro
      await User.create({
        username: 'testuser',
        password: 'password123'
      });
      
      const userData = {
        username: 'testuser',
        password: 'password456'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Nome de usuário já existe');
    });
    
    it('should return 400 for missing username', async () => {
      const userData = {
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some(err => err.message.includes('obrigatório'))).toBe(true);
    });

    it('should return 400 for missing password', async () => {
      const userData = {
        username: 'testuser'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some(err => err.message.includes('obrigatória'))).toBe(true);
    });

    it('should return 400 for invalid username format', async () => {
      const userData = {
        username: 'test user', // com espaço
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some(err => err.message.includes('espaços'))).toBe(true);
    });

    it('should return 400 for invalid password format', async () => {
      const userData = {
        username: 'testuser',
        password: '123' // muito curta
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some(err => err.message.includes('pelo menos 8'))).toBe(true);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Criar usuário para testes de login
      await User.create({
        username: 'testuser',
        password: 'password123'
      });
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login realizado com sucesso');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe(loginData.username);
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.lastLogin).toBeDefined();
    });

    it('should return 401 for non-existent user', async () => {
      const loginData = {
        username: 'nonexistent',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Usuário ainda não cadastrado. Faça seu registro!');
      expect(response.body.errorType).toBe('user_not_found');
    });

    it('should return 401 for wrong password', async () => {
      const loginData = {
        username: 'testuser',
        password: 'wrongpassword'
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Nome de usuário ou senha inválidos');
      expect(response.body.errorType).toBe('invalid_password');
    });

    it('should return 400 for missing username', async () => {
      const loginData = {
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some(err => err.message.includes('obrigatório'))).toBe(true);
    });

    it('should return 400 for missing password', async () => {
      const loginData = {
        username: 'testuser'
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some(err => err.message.includes('obrigatória'))).toBe(true);
    });
  });
}); 