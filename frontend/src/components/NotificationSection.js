import React from 'react';
import PropTypes from 'prop-types';
import NotificationItem from './NotificationItem';
import styles from '../styles/NotificationModal.module.css';

const NotificationSection = ({ title, items, type, formatDate, getValidityStatus, getStatusClass }) => {
  if (items.length === 0) return null;

  return (
    <div className="notification-section">
      <h3>{title}</h3>
      <div className="notification-items-list">
        {items.map((item) => (
          <NotificationItem
            key={item._id || item.nome}
            item={item}
            type={type}
            formatDate={formatDate}
            getValidityStatus={getValidityStatus}
            getStatusClass={getStatusClass}
          />
        ))}
      </div>
    </div>
  );
};

NotificationSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    nome: PropTypes.string.isRequired,
    totalEstoque: PropTypes.number.isRequired,
    unidade: PropTypes.string.isRequired,
    limiteEstoque: PropTypes.number,
    dataValidade: PropTypes.string,
    formattedWhatsApp: PropTypes.string.isRequired
  })).isRequired,
  type: PropTypes.oneOf(['expired', 'lowStock']).isRequired,
  formatDate: PropTypes.func.isRequired,
  getValidityStatus: PropTypes.func.isRequired,
  getStatusClass: PropTypes.func.isRequired
};

export default NotificationSection; 