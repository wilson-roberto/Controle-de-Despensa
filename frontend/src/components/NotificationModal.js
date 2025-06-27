import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CloseButton from './ui/CloseButton';
import useNotificationFormatter from '../hooks/useNotificationFormatter';
import WhatsAppService from '../services/whatsappService';
import styles from '../styles/NotificationModal.module.css';

// Componente principal do modal
const NotificationModal = ({ 
  lowStockItems = [], 
  expiredItems = [], 
  onClose
}) => {
  const { formatDate, getValidityStatus, getStatusClass } = useNotificationFormatter();
  const [sendingMessages, setSendingMessages] = useState(false);

  const totalItems = lowStockItems.length + expiredItems.length;

  // Verificar status das notificações ao carregar
  useEffect(() => {
    const checkStatus = async () => {
      await WhatsAppService.checkNotificationStatus();
    };
    checkStatus();
  }, []);

  if (!onClose) {
    console.error('Props obrigatórias não fornecidas ao NotificationModal');
    return null;
  }

  // Enviar notificação para todos os usuários
  const handleSendToAllUsers = async (type) => {
    setSendingMessages(true);
    
    try {
      console.log('📱 Iniciando envio de notificações para todos os usuários...');
      console.log('Tipo de notificação:', type);
      console.log('Itens com estoque baixo:', lowStockItems.length);
      console.log('Itens com validade próxima:', expiredItems.length);
      
      const result = await WhatsAppService.sendNotificationToAllUsers(type);
      
      if (result.success) {
        console.log('✅ Notificações enviadas com sucesso:', result.message);
        alert(`Notificações enviadas: ${result.message}`);
      } else {
        console.log('❌ Erro ao enviar notificações:', result.message);
        alert(`Erro ao enviar notificações: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Erro ao enviar notificações:', error);
      alert(`Erro ao enviar notificações: ${error.message}`);
    } finally {
      setSendingMessages(false);
    }
  };

  // Se não há itens com problemas, não mostrar o modal
  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>🚨 Estoque Baixo e Validade Próxima/Vencida</h2>
        
        {/* Botões posicionados no centro superior */}
        <div className={styles.notificationActions}>
          <button
            className={styles.whatsappButton}
            onClick={() => handleSendToAllUsers('all')}
            disabled={sendingMessages}
          >
            {sendingMessages ? 'Enviando...' : 'Enviar Alertas'}
          </button>
          <CloseButton onClick={onClose} className={styles.closeButton} />
        </div>
        
        <div className={styles.notificationContent}>
          <p className={styles.notificationSummary}>
            {totalItems} {totalItems === 1 ? 'item precisa' : 'itens precisam'} de atenção imediata:
          </p>
          
          {/* Seção de Estoque Baixo */}
          {lowStockItems.length > 0 && (
            <div className={styles.notificationSection}>
              <h3>Estoque Baixo</h3>
              <div className={styles.notificationItemsList}>
                {lowStockItems.map((item) => (
                  <div key={item._id || item.nome} className={styles.notificationItem + ' ' + styles.lowStockItemRow}>
                    <div className={styles.notificationItemName}>
                      <h4 title={item.nome}>{item.nome}</h4>
                    </div>
                    <div className={styles.notificationItemStock}>
                      <strong>Estoque:</strong> {item.totalEstoque} {item.unidade}
                    </div>
                    <div className={styles.notificationItemLimit}>
                      <strong>Limite:</strong> {item.limiteEstoque} {item.unidade}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seção de Validade Próxima/Vencida */}
          {expiredItems.length > 0 && (
            <div className={styles.notificationSection}>
              <h3>Validade Próxima/Vencida</h3>
              <div className={styles.notificationItemsList}>
                {expiredItems.map((item) => (
                  <div key={item._id || item.nome} className={styles.notificationItem}>
                    <h4>{item.nome}</h4>
                    <p><strong>Data de validade:</strong> {formatDate(item.dataValidade)}</p>
                    <p><strong>Status:</strong> <span className={styles[getStatusClass(item.dataValidade)]}>
                      {getValidityStatus(item.dataValidade)}
                    </span></p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

NotificationModal.propTypes = {
  lowStockItems: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    nome: PropTypes.string.isRequired,
    totalEstoque: PropTypes.number.isRequired,
    unidade: PropTypes.string.isRequired,
    limiteEstoque: PropTypes.number.isRequired,
    whatsapp: PropTypes.string
  })),
  expiredItems: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    nome: PropTypes.string.isRequired,
    totalEstoque: PropTypes.number.isRequired,
    unidade: PropTypes.string.isRequired,
    dataValidade: PropTypes.string.isRequired,
    whatsapp: PropTypes.string
  })),
  onClose: PropTypes.func.isRequired
};

export default NotificationModal; 