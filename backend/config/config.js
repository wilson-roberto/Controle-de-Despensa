const dotenv = require('dotenv');

// Carrega as variáveis de ambiente
dotenv.config();

// Configurações padrão para diferentes ambientes
const config = {
  development: {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/controle-despensa',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    logLevel: process.env.LOG_LEVEL || 'debug',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100 // limite de 100 requisições por windowMs
    }
  },
  production: {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    corsOrigin: process.env.CORS_ORIGIN || '*',
    logLevel: process.env.LOG_LEVEL || 'error',
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 50
    }
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

module.exports = {
  env,
  currentConfig,
  config
}; 