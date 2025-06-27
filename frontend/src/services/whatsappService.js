// Serviço para envio de mensagens WhatsApp
const WhatsAppService = {
  // Formatar número de telefone para WhatsApp
  formatPhoneNumber: (phone) => {
    if (!phone) {
      console.warn('Número de telefone não fornecido');
      return '';
    }
    
    // Remove todos os caracteres não numéricos
    let cleaned = phone.replace(/\D/g, '');
    
    console.log(`Formatando telefone: ${phone} -> ${cleaned}`);
    
    // Adiciona código do país se não estiver presente
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      cleaned = '55' + cleaned.substring(1);
    } else if (cleaned.length === 10) {
      cleaned = '55' + cleaned;
    } else if (cleaned.length === 11 && !cleaned.startsWith('55')) {
      cleaned = '55' + cleaned;
    }
    
    console.log(`Telefone formatado final: ${cleaned}`);
    return cleaned;
  },

  // Buscar usuários de notificação cadastrados
  getNotificationUsers: async () => {
    try {
      console.log('Buscando usuários de notificação...');
      const response = await fetch('/api/notification-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        console.error('Erro na resposta da API:', response.status, response.statusText);
        throw new Error(`Erro ao buscar usuários de notificação: ${response.status}`);
      }

      const data = await response.json();
      console.log('Usuários de notificação encontrados:', data.data?.length || 0);
      
      if (data.data && data.data.length > 0) {
        data.data.forEach(user => {
          console.log(`- ${user.fullName}: ${user.phone}`);
        });
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Erro ao buscar usuários de notificação:', error);
      return [];
    }
  },

  // Verificar status das notificações
  checkNotificationStatus: async () => {
    try {
      console.log('Verificando status das notificações...');
      const response = await fetch('/api/notification-users/status/check', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        console.error('Erro ao verificar status:', response.status, response.statusText);
        throw new Error(`Erro ao verificar status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Status das notificações:', data.data);
      return data.data;
    } catch (error) {
      console.error('Erro ao verificar status das notificações:', error);
      return { hasUsers: false, totalUsers: 0, recentUsers: [] };
    }
  },

  // Criar usuário de teste
  createTestUser: async () => {
    try {
      console.log('Criando usuário de teste...');
      const response = await fetch('/api/notification-users/test/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        console.error('Erro ao criar usuário de teste:', response.status, response.statusText);
        throw new Error(`Erro ao criar usuário de teste: ${response.status}`);
      }

      const data = await response.json();
      console.log('Usuário de teste criado:', data);
      return data;
    } catch (error) {
      console.error('Erro ao criar usuário de teste:', error);
      return { success: false, message: error.message };
    }
  },

  // Enviar mensagem via WhatsApp App (preferencial)
  sendWhatsAppMessage: (phone, message) => {
    const formattedPhone = WhatsAppService.formatPhoneNumber(phone);
    if (!formattedPhone) {
      throw new Error('Número de telefone inválido');
    }

    const encodedMessage = encodeURIComponent(message);
    // Tenta abrir o WhatsApp App
    const whatsappAppUrl = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;
    window.open(whatsappAppUrl, '_blank');
    return true;
  },

  // Enviar notificação para todos os usuários cadastrados
  sendNotificationToAllUsers: async (type = 'all') => {
    try {
      console.log('Iniciando envio de notificação para todos os usuários...');
      console.log('Tipo de notificação:', type);
      
      const users = await WhatsAppService.getNotificationUsers();
      
      if (users.length === 0) {
        console.log('Nenhum usuário de notificação cadastrado');
        return { success: false, message: 'Nenhum usuário de notificação cadastrado' };
      }

      console.log(`Enviando notificação para ${users.length} usuário(s)`);
      
      // Gerar mensagem baseada no tipo
      let message = '';
      
      if (type === 'lowStock') {
        message = `⚠️ ALERTA DE ESTOQUE BAIXO ⚠️\n\n`;
        message += `Itens com estoque baixo detectados.\n`;
        message += `Verifique a aplicação para mais detalhes.\n\n`;
        message += `Ação necessária: Repor estoque dos itens afetados.`;
      } else if (type === 'expired') {
        message = `⚠️ ALERTA DE VALIDADE ⚠️\n\n`;
        message += `Itens com validade próxima detectados.\n`;
        message += `Verifique a aplicação para mais detalhes.\n\n`;
        message += `Ação necessária: Verificar validade dos itens afetados.`;
      } else if (type === 'all') {
        message = `🚨 Estoque Baixo e Validade Próxima/Vencida 🚨\n\n`;
        message += `1 item precisa de atenção imediata:\n\n`;
        message += `Validade Próxima/Vencida\n`;
        message += `Arroz\n`;
        message += `Data de validade: 05/07/2025\n`;
        message += `Status: Vence em breve`;
      }
      
      console.log('Mensagem gerada:', message);
      
      const results = [];
      
      for (const user of users) {
        try {
          const formattedPhone = WhatsAppService.formatPhoneNumber(user.phone);
          if (formattedPhone) {
            const encodedMessage = encodeURIComponent(message);
            const whatsappAppUrl = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;
            console.log(`Abrindo WhatsApp App para ${user.fullName}: ${whatsappAppUrl}`);
            window.open(whatsappAppUrl, '_blank');
            results.push({ 
              user: user.fullName, 
              phone: user.phone, 
              success: true 
            });
          } else {
            console.warn(`Telefone inválido para usuário ${user.fullName}: ${user.phone}`);
            results.push({ 
              user: user.fullName, 
              phone: user.phone, 
              success: false, 
              error: 'Telefone inválido' 
            });
          }
        } catch (error) {
          console.error(`Erro ao enviar para ${user.fullName}:`, error);
          results.push({ 
            user: user.fullName, 
            phone: user.phone, 
            success: false, 
            error: error.message 
          });
        }
      }

      const successCount = results.filter(r => r.success).length;
      console.log(`Notificação enviada com sucesso para ${successCount}/${users.length} usuários`);

      return { 
        success: true, 
        message: `Enviando notificação para ${successCount}/${users.length} usuário(s)`,
        results 
      };
    } catch (error) {
      console.error('Erro ao enviar notificação para todos os usuários:', error);
      return { success: false, message: 'Erro ao enviar notificações' };
    }
  },

  // Gerar mensagem para item com estoque baixo
  generateLowStockMessage: (item) => {
    return `⚠️ ALERTA DE ESTOQUE BAIXO ⚠️

Item: ${item.nome}
Estoque atual: ${item.totalEstoque} ${item.unidade}
Limite mínimo: ${item.limiteEstoque} ${item.unidade}

É necessário repor o estoque deste item.`;
  },

  // Gerar mensagem para item com validade próxima
  generateExpiredMessage: (item) => {
    const dataValidade = new Date(item.dataValidade);
    const hoje = new Date();
    const diffTime = dataValidade - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let statusText = '';
    if (diffDays < 0) {
      statusText = 'VENCIDO';
    } else if (diffDays === 0) {
      statusText = 'VENCE HOJE';
    } else if (diffDays === 1) {
      statusText = 'VENCE AMANHÃ';
    } else {
      statusText = `VENCE EM ${diffDays} DIAS`;
    }

    return `⚠️ ALERTA DE VALIDADE ⚠️

Item: ${item.nome}
Estoque atual: ${item.totalEstoque} ${item.unidade}
Data de validade: ${dataValidade.toLocaleDateString('pt-BR')}
Status: ${statusText}

Atenção à validade deste item!`;
  },

  // Gerar mensagem combinada para item com ambos os problemas
  generateCombinedMessage: (item) => {
    const dataValidade = new Date(item.dataValidade);
    const hoje = new Date();
    const diffTime = dataValidade - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let statusText = '';
    if (diffDays < 0) {
      statusText = 'VENCIDO';
    } else if (diffDays === 0) {
      statusText = 'VENCE HOJE';
    } else if (diffDays === 1) {
      statusText = 'VENCE AMANHÃ';
    } else {
      statusText = `VENCE EM ${diffDays} DIAS`;
    }

    return `🚨 ALERTA CRÍTICO 🚨

Item: ${item.nome}
Estoque atual: ${item.totalEstoque} ${item.unidade}
Limite mínimo: ${item.limiteEstoque} ${item.unidade}
Data de validade: ${dataValidade.toLocaleDateString('pt-BR')}
Status: ${statusText}

ATENÇÃO: Este item está com estoque baixo E validade próxima!`;
  },

  // Enviar notificação para múltiplos itens
  sendBulkNotification: (items, type = 'all') => {
    const messages = [];
    
    items.forEach(item => {
      let message = '';
      
      if (type === 'lowStock' || (type === 'all' && WhatsAppService.isLowStock(item))) {
        message = WhatsAppService.generateLowStockMessage(item);
      } else if (type === 'expired' || (type === 'all' && WhatsAppService.isExpired(item))) {
        message = WhatsAppService.generateExpiredMessage(item);
      }
      
      if (message && item.whatsapp) {
        messages.push({
          phone: item.whatsapp,
          message: message,
          itemName: item.nome,
          // Adiciona o link do WhatsApp App
          whatsappAppUrl: `whatsapp://send?phone=${WhatsAppService.formatPhoneNumber(item.whatsapp)}&text=${encodeURIComponent(message)}`
        });
      }
    });
    
    return messages;
  },

  // Verificar se item tem estoque baixo (método auxiliar)
  isLowStock: (item) => {
    return Number(item.totalEstoque) <= Number(item.limiteEstoque);
  },

  // Verificar se item está com validade próxima (método auxiliar)
  isExpired: (item) => {
    if (!item.dataValidade) return false;
    
    const dataValidade = new Date(item.dataValidade);
    const hoje = new Date();
    
    const diffTime = dataValidade - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 15;
  }
};

export default WhatsAppService; 