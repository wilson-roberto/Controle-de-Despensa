// Script para testar as alterações do modal de notificação
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

// Função para buscar todos os itens
async function getItems(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/items`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Resposta da API:', response.data);
    console.log('Tipo da resposta:', typeof response.data);
    console.log('É array?', Array.isArray(response.data));
    
    // Se a resposta é um array, retornar diretamente
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Se a resposta tem uma propriedade data, retornar ela
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // Caso contrário, retornar a resposta completa
    return response.data;
  } catch (error) {
    console.log('❌ Erro ao buscar itens:', error.response?.data?.message || error.message);
    console.log('Status do erro:', error.response?.status);
    console.log('Dados do erro:', error.response?.data);
    return [];
  }
}

// Função para simular a lógica do frontend
function simulateFrontendLogic(items) {
  console.log('🧪 Simulando lógica do frontend...\n');
  
  const lowStockItems = [];
  const expiredItems = [];
  
  items.forEach(item => {
    // Verificar estoque baixo
    const estoque = Number(item.totalEstoque);
    const limite = Number(item.limiteEstoque);
    const isLowStock = estoque <= limite && !item.notificadoEstoque;
    
    // Verificar validade
    let isExpired = false;
    if (item.dataValidade) {
      const dataValidade = new Date(item.dataValidade);
      const hoje = new Date();
      const diffTime = dataValidade - hoje;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      isExpired = diffDays <= 15 && !item.notificadoValidade;
    }
    
    if (isLowStock) {
      lowStockItems.push(item);
    }
    
    if (isExpired) {
      expiredItems.push(item);
    }
  });
  
  return { lowStockItems, expiredItems };
}

// Função para testar a formatação do status
function testStatusFormatting(items) {
  console.log('📊 Testando formatação de status...\n');
  
  items.forEach(item => {
    console.log(`📋 Item: ${item.nome}`);
    
    // Status do estoque
    const estoque = Number(item.totalEstoque);
    const limite = Number(item.limiteEstoque);
    const diferenca = limite - estoque;
    
    let stockStatus = '';
    if (estoque === 0) {
      stockStatus = '🚨 ESTOQUE ZERO';
    } else if (estoque <= limite) {
      stockStatus = `⚠️ ESTOQUE BAIXO - Faltam ${diferenca} ${item.unidade}`;
    } else {
      stockStatus = '✅ ESTOQUE OK';
    }
    
    console.log(`   📦 Status do Estoque: ${stockStatus}`);
    console.log(`   Estoque atual: ${item.totalEstoque} ${item.unidade} | Limite mínimo: ${item.limiteEstoque} ${item.unidade}`);
    
    // Status da validade
    if (item.dataValidade) {
      const dataValidade = new Date(item.dataValidade);
      const hoje = new Date();
      const diffTime = dataValidade - hoje;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let validityStatus = '';
      if (diffDays < 0) {
        validityStatus = '🚨 VENCIDO';
      } else if (diffDays === 0) {
        validityStatus = '🚨 VENCE HOJE';
      } else if (diffDays === 1) {
        validityStatus = '⚠️ VENCE AMANHÃ';
      } else if (diffDays <= 7) {
        validityStatus = `⚠️ VENCE EM ${diffDays} DIAS`;
      } else if (diffDays <= 15) {
        validityStatus = `⏰ VENCE EM ${diffDays} DIAS`;
      } else {
        validityStatus = '✅ VÁLIDO';
      }
      
      console.log(`   📅 Status da Validade: ${validityStatus}`);
      console.log(`   Data de validade: ${item.dataValidade}`);
    } else {
      console.log(`   📅 Status da Validade: ❓ Data não informada`);
    }
    
    console.log(`   📞 Contato: ${item.whatsapp || 'Não informado'}`);
    console.log('');
  });
}

async function testModalChanges() {
  console.log('🧪 Testando alterações do modal de notificação...\n');

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

    // 3. Criar itens de teste específicos para o modal
    console.log('3. Criando itens de teste para o modal...');
    
    const timestamp = Date.now();
    const testItems = [
      {
        nome: `Arroz Modal Teste ${timestamp} - Estoque Zero`,
        totalEstoque: 0,
        unidade: 'kg',
        limiteEstoque: 5,
        dataValidade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        whatsapp: '11999999999'
      },
      {
        nome: `Feijão Modal Teste ${timestamp} - Estoque Baixo`,
        totalEstoque: 2,
        unidade: 'kg',
        limiteEstoque: 5,
        dataValidade: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        whatsapp: '11888888888'
      },
      {
        nome: `Leite Modal Teste ${timestamp} - Vence Hoje`,
        totalEstoque: 8,
        unidade: 'l',
        limiteEstoque: 3,
        dataValidade: new Date().toISOString().split('T')[0], // Hoje
        whatsapp: '11777777777'
      },
      {
        nome: `Pão Modal Teste ${timestamp} - Vencido`,
        totalEstoque: 5,
        unidade: 'un',
        limiteEstoque: 10,
        dataValidade: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 dias atrás
        whatsapp: '11666666666'
      },
      {
        nome: `Queijo Modal Teste ${timestamp} - Crítico (Estoque + Validade)`,
        totalEstoque: 1,
        unidade: 'kg',
        limiteEstoque: 3,
        dataValidade: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 dias
        whatsapp: '11555555555'
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
    console.log(`🎯 ${createdCount}/${testItems.length} itens de teste criados`);
    console.log('');

    // 4. Buscar todos os itens e simular lógica do frontend
    console.log('4. Simulando lógica do frontend...');
    const allItems = await getItems(token);
    const { lowStockItems, expiredItems } = simulateFrontendLogic(allItems);
    
    console.log(`📊 Resultado da análise:`);
    console.log(`   - Total de itens: ${allItems.length}`);
    console.log(`   - Itens com estoque baixo: ${lowStockItems.length}`);
    console.log(`   - Itens com validade próxima: ${expiredItems.length}`);
    console.log(`   - Total com problemas: ${lowStockItems.length + expiredItems.length}`);
    console.log('');

    // 5. Testar formatação de status
    const itemsWithProblems = [...lowStockItems, ...expiredItems];
    if (itemsWithProblems.length > 0) {
      testStatusFormatting(itemsWithProblems);
    }

    // 6. Resumo final
    console.log('6. Resumo do teste:');
    console.log('');
    console.log('✅ Alterações implementadas:');
    console.log('   - Modal agora exibe apenas itens com problemas');
    console.log('   - Status do estoque é mostrado claramente (ESTOQUE ZERO, ESTOQUE BAIXO, etc.)');
    console.log('   - Status da validade é mostrado claramente (VENCIDO, VENCE HOJE, etc.)');
    console.log('   - Informações de contato são exibidas');
    console.log('   - Interface mais limpa e focada nos problemas');
    console.log('');
    console.log('🎯 Para testar no frontend:');
    console.log('   1. Acesse a aplicação no navegador');
    console.log('   2. Faça login com admin/admin123456');
    console.log('   3. O modal deve aparecer automaticamente');
    console.log('   4. Verifique se os status estão sendo exibidos corretamente');
    console.log('   5. Teste o botão "Enviar Alertas"');
    console.log('');
    console.log('🔧 Verificações importantes:');
    console.log('   - Modal só aparece quando há itens com problemas');
    console.log('   - Status do estoque mostra a diferença faltante');
    console.log('   - Status da validade mostra quantos dias faltam');
    console.log('   - Ícones e cores estão aplicados corretamente');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o teste
testModalChanges(); 