import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import gridStyles from './InputGrid.module.css';
import dateStyles from './DatePicker.module.css';
import { datepickerConfig } from '../config/datepicker';

const DatePickerField = ({ id, label, value, onChange, name }) => {
  const handleDateChange = (date) => {
    onChange({
      target: {
        name,
        value: date ? date.toISOString().split('T')[0] : ''
      }
    });
  };

  // Determinar se é o campo Validade para aplicar classe específica
  const isValidadeField = label === 'Validade';
  const inputClassName = isValidadeField ? dateStyles.validadeField : dateStyles.datePickerInput;
  const wrapperClassName = isValidadeField ? dateStyles.validadeWrapper : dateStyles.datePickerWrapper;

  return (
    <div className={gridStyles.inputGroup}>
      <label htmlFor={id}>{label}</label>
      <div className={wrapperClassName}>
        <DatePicker
          id={id}
          selected={value ? new Date(value) : null}
          onChange={handleDateChange}
          className={inputClassName}
          data-testid="datepicker-input"
          {...datepickerConfig}
        />
      </div>
    </div>
  );
};

export default DatePickerField; 