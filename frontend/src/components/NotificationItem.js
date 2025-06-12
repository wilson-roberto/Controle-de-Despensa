import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/NotificationModal.module.css';

const NotificationItem = ({ item, type, formatDate, getValidityStatus, getStatusClass }) => {
  return (
    <div className="notification-item">
      <div className="notification-item-header">
        <h4>{item.nome}</h4>
      </div>
      <p>Estoque atual: <strong>{item.totalEstoque} {item.unidade}</strong></p>
      {type === 'expired' && (
        <>
          <p>Data de validade: <strong>{formatDate(item.dataValidade)}</strong></p>
          <p>Status: <strong className={getStatusClass(getValidityStatus(item.dataValidade))}>
            {getValidityStatus(item.dataValidade)}
          </strong></p>
        </>
      )}
      {type === 'lowStock' && (
        <p>Limite mínimo: <strong>{item.limiteEstoque} {item.unidade}</strong></p>
      )}
      <p>WhatsApp: <strong>{item.formattedWhatsApp}</strong></p>
    </div>
  );
};

NotificationItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    nome: PropTypes.string.isRequired,
    totalEstoque: PropTypes.number.isRequired,
    unidade: PropTypes.string.isRequired,
    limiteEstoque: PropTypes.number,
    dataValidade: PropTypes.string,
    formattedWhatsApp: PropTypes.string.isRequired
  }).isRequired,
  type: PropTypes.oneOf(['expired', 'lowStock']).isRequired,
  formatDate: PropTypes.func.isRequired,
  getValidityStatus: PropTypes.func.isRequired,
  getStatusClass: PropTypes.func.isRequired
};

export default NotificationItem; 