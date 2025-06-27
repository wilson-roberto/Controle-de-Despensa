const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authValidators } = require('../utils/validators');
const validateRequest = require('../middleware/validator');

// Rota de registro com validação
router.post('/register', authValidators.register, validateRequest, authController.register);

// Rota de login com validação
router.post('/login', authValidators.login, validateRequest, authController.login);

module.exports = router; 