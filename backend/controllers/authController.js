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

// Registro
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validações adicionais
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Nome de usuário e senha são obrigatórios' 
      });
    }

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Nome de usuário já existe' 
      });
    }

    // Cria novo usuário
    const newUser = new User({ username, password });
    
    // Valida o usuário antes de salvar
    const validationError = newUser.validateSync();
    if (validationError) {
      const errors = Object.values(validationError.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ 
        message: 'Dados inválidos',
        errors: errors
      });
    }
    
    await newUser.save();

    // Gera token para login automático após registro
    const token = generateToken(newUser._id);

    res.status(201).json({ 
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('[REGISTER ERRO] Erro interno no servidor:', error);
    
    // Tratamento específico para erros de validação do Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ 
        message: 'Dados inválidos',
        errors: validationErrors
      });
    }

    res.status(500).json({ 
      message: 'Erro ao registrar usuário' 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Busca usuário
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: 'Usuário ainda não cadastrado. Faça seu registro!',
        errorType: 'user_not_found'
      });
    }

    // Verifica senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Nome de usuário ou senha inválidos',
        errorType: 'invalid_password'
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