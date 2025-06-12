import React from 'react';
import PropTypes from 'prop-types';
import WhatsAppButton from './ui/WhatsAppButton';
import CloseButton from './ui/CloseButton';
import NotificationItem from './NotificationItem';
import NotificationSection from './NotificationSection';
import useNotificationFormatter from '../hooks/useNotificationFormatter';
import styles from '../styles/NotificationModal.module.css';

// Componente principal do modal
const NotificationModal = ({ 
  lowStockItems = [], 
  expiredItems = [], 
  onClose, 
  onSendWhatsApp
}) => {
  const { formatDate, getValidityStatus, getStatusClass, formatWhatsAppNumber } = useNotificationFormatter();

  if (!onClose || !onSendWhatsApp) {
    console.error('Props obrigatórias não fornecidas ao NotificationModal');
    return null;
  }

  const totalItems = lowStockItems.length + expiredItems.length;

  // Formata os números de WhatsApp antes de renderizar
  const formattedLowStockItems = lowStockItems.map(item => ({
    ...item,
    formattedWhatsApp: formatWhatsAppNumber(item.whatsapp)
  }));

  const formattedExpiredItems = expiredItems.map(item => ({
    ...item,
    formattedWhatsApp: formatWhatsAppNumber(item.whatsapp)
  }));

  // Função assíncrona para enviar mensagens do WhatsApp
  const handleSendWhatsApp = async () => {
    try {
      await onSendWhatsApp();
    } catch (error) {
      console.error('Erro ao enviar mensagens do WhatsApp:', error);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>⚠️ Alerta de Itens</h2>
        <div className={styles.notificationContent}>
          <p className={styles.notificationSummary}>
            {totalItems} {totalItems === 1 ? 'item precisa' : 'itens precisam'} de atenção:
          </p>
          
          <NotificationSection
            title="Itens com Estoque Baixo"
            items={formattedLowStockItems}
            type="lowStock"
            formatDate={formatDate}
            getValidityStatus={getValidityStatus}
            getStatusClass={getStatusClass}
          />

          <NotificationSection
            title="Itens com Validade Próxima"
            items={formattedExpiredItems}
            type="expired"
            formatDate={formatDate}
            getValidityStatus={getValidityStatus}
            getStatusClass={getStatusClass}
          />

          <div className={styles.notificationActions}>
            <WhatsAppButton onClick={handleSendWhatsApp} className={styles.whatsappButton} />
            <CloseButton onClick={onClose} className={styles.closeButton} />
          </div>
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
    whatsapp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]).isRequired
  })),
  expiredItems: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    nome: PropTypes.string.isRequired,
    totalEstoque: PropTypes.number.isRequired,
    unidade: PropTypes.string.isRequired,
    dataValidade: PropTypes.string.isRequired,
    whatsapp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]).isRequired
  })),
  onClose: PropTypes.func.isRequired,
  onSendWhatsApp: PropTypes.func.isRequired
};

export default NotificationModal; 