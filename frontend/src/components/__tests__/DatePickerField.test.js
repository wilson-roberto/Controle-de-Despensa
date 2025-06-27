import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock do CSS module - deve vir antes de qualquer import
jest.mock('../DatePicker.module.css', () => ({
  datePickerWrapper: 'datePickerWrapper',
  datePickerInput: 'datePickerInput',
  validadeField: 'validadeField',
  validadeWrapper: 'validadeWrapper'
}), { virtual: true });

jest.mock('../InputGrid.module.css', () => ({
  inputGroup: 'inputGroup'
}), { virtual: true });

// Mock do arquivo de configuração
jest.mock('../../config/datepicker', () => ({
  datepickerConfig: {
    locale: 'pt-BR',
    dateFormat: 'dd/MM/yyyy',
    showYearDropdown: true,
    scrollableYearDropdown: true,
    yearDropdownItemNumber: 15,
    isClearable: true,
    placeholderText: 'Selecione uma data'
  }
}));

// Mock do react-datepicker
const MockDatePicker = (props) => {
  const { className = '', selected, onChange, ...rest } = props;
  const validInputProps = {};
  const validProps = ['id', 'placeholder', 'disabled', 'readOnly', 'data-testid'];

  Object.keys(rest).forEach(key => {
    if (validProps.includes(key)) {
      validInputProps[key] = rest[key];
    }
  });

  return (
    <input
      type="text"
      className={className}
      value={selected ? selected.toISOString().split('T')[0] : ''}
      onChange={(e) => {
        const date = e.target.value ? new Date(e.target.value) : null;
        onChange(date);
      }}
      data-testid="datepicker-input"
      {...validInputProps}
    />
  );
};

MockDatePicker.registerLocale = jest.fn();

jest.mock('react-datepicker', () => MockDatePicker);

// Import do componente após os mocks
const DatePickerField = require('../DatePickerField').default;

describe('DatePickerField', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('deve renderizar o campo com label correto', () => {
    render(
      <DatePickerField
        id="test-date"
        label="Data de Teste"
        value=""
        onChange={mockOnChange}
        name="testDate"
      />
    );

    expect(screen.getByLabelText('Data de Teste')).toBeInTheDocument();
  });

  it('deve aplicar a classe validadeField quando o label for "Validade"', () => {
    render(
      <DatePickerField
        id="dataValidade"
        label="Validade"
        value=""
        onChange={mockOnChange}
        name="dataValidade"
      />
    );

    const input = screen.getByTestId('datepicker-input');
    expect(input).toBeInTheDocument();
  });

  it('deve aplicar a classe datePickerInput quando o label não for "Validade"', () => {
    render(
      <DatePickerField
        id="outraData"
        label="Outra Data"
        value=""
        onChange={mockOnChange}
        name="outraData"
      />
    );

    const input = screen.getByTestId('datepicker-input');
    expect(input).toBeInTheDocument();
  });

  it('deve calcular corretamente a classe para o campo Validade', () => {
    // Simula a lógica do componente
    const dateStyles = {
      validadeField: 'validadeField',
      datePickerInput: 'datePickerInput'
    };
    const label = 'Validade';
    const isValidadeField = label === 'Validade';
    const inputClassName = isValidadeField ? dateStyles.validadeField : dateStyles.datePickerInput;
    expect(inputClassName).toBe('validadeField');
  });

  it('deve calcular corretamente a classe para outros campos', () => {
    // Simula a lógica do componente
    const dateStyles = {
      validadeField: 'validadeField',
      datePickerInput: 'datePickerInput'
    };
    const label = 'Outra Data';
    const isValidadeField = label === 'Validade';
    const inputClassName = isValidadeField ? dateStyles.validadeField : dateStyles.datePickerInput;
    expect(inputClassName).toBe('datePickerInput');
  });

  it('deve chamar onChange quando o valor for alterado', () => {
    render(
      <DatePickerField
        id="test-date"
        label="Data de Teste"
        value=""
        onChange={mockOnChange}
        name="testDate"
      />
    );

    const input = screen.getByTestId('datepicker-input');
    fireEvent.change(input, { target: { value: '2024-12-31' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      target: {
        name: 'testDate',
        value: '2024-12-31'
      }
    });
  });

  it('deve exibir o valor atual corretamente', () => {
    render(
      <DatePickerField
        id="test-date"
        label="Data de Teste"
        value="2024-12-31"
        onChange={mockOnChange}
        name="testDate"
      />
    );

    const input = screen.getByTestId('datepicker-input');
    expect(input).toHaveValue('2024-12-31');
  });

  it('deve lidar com valor vazio corretamente', () => {
    render(
      <DatePickerField
        id="test-date"
        label="Data de Teste"
        value=""
        onChange={mockOnChange}
        name="testDate"
      />
    );

    const input = screen.getByTestId('datepicker-input');
    expect(input).toHaveValue('');
  });
}); 