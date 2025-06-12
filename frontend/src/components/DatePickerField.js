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

  return (
    <div className={gridStyles.inputGroup}>
      <label htmlFor={id}>{label}</label>
      <div className={dateStyles.datePickerWrapper}>
        <DatePicker
          id={id}
          selected={value ? new Date(value) : null}
          onChange={handleDateChange}
          className={dateStyles.datePickerInput}
          {...datepickerConfig}
        />
      </div>
    </div>
  );
};

export default DatePickerField; 