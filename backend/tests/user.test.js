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
    const userData = {
      username: 'testuser',
      password: 'password123'
    };

    const user = new User(userData);
    await user.save();

    expect(user.username).toBe(userData.username);
    expect(user.password).not.toBe(userData.password); // Senha deve estar criptografada
    expect(user.createdAt).toBeDefined();
  });

  it('should fail to create a user without required fields', async () => {
    const userData = {
      // username está faltando
      password: 'password123'
    };

    let error;
    try {
      const user = new User(userData);
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.username).toBeDefined();
  });

  it('should fail to create a user with invalid username format', async () => {
    const userData = {
      username: 'test user', // contém espaço
      password: 'password123'
    };

    let error;
    try {
      const user = new User(userData);
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.username).toBeDefined();
  });

  it('should compare password correctly', async () => {
    const userData = {
      username: 'testuser',
      password: 'password123'
    };

    const user = new User(userData);
    await user.save();

    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

  it('should update last login', async () => {
    const userData = {
      username: 'testuser',
      password: 'password123'
    };

    const user = new User(userData);
    await user.save();

    expect(user.lastLogin).toBeUndefined();

    await user.updateLastLogin();
    expect(user.lastLogin).toBeDefined();
    expect(user.lastLogin instanceof Date).toBe(true);
  });

  it('should enforce unique username constraint', async () => {
    const userData = {
      username: 'testuser',
      password: 'password123'
    };

    // Criar primeiro usuário
    const user1 = new User(userData);
    await user1.save();

    // Tentar criar segundo usuário com mesmo username
    const user2 = new User(userData);
    let error;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // Código de erro do MongoDB para duplicata
  });

  it('should validate password requirements', async () => {
    const userData = {
      username: 'testuser',
      password: '123' // senha muito curta
    };

    let error;
    try {
      const user = new User(userData);
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it('should validate password format', async () => {
    const userData = {
      username: 'testuser',
      password: 'password 123' // contém espaço
    };

    let error;
    try {
      const user = new User(userData);
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it('should validate password complexity', async () => {
    const userData = {
      username: 'testuser',
      password: 'password' // sem números
    };

    let error;
    try {
      const user = new User(userData);
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });
}); 