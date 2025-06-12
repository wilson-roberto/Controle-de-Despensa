const axios = require('axios');

// @desc    Gerar links para enviar mensagens via WhatsApp Business App para múltiplos números
// @route   POST /api/send-whatsapp
// @access  Public
const sendWhatsAppMessage = (req, res) => {
  try {
    const { phones, message } = req.body;

    if (!phones || !Array.isArray(phones) || phones.length === 0 || !message) {
      return res.status(400).json({ message: 'Lista de telefones e mensagem são obrigatórios' });
    }

    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);

    // Processa cada número de telefone
    const whatsappLinks = phones.map(phone => {
      // Remove caracteres não numéricos do telefone
      const cleanPhone = phone.replace(/\D/g, '');

      // Adiciona o código do país se não existir
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

      // Monta o link do WhatsApp Business
      return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    });

    res.status(200).json({ 
      success: true, 
      message: 'Links gerados com sucesso',
      whatsappLinks
    });
  } catch (error) {
    console.error('Erro ao gerar links:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao gerar links',
      error: error.message 
    });
  }
};

module.exports = {
  sendWhatsAppMessage
}; 