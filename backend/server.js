const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');
const itemRoutes = require('./routes/itemRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

// Carrega as variáveis de ambiente
dotenv.config();

// Configurações padrão para diferentes ambientes
const config = {
  development: {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/controle-despensa',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    logLevel: process.env.LOG_LEVEL || 'debug'
  },
  production: {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    corsOrigin: process.env.CORS_ORIGIN || '*',
    logLevel: process.env.LOG_LEVEL || 'error'
  }
};

// Seleciona a configuração baseada no ambiente
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];

// Validação de configurações críticas em produção
if (env === 'production') {
  const requiredEnvVars = ['MONGODB_URI'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    console.error(`Erro: Variáveis de ambiente obrigatórias não definidas: ${missingEnvVars.join(', ')}`);
    process.exit(1);
  }
}

// Conectar ao banco de dados
connectDB(currentConfig.mongoUri);

const app = express();

// Middleware
app.use(cors({
  origin: currentConfig.corsOrigin,
  credentials: true
}));

// Middleware para processar JSON
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API do Controle de Despensa está funcionando!',
    environment: env,
    version: process.env.npm_package_version
  });
});

// Servir arquivos estáticos do React em produção
if (env === 'production') {
  const buildPath = path.join(__dirname, '../../frontend/build');
  app.use(express.static(buildPath));

  // Redirecionar todas as rotas que não sejam /api para o index.html do React
  app.get(/^((?!\/api).)*$/, (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = currentConfig.port;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} em modo ${env}`);
  console.log(`CORS origin configurado para: ${currentConfig.corsOrigin}`);
  console.log(`Nível de log: ${currentConfig.logLevel}`);
}); 