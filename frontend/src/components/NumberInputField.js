import React from 'react';
import gridStyles from './InputGrid.module.css';

const NumberInputField = ({
  id,
  label,
  name,
  value,
  onChange,
  onMouseOver,
  readOnly = false,
  className = '',
  placeholder
}) => {
  return (
    <div className={gridStyles.inputGroup}>
      <label htmlFor={id}>{label}</label>
      <input
        type="number"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onMouseOver={onMouseOver}
        readOnly={readOnly}
        className={`number-input ${className}`}
        placeholder={placeholder}
        min="0"
        step="1"
      />
    </div>
  );
};

export default NumberInputField; 