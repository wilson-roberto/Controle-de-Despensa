const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Função para gerar token JWT
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'chave_secreta_controle_despensa_2024';
  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn: '24h' }
  );
};

// Login
// Registro
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Nome de usuário já existe' });
    }

    // Cria novo usuário
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('[REGISTER ERRO] Erro interno no servidor:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Busca usuário
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: 'Nome de usuário ou senha inválidos'
      });
    }

    // Verifica senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Nome de usuário ou senha inválidos'
      });
    }

    // Atualiza último login
    await user.updateLastLogin();
    const token = generateToken(user._id);

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user._id,
        username: user.username,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('[LOGIN ERRO] Erro interno no servidor:', error);
    res.status(500).json({
      message: 'Erro ao fazer login'
    });
  }
}; 