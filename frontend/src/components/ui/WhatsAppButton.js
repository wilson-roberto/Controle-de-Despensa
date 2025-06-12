import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/buttons/index.module.css';

const WhatsAppButton = ({ onClick, disabled = false, children = 'Enviar WhatsApp', className = '' }) => {
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await onClick();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  return (
    <button 
      onClick={handleClick} 
      className={`${styles.button} ${styles.success} ${className}`.trim()}
      disabled={disabled}
      aria-label="Enviar mensagem via WhatsApp"
    >
      {children}
    </button>
  );
};

WhatsAppButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string
};

export default WhatsAppButton; 