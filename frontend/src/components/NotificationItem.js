import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/NotificationModal.module.css';

const NotificationItem = ({ item, type, formatDate, getValidityStatus, getStatusClass }) => {
  // Função para formatar número de WhatsApp
  const formatWhatsApp = (whatsapp) => {
    if (!whatsapp) return 'Não informado';
    
    // Remove todos os caracteres não numéricos
    const cleaned = whatsapp.replace(/\D/g, '');
    
    // Formata o número brasileiro
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    
    return whatsapp; // Retorna original se não conseguir formatar
  };

  // Função para calcular o status do estoque
  const getStockStatus = () => {
    const estoque = Number(item.totalEstoque);
    const limite = Number(item.limiteEstoque);
    const diferenca = limite - estoque;
    
    if (estoque === 0) {
      return { status: 'ESTOQUE ZERO', class: 'statusExpired', icon: '🚨' };
    } else if (estoque <= limite) {
      return { 
        status: `ESTOQUE BAIXO - Faltam ${diferenca} ${item.unidade}`, 
        class: 'statusWarning', 
        icon: '⚠️' 
      };
    }
    return { status: 'ESTOQUE OK', class: 'statusValid', icon: '✅' };
  };

  // Função para calcular o status da validade
  const getValidityStatusInfo = () => {
    if (!item.dataValidade) {
      return { status: 'Data não informada', class: 'statusInfo', icon: '❓' };
    }
    
    const dataValidade = new Date(item.dataValidade);
    const hoje = new Date();
    const diffTime = dataValidade - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'VENCIDO', class: 'statusExpired', icon: '🚨' };
    } else if (diffDays === 0) {
      return { status: 'VENCE HOJE', class: 'statusExpired', icon: '🚨' };
    } else if (diffDays === 1) {
      return { status: 'VENCE AMANHÃ', class: 'statusWarning', icon: '⚠️' };
    } else if (diffDays <= 7) {
      return { status: `VENCE EM ${diffDays} DIAS`, class: 'statusWarning', icon: '⚠️' };
    } else if (diffDays <= 15) {
      return { status: `VENCE EM ${diffDays} DIAS`, class: 'statusInfo', icon: '⏰' };
    }
    
    return { status: 'VÁLIDO', class: 'statusValid', icon: '✅' };
  };

  const stockStatus = getStockStatus();
  const validityStatus = getValidityStatusInfo();

  return (
    <div className={styles.notificationItem}>
      <div className={styles.notificationItemHeader}>
        <h4>{item.nome}</h4>
      </div>
      
      {/* Status do Estoque */}
      <div className={styles.statusSection}>
        <p className={styles.statusLabel}>
          <strong>📦 Status do Estoque:</strong>
        </p>
        <p className={`${styles.statusValue} ${styles[stockStatus.class]}`}>
          {stockStatus.icon} {stockStatus.status}
        </p>
        <p className={styles.stockDetails}>
          Estoque atual: <strong>{item.totalEstoque} {item.unidade}</strong> | 
          Limite mínimo: <strong>{item.limiteEstoque} {item.unidade}</strong>
        </p>
      </div>

      {/* Status da Validade (apenas se houver data de validade) */}
      {item.dataValidade && (
        <div className={styles.statusSection}>
          <p className={styles.statusLabel}>
            <strong>📅 Status da Validade:</strong>
          </p>
          <p className={`${styles.statusValue} ${styles[validityStatus.class]}`}>
            {validityStatus.icon} {validityStatus.status}
          </p>
          <p className={styles.validityDetails}>
            Data de validade: <strong>{formatDate(item.dataValidade)}</strong>
          </p>
        </div>
      )}

      {/* Informações de contato */}
      <div className={styles.contactSection}>
        <p className={styles.contactLabel}>
          <strong>📞 Contato:</strong> {formatWhatsApp(item.whatsapp)}
        </p>
      </div>
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
    whatsapp: PropTypes.string
  }).isRequired,
  type: PropTypes.oneOf(['expired', 'lowStock']).isRequired,
  formatDate: PropTypes.func.isRequired,
  getValidityStatus: PropTypes.func.isRequired,
  getStatusClass: PropTypes.func.isRequired
};

export default NotificationItem; 