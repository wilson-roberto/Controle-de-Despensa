import { useApp } from '../context/AppContext';
import { isStockLow, isExpired } from './ItemStatus';
import { formatWhatsAppForAPI } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

export const useNotificationHandler = (notificationItems) => {
  const { updateItem } = useApp();
  const navigate = useNavigate();

  const handleSendWhatsApp = async () => {
    if (!Array.isArray(notificationItems) || notificationItems.length === 0) return;
    
    try {
      // Coleta todos os números de WhatsApp únicos
      const allWhatsAppNumbers = new Set();
      const messages = [];
      const itemsToUpdate = [];

      for (const item of notificationItems) {
        // Verifica se o item tem todas as propriedades necessárias
        if (!item || !item._id || !item.nome || !item.whatsapp) {
          console.warn('Item inválido ou incompleto:', item);
          continue;
        }
        
        const whatsappNumbers = Array.isArray(item.whatsapp)
          ? item.whatsapp.map(n => formatWhatsAppForAPI(n))
          : [formatWhatsAppForAPI(item.whatsapp)];
        
        const message = `⚠️ ALERTA: ${item.nome}\n` +
          (isStockLow(item) ? `Estoque baixo: ${item.totalEstoque} ${item.unidade} (mínimo: ${item.limiteEstoque} ${item.unidade})\n` : '') +
          (isExpired(item) ? `Data de validade: ${new Date(item.dataValidade).toLocaleDateString('pt-BR')}\n` : '') +
          `Status: ${isExpired(item) ? 'PRÓXIMO DA VALIDADE' : 'ESTOQUE BAIXO'}`;
        
        messages.push(message);
        whatsappNumbers.forEach(phone => {
          if (phone) allWhatsAppNumbers.add(phone);
        });

        // Adiciona o item à lista de itens para atualização
        itemsToUpdate.push(item);
      }

      if (allWhatsAppNumbers.size === 0) {
        alert('Nenhum número de WhatsApp válido encontrado');
        return;
      }

      // Envia todas as mensagens para todos os números
      const phones = Array.from(allWhatsAppNumbers);
      const message = messages.join('\n\n');

      const response = await fetch('http://localhost:5000/api/whatsapp/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phones, message })
      });
      
      if (response.status === 404) {
        alert('A rota /api/whatsapp/send-whatsapp não foi encontrada. Verifique se o backend está rodando e se a rota existe.');
        throw new Error('Rota /api/whatsapp/send-whatsapp não encontrada');
      }
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || result.message || 'Erro ao gerar links do WhatsApp');
      }

      // Abre todos os links do WhatsApp Business App em novas abas
      result.whatsappLinks.forEach(link => {
        window.open(link, '_blank');
      });

      // Atualiza o status de notificação para todos os itens
      const updatePromises = itemsToUpdate.map(item => {
        if (!item._id) {
          console.warn('Tentativa de atualizar item sem ID:', item);
          return Promise.resolve();
        }
        // Passa o objeto completo com _id e dados a serem atualizados
        return updateItem({
          ...item,
          notificado: true
        });
      });

      // Aguarda todas as atualizações serem concluídas
      await Promise.all(updatePromises);

      // Força um pequeno delay para garantir que as atualizações foram processadas
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redireciona para a página principal após o envio bem-sucedido
      navigate('/', { replace: true });

    } catch (error) {
      console.error('Erro ao enviar notificações:', error);
      alert('Erro ao enviar notificações: ' + error.message);
    }
  };

  return { handleSendWhatsApp };
}; 