import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/buttons/index.module.css';

const Button = ({ children, onClick = () => {}, className = '', disabled = false }) => {
  return (
    <button
      className={`${styles.button} ${styles[className]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default Button; 