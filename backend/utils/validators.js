const { body } = require('express-validator');

/**
 * Validadores para autenticação
 */
const authValidators = {
  register: [
    body('username')
      .trim()
      .notEmpty().withMessage('Nome de usuário é obrigatório')
      .isLength({ min: 3, max: 30 }).withMessage('Nome de usuário deve ter entre 3 e 30 caracteres')
      .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Nome de usuário deve conter apenas letras, números, underscore (_) ou hífen (-)')
      .custom(value => {
        if (value.includes(' ')) {
          throw new Error('Nome de usuário não pode conter espaços');
        }
        return true;
      }),
    
    body('password')
      .notEmpty().withMessage('Senha é obrigatória')
      .isLength({ min: 8 }).withMessage('Senha deve ter pelo menos 8 caracteres')
      .matches(/[a-zA-Z]/).withMessage('Senha deve conter pelo menos uma letra')
      .matches(/\d/).withMessage('Senha deve conter pelo menos um número')
      .custom(value => {
        if (value.includes(' ')) {
          throw new Error('Senha não pode conter espaços');
        }
        return true;
      })
  ],
  
  login: [
    body('username')
      .trim()
      .notEmpty().withMessage('Nome de usuário é obrigatório'),
    
    body('password')
      .notEmpty().withMessage('Senha é obrigatória')
  ]
};

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

/**
 * Validadores para usuários de notificação
 */
const notificationUserValidators = {
  create: [
    body('fullName')
      .trim()
      .notEmpty().withMessage('Nome completo é obrigatório')
      .isLength({ min: 2, max: 100 }).withMessage('Nome completo deve ter entre 2 e 100 caracteres')
      .matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('Nome completo deve conter apenas letras e espaços'),
    
    body('phone')
      .trim()
      .notEmpty().withMessage('Telefone é obrigatório')
      .custom(value => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length < 10 || cleaned.length > 11) {
          throw new Error('Telefone deve ter 10 ou 11 dígitos');
        }
        return true;
      })
  ],
  
  update: [
    body('fullName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Nome completo deve ter entre 2 e 100 caracteres')
      .matches(/^[a-zA-ZÀ-ÿ\s]+$/).withMessage('Nome completo deve conter apenas letras e espaços'),
    
    body('phone')
      .optional()
      .trim()
      .custom(value => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length < 10 || cleaned.length > 11) {
          throw new Error('Telefone deve ter 10 ou 11 dígitos');
        }
        return true;
      }),
    
    body('isActive')
      .optional()
      .isBoolean().withMessage('Status deve ser verdadeiro ou falso')
  ]
};

module.exports = {
  authValidators,
  userValidators,
  productValidators,
  notificationUserValidators
}; 