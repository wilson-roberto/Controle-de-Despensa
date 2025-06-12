const { validationResult } = require('express-validator');

/**
 * Middleware para validar os dados da requisição
 * Deve ser usado após os validadores do express-validator
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Dados inválidos',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};

module.exports = validateRequest; 