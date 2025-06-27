const express = require('express');
const router = express.Router();
const notificationUserController = require('../controllers/notificationUserController');
const { notificationUserValidators } = require('../utils/validators');
const validateRequest = require('../middleware/validator');

// Rotas para usuários de notificação
router.get('/', notificationUserController.getAllUsers);
router.post('/', notificationUserValidators.create, validateRequest, notificationUserController.createUser);
router.get('/:id', notificationUserController.getUserById);
router.put('/:id', notificationUserValidators.update, validateRequest, notificationUserController.updateUser);
router.delete('/:id', notificationUserController.deleteUser);

// Rotas de teste e status
router.get('/status/check', notificationUserController.getNotificationStatus);
router.post('/test/create', notificationUserController.createTestUser);

module.exports = router; 