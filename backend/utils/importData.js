const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Item = require('../models/Item');

// Configuração do MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/controle-despensa';

// Função para importar dados
async function importData() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao MongoDB');

    // Caminho do arquivo de backup
    const backupPath = 'C:\\PROJETO\\controle-despensa\\backup_mongodb\\controle-despensa.items.json';
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Arquivo de backup não encontrado em: ${backupPath}`);
    }

    // Ler o arquivo JSON
    const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    console.log(`Arquivo de backup lido com sucesso. ${data.length} itens encontrados.`);

    // Limpar a coleção existente
    await Item.deleteMany({});
    console.log('Coleção limpa com sucesso');

    // Preparar os dados para importação
    const items = data.map(item => {
      // Remover campos específicos do MongoDB que não são necessários
      const { _id, __v, dataUltimaEntrada, dataUltimaSaida, ...itemData } = item;
      
      // Converter datas de string para objetos Date
      if (itemData.dataValidade) {
        itemData.dataValidade = new Date(itemData.dataValidade.$date);
      }
      if (itemData.createdAt) {
        itemData.createdAt = new Date(itemData.createdAt.$date);
      }
      if (itemData.updatedAt) {
        itemData.updatedAt = new Date(itemData.updatedAt.$date);
      }

      return itemData;
    });

    // Inserir os novos dados
    await Item.insertMany(items);
    console.log(`${items.length} itens importados com sucesso`);

    // Desconectar do MongoDB
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  } catch (error) {
    console.error('Erro durante a importação:', error);
    process.exit(1);
  }
}

// Executar a importação
importData(); 