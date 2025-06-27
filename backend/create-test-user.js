// Script para criar usuário de teste
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function createTestUser() {
  console.log('🧪 Criando usuário de teste...\n');

  try {
    // 1. Verificar se a API está rodando
    console.log('1. Verificando se a API está rodando...');
    const healthCheck = await axios.get(`${API_BASE_URL}/`);
    console.log('✅ API está funcionando:', healthCheck.data.message);
    console.log('');

    // 2. Criar usuário de teste
    console.log('2. Criando usuário de teste...');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username: 'admin',
        password: 'admin123456'
      });
      
      console.log('✅ Usuário criado com sucesso:');
      console.log('   Username: admin');
      console.log('   Password: admin123456');
      console.log('   Token:', response.data.token);
      console.log('');
      
      console.log('🎯 Agora você pode:');
      console.log('   1. Fazer login na aplicação com admin/admin123456');
      console.log('   2. Executar o teste de notificações');
      console.log('   3. Testar o sistema completo');
      
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === 'Nome de usuário já existe') {
        console.log('ℹ️ Usuário admin já existe');
        console.log('   Username: admin');
        console.log('   Password: admin123456');
        console.log('');
        console.log('🎯 Você pode:');
        console.log('   1. Fazer login na aplicação com admin/admin123456');
        console.log('   2. Executar o teste de notificações');
        console.log('   3. Testar o sistema completo');
      } else {
        console.log('❌ Erro ao criar usuário:', error.response?.data?.message || error.message);
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.log('');
    console.log('🔧 Possíveis soluções:');
    console.log('   1. Verifique se o backend está rodando na porta 5000');
    console.log('   2. Verifique se o MongoDB está conectado');
    console.log('   3. Verifique os logs do servidor para mais detalhes');
  }
}

// Executar o script
createTestUser(); 