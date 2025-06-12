const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

describe('User Model', () => {
  it('should create a new user successfully', async () => {
    const validUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };
    
    const user = await User.create(validUser);
    
    expect(user.name).toBe(validUser.name);
    expect(user.email).toBe(validUser.email);
    expect(user.password).not.toBe(validUser.password); // Senha deve estar hasheada
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });
  
  it('should fail to create a user without required fields', async () => {
    const invalidUser = {
      name: 'Test User',
      // email está faltando
      password: 'password123',
    };
    
    let error;
    try {
      await User.create(invalidUser);
    } catch (err) {
      error = err;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });
  
  it('should fail to create a user with invalid email', async () => {
    const invalidUser = {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
    };
    
    let error;
    try {
      await User.create(invalidUser);
    } catch (err) {
      error = err;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });
  
  it('should compare password correctly', async () => {
    const password = 'password123';
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password,
    });
    
    const isMatch = await user.comparePassword(password);
    expect(isMatch).toBe(true);
    
    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });
}); 