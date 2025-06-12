import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/buttons/index.module.css';

const CloseButton = ({ onClick, disabled = false, children = 'Fechar', className = '' }) => {
  return (
    <button 
      onClick={onClick} 
      className={`${styles.button} ${styles.close} ${className}`.trim()}
      disabled={disabled}
      aria-label="Fechar modal"
    >
      {children}
    </button>
  );
};

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string
};

export default CloseButton; 