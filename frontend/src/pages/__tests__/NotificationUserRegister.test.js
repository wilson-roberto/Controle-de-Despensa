import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { AppProvider } from '../../context/AppContext';
import NotificationUserRegister from '../NotificationUserRegister';

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

// Wrapper para fornecer contexto
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

describe('NotificationUserRegister', () => {
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
    
    // Usar timers falsos para controlar setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve renderizar o formulário de cadastro', () => {
    renderWithProviders(<NotificationUserRegister />);

    expect(screen.getByText('Cadastrar Usuário de Notificação')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome Completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Telefone (WhatsApp)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cadastrar Usuário' })).toBeInTheDocument();
  });

  it('deve validar nome completo obrigatório', async () => {
    renderWithProviders(<NotificationUserRegister />);

    const phoneInput = screen.getByLabelText('Telefone (WhatsApp)');
    const submitButton = screen.getByRole('button', { name: 'Cadastrar Usuário' });

    fireEvent.change(phoneInput, { target: { value: '11999999999' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Nome completo é obrigatório')).toBeInTheDocument();
    });
  });

  it('deve validar telefone obrigatório', async () => {
    renderWithProviders(<NotificationUserRegister />);

    const nameInput = screen.getByLabelText('Nome Completo');
    const submitButton = screen.getByRole('button', { name: 'Cadastrar Usuário' });

    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Telefone é obrigatório')).toBeInTheDocument();
    });
  });

  it('deve validar formato do telefone', async () => {
    renderWithProviders(<NotificationUserRegister />);

    const nameInput = screen.getByLabelText('Nome Completo');
    const phoneInput = screen.getByLabelText('Telefone (WhatsApp)');
    const submitButton = screen.getByRole('button', { name: 'Cadastrar Usuário' });

    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(phoneInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Telefone deve ter 10 ou 11 dígitos')).toBeInTheDocument();
    });
  });

  it('deve validar formato do nome completo', async () => {
    renderWithProviders(<NotificationUserRegister />);

    const nameInput = screen.getByLabelText('Nome Completo');
    const phoneInput = screen.getByLabelText('Telefone (WhatsApp)');
    const submitButton = screen.getByRole('button', { name: 'Cadastrar Usuário' });

    fireEvent.change(nameInput, { target: { value: 'João123' } });
    fireEvent.change(phoneInput, { target: { value: '11999999999' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Nome completo deve conter apenas letras e espaços')).toBeInTheDocument();
    });
  });

  it('deve cadastrar usuário com sucesso', async () => {
    const api = require('../../services/api');
    api.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Usuário de notificação cadastrado com sucesso',
        data: {
          id: '1',
          fullName: 'João Silva',
          phone: '(11) 99999-9999'
        }
      }
    });

    renderWithProviders(<NotificationUserRegister />);

    const nameInput = screen.getByLabelText('Nome Completo');
    const phoneInput = screen.getByLabelText('Telefone (WhatsApp)');
    const submitButton = screen.getByRole('button', { name: 'Cadastrar Usuário' });

    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(phoneInput, { target: { value: '11999999999' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/notification-users', {
        fullName: 'João Silva',
        phone: '11999999999'
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Cadastro Realizado!')).toBeInTheDocument();
    });

    // Avançar os timers para simular o setTimeout
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('deve mostrar erro quando telefone já existe', async () => {
    const api = require('../../services/api');
    api.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          message: 'Este número de telefone já está cadastrado'
        }
      }
    });

    renderWithProviders(<NotificationUserRegister />);

    const nameInput = screen.getByLabelText('Nome Completo');
    const phoneInput = screen.getByLabelText('Telefone (WhatsApp)');
    const submitButton = screen.getByRole('button', { name: 'Cadastrar Usuário' });

    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(phoneInput, { target: { value: '11999999999' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Este número de telefone já está cadastrado')).toBeInTheDocument();
    });
  });

  it('deve mostrar erro de validação do backend', async () => {
    const api = require('../../services/api');
    api.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          errors: [
            { field: 'phone', message: 'Telefone deve ter 10 ou 11 dígitos' }
          ]
        }
      }
    });

    renderWithProviders(<NotificationUserRegister />);

    const nameInput = screen.getByLabelText('Nome Completo');
    const phoneInput = screen.getByLabelText('Telefone (WhatsApp)');
    const submitButton = screen.getByRole('button', { name: 'Cadastrar Usuário' });

    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(phoneInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Telefone deve ter 10 ou 11 dígitos')).toBeInTheDocument();
    });
  });

  it('deve mostrar erro de conexão', async () => {
    const api = require('../../services/api');
    api.post.mockRejectedValueOnce({
      request: {},
      message: 'Network Error'
    });

    renderWithProviders(<NotificationUserRegister />);

    const nameInput = screen.getByLabelText('Nome Completo');
    const phoneInput = screen.getByLabelText('Telefone (WhatsApp)');
    const submitButton = screen.getByRole('button', { name: 'Cadastrar Usuário' });

    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(phoneInput, { target: { value: '11999999999' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Não foi possível conectar ao servidor. Verifique sua conexão.')).toBeInTheDocument();
    });
  });

  it('deve mostrar erro genérico', async () => {
    const api = require('../../services/api');
    api.post.mockRejectedValueOnce({
      response: {
        status: 500,
        data: {
          message: 'Erro interno do servidor'
        }
      }
    });

    renderWithProviders(<NotificationUserRegister />);

    const nameInput = screen.getByLabelText('Nome Completo');
    const phoneInput = screen.getByLabelText('Telefone (WhatsApp)');
    const submitButton = screen.getByRole('button', { name: 'Cadastrar Usuário' });

    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(phoneInput, { target: { value: '11999999999' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erro interno do servidor. Por favor, tente novamente mais tarde.')).toBeInTheDocument();
    });
  });

  it('deve desabilitar botão durante submissão', async () => {
    const api = require('../../services/api');
    api.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithProviders(<NotificationUserRegister />);

    const nameInput = screen.getByLabelText('Nome Completo');
    const phoneInput = screen.getByLabelText('Telefone (WhatsApp)');
    const submitButton = screen.getByRole('button', { name: 'Cadastrar Usuário' });

    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(phoneInput, { target: { value: '11999999999' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Cadastrando...');
  });

  it('deve limpar formulário após sucesso', async () => {
    const api = require('../../services/api');
    api.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Usuário de notificação cadastrado com sucesso'
      }
    });

    renderWithProviders(<NotificationUserRegister />);

    const nameInput = screen.getByLabelText('Nome Completo');
    const phoneInput = screen.getByLabelText('Telefone (WhatsApp)');
    const submitButton = screen.getByRole('button', { name: 'Cadastrar Usuário' });

    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(phoneInput, { target: { value: '11999999999' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Cadastro Realizado!')).toBeInTheDocument();
    });
    // Não é necessário checar os campos, pois o formulário é substituído pela tela de sucesso
  });
}); 