const { body } = require('express-validator');

/**
 * Validadores para usuários
 */
const userValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('O item é obrigatório')
      .isLength({ min: 3, max: 100 }).withMessage('O item deve ter entre 3 e 100 caracteres'),
    
    body('email')
      .trim()
      .notEmpty().withMessage('O email é obrigatório')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('A senha é obrigatória')
      .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
      .matches(/\d/).withMessage('A senha deve conter pelo menos um número')
  ],
  
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('O email é obrigatório')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('A senha é obrigatória')
  ]
};

/**
 * Validadores para produtos
 */
const productValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('O item é obrigatório')
      .isLength({ min: 2, max: 100 }).withMessage('O item deve ter entre 2 e 100 caracteres'),
    
    body('quantity')
      .notEmpty().withMessage('A quantidade é obrigatória')
      .isInt({ min: 0 }).withMessage('A quantidade deve ser um número inteiro positivo'),
    
    body('unit')
      .trim()
      .notEmpty().withMessage('A unidade é obrigatória')
      .isLength({ min: 1, max: 10 }).withMessage('A unidade deve ter entre 1 e 10 caracteres'),
    
    body('expirationDate')
      .optional()
      .isISO8601().withMessage('Validade inválida')
  ]
};

module.exports = {
  userValidators,
  productValidators
}; 