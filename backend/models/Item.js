const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Item é obrigatório'],
    trim: true
  },
  unidade: {
    type: String,
    default: 'unidade',
    trim: true
  },
  quantidadeEntrada: {
    type: Number,
    default: 0
  },
  dataUltimaEntrada: {
    type: Date
  },
  quantidadeSaida: {
    type: Number,
    default: 0
  },
  dataUltimaSaida: {
    type: Date
  },
  totalEstoque: {
    type: Number,
    required: [true, 'Estoque é obrigatório'],
    default: 0
  },
  dataValidade: {
    type: Date
  },
  limiteEstoque: {
    type: Number,
    default: 0
  },
  whatsapp: {
    type: [String],
    default: []
  },
  notificado: {
    type: Boolean,
    default: false
  },
  notificadoEstoque: {
    type: Boolean,
    default: false
  },
  notificadoValidade: {
    type: Boolean,
    default: false
  },
  dataUltimaNotificacao: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', itemSchema); 