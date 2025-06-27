// Script para verificar status dos itens existentes
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

async function checkItemsStatus() {
  console.log('🔍 Verificando status dos itens existentes...\n');

  try {
    // 1. Fazer login para obter token
    console.log('1. Fazendo login...');
    const token = await getAuthToken();
    if (!token) {
      console.log('❌ Não foi possível obter token de autenticação');
      return;
    }
    console.log('✅ Login realizado com sucesso');
    console.log('');

    // 2. Buscar todos os itens
    console.log('2. Buscando itens...');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const items = response.data?.data || [];
      console.log(`✅ ${items.length} itens encontrados`);
      console.log('');

      if (items.length === 0) {
        console.log('❌ Nenhum item encontrado');
        return;
      }

      // 3. Analisar cada item
      console.log('3. Analisando itens:');
      console.log('');
      
      let itemsWithProblems = 0;
      
      items.forEach((item, index) => {
        console.log(`📋 Item ${index + 1}: ${item.nome}`);
        console.log(`   - Estoque: ${item.totalEstoque}/${item.limiteEstoque} ${item.unidade}`);
        console.log(`   - Validade: ${item.dataValidade || 'Não definida'}`);
        console.log(`   - Notificado estoque: ${item.notificadoEstoque || false}`);
        console.log(`   - Notificado validade: ${item.notificadoValidade || false}`);
        
        // Verificar problemas
        const isLowStock = Number(item.totalEstoque) <= Number(item.limiteEstoque);
        const isExpired = item.dataValidade ? (() => {
          const dataValidade = new Date(item.dataValidade);
          const hoje = new Date();
          const diffTime = dataValidade - hoje;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 15;
        })() : false;
        
        const needsStockNotification = isLowStock && !item.notificadoEstoque;
        const needsValidityNotification = isExpired && !item.notificadoValidade;
        
        if (isLowStock) {
          console.log(`   📉 ESTOQUE BAIXO: ${needsStockNotification ? 'PRECISA NOTIFICAR' : 'JÁ NOTIFICADO'}`);
        }
        
        if (isExpired) {
          console.log(`   ⏰ VALIDADE PRÓXIMA: ${needsValidityNotification ? 'PRECISA NOTIFICAR' : 'JÁ NOTIFICADO'}`);
        }
        
        if (needsStockNotification || needsValidityNotification) {
          itemsWithProblems++;
          console.log(`   🚨 PRECISA DE NOTIFICAÇÃO`);
        } else if (isLowStock || isExpired) {
          console.log(`   ✅ PROBLEMA DETECTADO MAS JÁ NOTIFICADO`);
        } else {
          console.log(`   ✅ SEM PROBLEMAS`);
        }
        
        console.log('');
      });

      // 4. Resumo
      console.log('4. Resumo:');
      console.log(`   - Total de itens: ${items.length}`);
      console.log(`   - Itens com problemas não notificados: ${itemsWithProblems}`);
      console.log('');
      
      if (itemsWithProblems > 0) {
        console.log('🎯 O modal de notificação DEVE aparecer!');
        console.log('   Verifique se:');
        console.log('   1. A aplicação está carregando os itens corretamente');
        console.log('   2. O hook useNotificationItems está funcionando');
        console.log('   3. O useEffect na Home.js está sendo executado');
      } else {
        console.log('ℹ️ Nenhum item precisa de notificação no momento');
        console.log('   Para testar, você pode:');
        console.log('   1. Resetar as notificações de um item');
        console.log('   2. Criar um novo item com problemas');
        console.log('   3. Modificar um item existente para ter problemas');
      }

    } catch (error) {
      console.log('❌ Erro ao buscar itens:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o script
checkItemsStatus(); 