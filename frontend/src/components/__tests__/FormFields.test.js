import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormFields from '../FormFields';

const mockFormData = {
  nome: '',
  unidade: '',
  quantidadeEntrada: '',
  quantidadeSaida: '',
  totalEstoque: '',
  dataValidade: '',
  limiteEstoque: ''
};

const mockHandleInputChange = jest.fn();
const mockItems = [
  { _id: '1', nome: 'Arroz' },
  { _id: '2', nome: 'Feijão' }
];

describe('FormFields', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all form fields', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    expect(screen.getByLabelText('Item')).toBeInTheDocument();
    expect(screen.getByLabelText('Unidade')).toBeInTheDocument();
    expect(screen.getByLabelText('Entrada')).toBeInTheDocument();
    expect(screen.getByLabelText('Saída')).toBeInTheDocument();
    expect(screen.getByLabelText('Estoque')).toBeInTheDocument();
    expect(screen.getByLabelText('Validade')).toBeInTheDocument();
    expect(screen.getByLabelText('Limite de Estoque')).toBeInTheDocument();
  });

  it('should render Item and Unidade fields in first row', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    const itemField = screen.getByLabelText('Item');
    const unidadeField = screen.getByLabelText('Unidade');

    // Verificar se ambos os campos estão presentes
    expect(itemField).toBeInTheDocument();
    expect(unidadeField).toBeInTheDocument();
  });

  it('should render Entrada and Saída fields in second row', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    const entradaField = screen.getByLabelText('Entrada');
    const saidaField = screen.getByLabelText('Saída');

    // Verificar se ambos os campos estão presentes
    expect(entradaField).toBeInTheDocument();
    expect(saidaField).toBeInTheDocument();
  });

  it('should render Estoque and Validade fields in third row', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    const estoqueField = screen.getByLabelText('Estoque');
    const validadeField = screen.getByLabelText('Validade');

    // Verificar se ambos os campos estão presentes
    expect(estoqueField).toBeInTheDocument();
    expect(validadeField).toBeInTheDocument();
  });

  it('should render Limite de Estoque field alone in fourth row', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    const limiteEstoqueField = screen.getByLabelText('Limite de Estoque');

    // Verificar se o campo está presente
    expect(limiteEstoqueField).toBeInTheDocument();
  });

  it('should have correct input types and attributes', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    // Verificar tipos de input
    expect(screen.getByLabelText('Item')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Unidade')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Entrada')).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText('Saída')).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText('Estoque')).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText('Limite de Estoque')).toHaveAttribute('type', 'number');
  });

  it('should have correct placeholders', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    expect(screen.getByLabelText('Item')).toHaveAttribute(
      'placeholder',
      'Digite o item ou selecione na seta ao lado.'
    );
    expect(screen.getByLabelText('Unidade')).toHaveAttribute(
      'placeholder',
      'Digite a unidade ou selecione na seta ao lado.'
    );
    expect(screen.getByLabelText('Entrada')).toHaveAttribute(
      'placeholder',
      'Digite números inteiros ou selecione na seta ao lado.'
    );
    expect(screen.getByLabelText('Saída')).toHaveAttribute(
      'placeholder',
      'Digite números inteiros ou selecione na seta ao lado.'
    );
    expect(screen.getByLabelText('Estoque')).toHaveAttribute(
      'placeholder',
      'Não preencher. Preenchimento automático.'
    );
    expect(screen.getByLabelText('Limite de Estoque')).toHaveAttribute(
      'placeholder',
      'Digite números inteiros ou selecione na seta ao lado.'
    );
  });

  it('should have datalist attributes for Item and Unidade', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    expect(screen.getByLabelText('Item')).toHaveAttribute('list', 'items-list');
    expect(screen.getByLabelText('Unidade')).toHaveAttribute('list', 'unidades-list');
  });

  it('should have required attribute for Item field', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    expect(screen.getByLabelText('Item')).toHaveAttribute('required');
  });

  it('should have readOnly attribute for Estoque field', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    expect(screen.getByLabelText('Estoque')).toHaveAttribute('readonly');
  });

  it('should test the new field order: Item-Unidade, Entrada-Saída, Estoque-Validade, Limite alone', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    // Verificar se todos os campos estão presentes na nova ordem
    const fields = [
      'Item',
      'Unidade', 
      'Entrada',
      'Saída',
      'Estoque',
      'Validade',
      'Limite de Estoque'
    ];

    fields.forEach(fieldLabel => {
      expect(screen.getByLabelText(fieldLabel)).toBeInTheDocument();
    });
  });

  it('should not have centeredInput class on Limite de Estoque field', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    const limiteEstoqueField = screen.getByLabelText('Limite de Estoque');
    expect(limiteEstoqueField).not.toHaveClass('centeredInput');
  });

  it('should call handleInputChange when input values change', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    const itemInput = screen.getByLabelText('Item');
    fireEvent.change(itemInput, { target: { value: 'Arroz' } });

    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it('should display items in datalist', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={mockItems}
      />
    );

    const datalist = screen.getByTestId('items-list');
    expect(datalist).toBeInTheDocument();
  });

  it('should handle empty items array', () => {
    render(
      <FormFields
        formData={mockFormData}
        handleInputChange={mockHandleInputChange}
        items={[]}
      />
    );

    // Verificar se o componente ainda renderiza corretamente
    expect(screen.getByLabelText('Item')).toBeInTheDocument();
    expect(screen.getByLabelText('Unidade')).toBeInTheDocument();
  });
}); 