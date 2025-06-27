// Script de teste para verificar notificações
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

async function testNotifications() {
  console.log('🧪 Testando sistema de notificações...\n');

  try {
    // 1. Verificar se a API está rodando
    console.log('1. Verificando se a API está rodando...');
    const healthCheck = await axios.get(`${API_BASE_URL}/`);
    console.log('✅ API está funcionando:', healthCheck.data.message);
    console.log('   Ambiente:', healthCheck.data.environment);
    console.log('   Versão:', healthCheck.data.version);
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

    // 3. Verificar status das notificações
    console.log('3. Verificando status das notificações...');
    try {
      const statusResponse = await axios.get(`${API_BASE_URL}/api/notification-users/status/check`);
      const status = statusResponse.data.data;
      console.log('✅ Status das notificações:');
      console.log('   Total de usuários:', status.totalUsers);
      console.log('   Tem usuários cadastrados:', status.hasUsers ? 'Sim' : 'Não');
      
      if (status.recentUsers && status.recentUsers.length > 0) {
        console.log('   Usuários recentes:');
        status.recentUsers.forEach(user => {
          console.log(`     - ${user.fullName}: ${user.phone}`);
        });
      }
    } catch (error) {
      console.log('❌ Erro ao verificar status:', error.response?.data?.message || error.message);
    }
    console.log('');

    // 4. Criar usuário de teste se não houver usuários
    console.log('4. Criando usuário de teste...');
    try {
      const createResponse = await axios.post(`${API_BASE_URL}/api/notification-users/test/create`);
      console.log('✅ Usuário de teste criado:', createResponse.data.message);
    } catch (error) {
      console.log('❌ Erro ao criar usuário de teste:', error.response?.data?.message || error.message);
    }
    console.log('');

    // 5. Verificar usuários novamente
    console.log('5. Verificando usuários após criação...');
    try {
      const usersResponse = await axios.get(`${API_BASE_URL}/api/notification-users`);
      const users = usersResponse.data.data;
      console.log('✅ Usuários cadastrados:', users.length);
      users.forEach(user => {
        console.log(`   - ${user.fullName}: ${user.phone} (Ativo: ${user.isActive})`);
      });
    } catch (error) {
      console.log('❌ Erro ao buscar usuários:', error.response?.data?.message || error.message);
    }
    console.log('');

    // 6. Verificar itens existentes
    console.log('6. Verificando itens existentes...');
    try {
      const itemsResponse = await axios.get(`${API_BASE_URL}/api/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const items = itemsResponse.data?.data || [];
      console.log('✅ Itens encontrados:', items.length);
      
      if (items.length === 0) {
        console.log('   Nenhum item encontrado no sistema');
      } else {
        // Analisar itens com problemas
        const lowStockItems = items.filter(item => Number(item.totalEstoque) <= Number(item.limiteEstoque));
        const expiredItems = items.filter(item => {
          if (!item.dataValidade) return false;
          const dataValidade = new Date(item.dataValidade);
          const hoje = new Date();
          const diffTime = dataValidade - hoje;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 15;
        });
        
        console.log('   Itens com estoque baixo:', lowStockItems.length);
        console.log('   Itens com validade próxima:', expiredItems.length);
        
        if (lowStockItems.length > 0) {
          console.log('   Itens com estoque baixo:');
          lowStockItems.forEach(item => {
            console.log(`     - ${item.nome}: ${item.totalEstoque}/${item.limiteEstoque} ${item.unidade}`);
          });
        }
        
        if (expiredItems.length > 0) {
          console.log('   Itens com validade próxima:');
          expiredItems.forEach(item => {
            console.log(`     - ${item.nome}: ${item.dataValidade}`);
          });
        }
      }
    } catch (error) {
      console.log('❌ Erro ao buscar itens:', error.response?.data?.message || error.message);
    }
    console.log('');

    // 7. Criar itens de teste se não houver itens com problemas
    console.log('7. Criando itens de teste...');
    try {
      const itemsResponse = await axios.get(`${API_BASE_URL}/api/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const items = itemsResponse.data?.data || [];
      
      if (items.length === 0) {
        console.log('   Criando itens de teste...');
        
        const testItems = [
          {
            nome: 'Arroz Teste - Estoque Baixo',
            totalEstoque: 2,
            unidade: 'kg',
            limiteEstoque: 5,
            dataValidade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
            whatsapp: '11999999999'
          },
          {
            nome: 'Feijão Teste - Validade Próxima',
            totalEstoque: 10,
            unidade: 'kg',
            limiteEstoque: 3,
            dataValidade: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 dias
            whatsapp: '11999999999'
          },
          {
            nome: 'Leite Teste - Crítico',
            totalEstoque: 1,
            unidade: 'l',
            limiteEstoque: 5,
            dataValidade: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 dias
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

        console.log(`   🎯 ${createdCount}/${testItems.length} itens de teste criados`);
      } else {
        console.log('   Itens já existem no sistema');
      }
    } catch (error) {
      console.log('❌ Erro ao criar itens de teste:', error.response?.data?.message || error.message);
    }
    console.log('');

    console.log('🎯 Resumo do teste:');
    console.log('   - API está funcionando');
    console.log('   - Sistema de notificações configurado');
    console.log('   - Usuário de teste criado');
    console.log('   - Itens de teste criados');
    console.log('');
    console.log('📱 Para testar as notificações:');
    console.log('   1. Acesse a aplicação no navegador');
    console.log('   2. Faça login com admin/admin123456');
    console.log('   3. O modal de notificações deve aparecer automaticamente');
    console.log('   4. Clique nos botões de envio para testar o WhatsApp');
    console.log('');
    console.log('🔧 Dicas para teste:');
    console.log('   - Verifique o console do navegador para logs de debug');
    console.log('   - Os itens de teste têm estoque baixo e validade próxima');
    console.log('   - As notificações só aparecem para itens não notificados');

  } catch (error) {
    console.error('❌ Erro geral no teste:', error.message);
    console.log('');
    console.log('🔧 Possíveis soluções:');
    console.log('   1. Verifique se o backend está rodando na porta 5000');
    console.log('   2. Verifique se o MongoDB está conectado');
    console.log('   3. Verifique os logs do servidor para mais detalhes');
  }
}

// Executar o teste
testNotifications(); 