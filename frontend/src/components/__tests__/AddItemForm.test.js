import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../../context/AppContext';
import { AuthProvider } from '../../context/AuthContext';
import AddItemForm from '../AddItemForm';

// Mock da API
jest.mock('../../services/api', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          {component}
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AddItemForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage com token válido
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  it('should render form fields correctly', () => {
    renderWithProviders(<AddItemForm onCancel={jest.fn()} />);
    
    expect(screen.getByLabelText(/item/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/unidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/entrada/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/saída/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Estoque', { selector: 'input#totalEstoque' })).toBeInTheDocument();
    expect(screen.getByLabelText(/validade/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Limite de Estoque', { selector: 'input#limiteEstoque' })).toBeInTheDocument();
  });

  it('should show "Adicionar" button when not editing', () => {
    renderWithProviders(<AddItemForm onCancel={jest.fn()} />);
    
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    expect(addButton).toBeInTheDocument();
    expect(addButton).not.toBeDisabled();
  });

  it('should validate required fields', async () => {
    renderWithProviders(<AddItemForm onCancel={jest.fn()} />);
    
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText(/o nome do item é obrigatório/i)).toBeInTheDocument();
    });
  });

  it('should calculate totalEstoque correctly', () => {
    renderWithProviders(<AddItemForm onCancel={jest.fn()} />);
    
    const entradaInput = screen.getByLabelText(/entrada/i);
    const saidaInput = screen.getByLabelText(/saída/i);
    const estoqueInput = screen.getByLabelText('Estoque', { selector: 'input#totalEstoque' });
    
    fireEvent.change(entradaInput, { target: { value: '10' } });
    fireEvent.change(saidaInput, { target: { value: '3' } });
    
    expect(estoqueInput.value).toBe('7');
  });

  it('should handle form submission with valid data', async () => {
    const mockOnCancel = jest.fn();
    
    // Mock da resposta da API
    const api = require('../../services/api');
    api.post.mockResolvedValue({
      data: {
        _id: '1',
        nome: 'Arroz',
        unidade: 'Kg',
        quantidadeEntrada: 10,
        quantidadeSaida: 0,
        totalEstoque: 10
      }
    });
    
    renderWithProviders(<AddItemForm onCancel={mockOnCancel} />);
    
    // Preencher campos obrigatórios
    fireEvent.change(screen.getByLabelText(/item/i), { target: { value: 'Arroz' } });
    fireEvent.change(screen.getByLabelText(/unidade/i), { target: { value: 'Kg' } });
    
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    fireEvent.click(addButton);
    
    // Verificar se a API foi chamada
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/items', expect.objectContaining({
        nome: 'Arroz',
        unidade: 'Kg'
      }));
    });
  });

  it('should show error message for duplicate item name', async () => {
    const mockOnCancel = jest.fn();
    
    // Mock da resposta da API com erro
    const api = require('../../services/api');
    api.post.mockRejectedValue({
      response: {
        data: {
          message: 'Já existe um item com este nome'
        }
      }
    });
    
    renderWithProviders(<AddItemForm onCancel={mockOnCancel} />);
    
    // Preencher com nome duplicado
    fireEvent.change(screen.getByLabelText(/item/i), { target: { value: 'Arroz' } });
    fireEvent.change(screen.getByLabelText(/unidade/i), { target: { value: 'Kg' } });
    
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    fireEvent.click(addButton);
    
    // Verificar se a mensagem de erro aparece
    await waitFor(() => {
      expect(screen.getByText(/já existe um item com este nome/i)).toBeInTheDocument();
    });
  });

  it('should disable submit button while submitting', async () => {
    const mockOnCancel = jest.fn();
    
    // Mock da resposta da API com delay
    const api = require('../../services/api');
    api.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    renderWithProviders(<AddItemForm onCancel={mockOnCancel} />);
    
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    
    // Preencher campos obrigatórios
    fireEvent.change(screen.getByLabelText(/item/i), { target: { value: 'Arroz' } });
    fireEvent.change(screen.getByLabelText(/unidade/i), { target: { value: 'Kg' } });
    
    fireEvent.click(addButton);
    
    // O botão deve estar desabilitado durante o processo
    expect(addButton).toBeDisabled();
    expect(addButton).toHaveTextContent('Processando...');
  });
}); 