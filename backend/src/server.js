const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Configuração do CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Middleware
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/controle-despensa')
  .then(() => console.log('MongoDB Conectado:', mongoose.connection.host))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
const authRoutes = require('../routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do Controle de Despensa funcionando!' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Porta do servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS origin configurado para: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`Nível de log: ${process.env.LOG_LEVEL || 'debug'}`);
}); 