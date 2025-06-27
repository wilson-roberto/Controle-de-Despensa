// Script para criar itens de teste com problemas
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

// Função para obter token de autenticação
async function getAuthToken() {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username: 'admin',
      password: 'admin123456'
    });
    return response.data.token;
  } catch (error) {
    console.log('❌ Erro ao fazer login:', error.response?.data?.message || error.message);
    return null;
  }
}

// Função para criar item de teste
async function createTestItem(item, token) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/items`, item, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log(`❌ Erro ao criar item ${item.nome}:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function createTestItems() {
  console.log('🧪 Criando itens de teste para notificações...\n');

  try {
    // 1. Verificar se a API está rodando
    console.log('1. Verificando se a API está rodando...');
    const healthCheck = await axios.get(`${API_BASE_URL}/`);
    console.log('✅ API está funcionando:', healthCheck.data.message);
    console.log('');

    // 2. Fazer login para obter token
    console.log('2. Fazendo login...');
    const token = await getAuthToken();
    if (!token) {
      console.log('❌ Não foi possível obter token de autenticação');
      return;
    }
    console.log('✅ Login realizado com sucesso');
    console.log('');

    // 3. Criar itens de teste
    console.log('3. Criando itens de teste...');
    
    const timestamp = Date.now();
    const testItems = [
      {
        nome: `Arroz Teste ${timestamp} - Estoque Baixo`,
        totalEstoque: 2,
        unidade: 'kg',
        limiteEstoque: 5,
        dataValidade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
        whatsapp: '11999999999'
      },
      {
        nome: `Feijão Teste ${timestamp} - Validade Próxima`,
        totalEstoque: 10,
        unidade: 'kg',
        limiteEstoque: 3,
        dataValidade: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 dias
        whatsapp: '11999999999'
      },
      {
        nome: `Leite Teste ${timestamp} - Crítico`,
        totalEstoque: 1,
        unidade: 'l',
        limiteEstoque: 5,
        dataValidade: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 dias
        whatsapp: '11999999999'
      },
      {
        nome: `Pão Teste ${timestamp} - Vencido`,
        totalEstoque: 3,
        unidade: 'un',
        limiteEstoque: 10,
        dataValidade: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 dias atrás
        whatsapp: '11999999999'
      }
    ];

    let createdCount = 0;
    for (const item of testItems) {
      console.log(`   Criando: ${item.nome}...`);
      const result = await createTestItem(item, token);
      if (result) {
        console.log(`   ✅ ${item.nome} criado com sucesso`);
        createdCount++;
      } else {
        console.log(`   ❌ Falha ao criar ${item.nome}`);
      }
    }

    console.log('');
    console.log(`🎯 Resumo: ${createdCount}/${testItems.length} itens criados`);
    console.log('');
    
    if (createdCount > 0) {
      console.log('📱 Agora você pode testar as notificações:');
      console.log('   1. Acesse a aplicação no navegador');
      console.log('   2. Faça login com admin/admin123456');
      console.log('   3. O modal de notificações deve aparecer automaticamente');
      console.log('   4. Teste os botões de envio de WhatsApp');
      console.log('');
      console.log('🔧 Dicas para teste:');
      console.log('   - Verifique o console do navegador para logs de debug');
      console.log('   - Os itens criados têm estoque baixo e validade próxima');
      console.log('   - As notificações só aparecem para itens não notificados');
    } else {
      console.log('❌ Nenhum item foi criado. Verifique os erros acima.');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o script
createTestItems(); 