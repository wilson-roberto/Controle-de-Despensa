const express = require('express');
const router = express.Router();
const { sendWhatsAppMessage } = require('../controllers/whatsappController');

// Rota para envio de mensagens do WhatsApp
router.post('/send-whatsapp', sendWhatsAppMessage);

module.exports = router; 