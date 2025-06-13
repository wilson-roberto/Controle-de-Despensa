const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { currentConfig, env } = require('./config/config');
const { logger, loggingMiddleware } = require('./config/logger');
const itemRoutes = require('./routes/itemRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const authRoutes = require('./routes/authRoutes');

// Conectar ao banco de dados
connectDB(currentConfig.mongoUri);

const app = express();

// Middleware de segurança
app.use(helmet());

// Middleware de compressão
app.use(compression());

// Configuração do rate limiting
const limiter = rateLimit({
  windowMs: currentConfig.rateLimit.windowMs,
  max: currentConfig.rateLimit.max,
  message: 'Muitas requisições deste IP, por favor tente novamente mais tarde.'
});
app.use(limiter);

// Middleware CORS
app.use(cors({
  origin: currentConfig.corsOrigin,
  credentials: true
}));

// Middleware para processar JSON
app.use(express.json());

// Middleware de logging
app.use(loggingMiddleware);

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
  logger.error('Erro na aplicação:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(500).json({
    message: 'Erro interno do servidor',
    error: env === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = currentConfig.port;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT} em modo ${env}`);
  logger.info(`CORS origin configurado para: ${currentConfig.corsOrigin}`);
  logger.info(`Nível de log: ${currentConfig.logLevel}`);
}); 