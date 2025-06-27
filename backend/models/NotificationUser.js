const mongoose = require('mongoose');

const notificationUserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Nome completo é obrigatório'],
    trim: true,
    minlength: [2, 'Nome completo deve ter no mínimo 2 caracteres'],
    maxlength: [100, 'Nome completo deve ter no máximo 100 caracteres']
  },
  phone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    trim: true,
    unique: true,
    validate: {
      validator: function(v) {
        // Remove todos os caracteres não numéricos
        const cleaned = v.replace(/\D/g, '');
        // Valida se tem 10 ou 11 dígitos (formato brasileiro)
        return cleaned.length >= 10 && cleaned.length <= 11;
      },
      message: 'Telefone deve ter 10 ou 11 dígitos'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastNotification: {
    type: Date
  }
});

// Método para atualizar última notificação
notificationUserSchema.methods.updateLastNotification = async function() {
  this.lastNotification = new Date();
  await this.save();
};

// Método para formatar telefone
notificationUserSchema.methods.getFormattedPhone = function() {
  const cleaned = this.phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return this.phone;
};

const NotificationUser = mongoose.model('NotificationUser', notificationUserSchema);

module.exports = NotificationUser; 