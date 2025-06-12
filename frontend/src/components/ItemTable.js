import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import NotificationModal from './NotificationModal';
import ItemRow from './ItemRow';
import ItemTableHeader from './ItemTableHeader';
import { isStockLow, isExpired } from './ItemStatus';
import { API_URL, endpoints } from '../config/api';
import { formatWhatsAppForAPI } from '../utils/formatters';
import axios from 'axios';
import { useNotificationItems } from './useNotificationItems';
import { useNotificationHandler } from './useNotificationHandler';
import { formatDate, getValidityStatus, getStatusClass } from '../utils/itemUtils';
import styles from '../styles/ItemTable.module.css';

const ItemTable = () => {
  const { state } = useApp();
  const { items, loading, error } = state;
  const [showModal, setShowModal] = useState(false);

  console.log('ItemTable - Estado atual:', { items, loading, error });

  // Hook customizado para separar itens de notificação
  const {
    lowStockItems,
    expiredItems
  } = useNotificationItems(items);

  // Lista de todos os itens que precisam de notificação
  const notificationItems = [...lowStockItems, ...expiredItems];

  // Hook para lidar com notificações
  const { handleSendWhatsApp } = useNotificationHandler(notificationItems);

  useEffect(() => {
    // Exibe o modal se houver itens para notificar
    if (notificationItems.length > 0) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [notificationItems.length]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSendWhatsAppAndClose = async () => {
    try {
      await handleSendWhatsApp();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao enviar mensagens:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando itens...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!items || items.length === 0) {
    return <div className={styles.error}>Nenhum item encontrado.</div>;
  }

  return (
    <div className="item-table-container">
      <table className={styles.table}>
        <ItemTableHeader />
        <tbody>
          {items.map((item) => (
            <ItemRow key={item._id} item={item} />
          ))}
        </tbody>
      </table>

      {showModal && notificationItems.length > 0 && (
        <NotificationModal
          lowStockItems={lowStockItems}
          expiredItems={expiredItems}
          formatDate={formatDate}
          getValidityStatus={getValidityStatus}
          getStatusClass={getStatusClass}
          onClose={handleCloseModal}
          onSendWhatsApp={handleSendWhatsAppAndClose}
        />
      )}
    </div>
  );
};

export default ItemTable; 