const winston = require('winston');
const { currentConfig } = require('./config');

// Configuração dos formatos de log
const formats = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta
    });
  })
);

// Configuração dos transportes
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),
  new winston.transports.File({ 
    filename: 'logs/error.log', 
    level: 'error' 
  }),
  new winston.transports.File({ 
    filename: 'logs/combined.log' 
  })
];

// Criação do logger
const logger = winston.createLogger({
  level: currentConfig.logLevel,
  format: formats,
  transports,
  // Não exitar em caso de erro
  exitOnError: false
});

// Middleware de logging para Express
const loggingMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });
  
  next();
};

module.exports = {
  logger,
  loggingMiddleware
}; 