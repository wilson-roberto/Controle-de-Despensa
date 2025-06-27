import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Register from '../Register';

// Mock do módulo de API
jest.mock('../../services/api', () => ({
  post: jest.fn()
}));

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Mock do AuthContext
const mockLogin = jest.fn();
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin
  }),
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>
}));

// Importar o mock da API
const api = require('../../services/api');

const renderRegister = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização', () => {
    it('should render register form with all fields', () => {
      renderRegister();
      
      expect(screen.getByLabelText('Nome de Usuário')).toBeInTheDocument();
      expect(screen.getByLabelText('Senha')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Registrar' })).toBeInTheDocument();
      expect(screen.getByText('Já tem uma conta?')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Faça login' })).toBeInTheDocument();
    });

    it('should render title correctly', () => {
      renderRegister();
      expect(screen.getByText('Registro')).toBeInTheDocument();
    });

    it('should have correct input attributes', () => {
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      const passwordInput = screen.getByLabelText('Senha');
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      
      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(usernameInput).toHaveAttribute('autocomplete', 'off');
      expect(usernameInput).toHaveAttribute('autocorrect', 'off');
      expect(usernameInput).toHaveAttribute('autocapitalize', 'off');
      expect(usernameInput).toHaveAttribute('spellcheck', 'false');
      
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('autocomplete', 'new-password');
      
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('autocomplete', 'new-password');
    });
  });

  describe('Validação de Username', () => {
    it('should validate username with spaces', async () => {
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      
      fireEvent.change(usernameInput, { target: { value: 'test user' } });
      fireEvent.blur(usernameInput);
      
      await waitFor(() => {
        expect(screen.getByText('Nome de usuário não pode conter espaços')).toBeInTheDocument();
      });
    });

    it('should validate username too short', async () => {
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      
      fireEvent.change(usernameInput, { target: { value: 'ab' } });
      fireEvent.blur(usernameInput);
      
      await waitFor(() => {
        expect(screen.getByText('Nome de usuário deve ter no mínimo 3 caracteres')).toBeInTheDocument();
      });
    });

    it('should validate username too long', async () => {
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      
      fireEvent.change(usernameInput, { target: { value: 'a'.repeat(31) } });
      fireEvent.blur(usernameInput);
      
      await waitFor(() => {
        expect(screen.getByText('Nome de usuário deve ter no máximo 30 caracteres')).toBeInTheDocument();
      });
    });

    it('should validate username with invalid characters', async () => {
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      
      fireEvent.change(usernameInput, { target: { value: 'test@user' } });
      fireEvent.blur(usernameInput);
      
      await waitFor(() => {
        expect(screen.getByText('Nome de usuário deve conter apenas letras, números, underscore (_) ou hífen (-)')).toBeInTheDocument();
      });
    });

    it('should accept valid username', async () => {
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      
      fireEvent.change(usernameInput, { target: { value: 'test_user123' } });
      fireEvent.blur(usernameInput);
      
      await waitFor(() => {
        expect(screen.queryByText(/Nome de usuário/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Validação de Senha', () => {
    it('should validate password too short', async () => {
      renderRegister();
      
      const passwordInput = screen.getByLabelText('Senha');
      
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.getByText('Senha deve ter no mínimo 8 caracteres')).toBeInTheDocument();
      });
    });

    it('should validate password with spaces', async () => {
      renderRegister();
      
      const passwordInput = screen.getByLabelText('Senha');
      
      fireEvent.change(passwordInput, { target: { value: 'password 123' } });
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.getByText('Senha não pode conter espaços')).toBeInTheDocument();
      });
    });

    it('should validate password without letters', async () => {
      renderRegister();
      
      const passwordInput = screen.getByLabelText('Senha');
      
      fireEvent.change(passwordInput, { target: { value: '12345678' } });
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.getByText('Senha deve conter pelo menos uma letra')).toBeInTheDocument();
      });
    });

    it('should validate password without numbers', async () => {
      renderRegister();
      
      const passwordInput = screen.getByLabelText('Senha');
      
      fireEvent.change(passwordInput, { target: { value: 'password' } });
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.getByText('Senha deve conter pelo menos um número')).toBeInTheDocument();
      });
    });

    it('should accept valid password', async () => {
      renderRegister();
      
      const passwordInput = screen.getByLabelText('Senha');
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.queryByText(/Senha deve/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Validação de Confirmação de Senha', () => {
    it('should validate password confirmation mismatch', async () => {
      renderRegister();
      
      const passwordInput = screen.getByLabelText('Senha');
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
      fireEvent.blur(confirmPasswordInput);
      
      await waitFor(() => {
        expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
      });
    });

    it('should validate empty password confirmation', async () => {
      renderRegister();
      
      const passwordInput = screen.getByLabelText('Senha');
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: '' } });
      fireEvent.blur(confirmPasswordInput);
      
      await waitFor(() => {
        expect(screen.getByText('Confirmação de senha é obrigatória')).toBeInTheDocument();
      });
    });

    it('should accept matching passwords', async () => {
      renderRegister();
      
      const passwordInput = screen.getByLabelText('Senha');
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.blur(confirmPasswordInput);
      
      await waitFor(() => {
        expect(screen.queryByText(/As senhas não coincidem/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Funcionalidades de Senha', () => {
    it('should toggle password visibility', () => {
      renderRegister();
      
      const passwordInput = screen.getByLabelText('Senha');
      const toggleButton = screen.getAllByRole('button')[0]; // Primeiro botão é o toggle da senha
      
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should toggle confirm password visibility', () => {
      renderRegister();
      
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      const toggleButton = screen.getAllByRole('button')[1]; // Segundo botão é o toggle da confirmação
      
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      
      fireEvent.click(toggleButton);
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');
      
      fireEvent.click(toggleButton);
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Submissão do Formulário', () => {
    it('should register user successfully', async () => {
      const mockResponse = {
        data: {
          message: 'Usuário registrado com sucesso',
          token: 'mock-token',
          user: {
            id: '123',
            username: 'testuser',
            createdAt: new Date().toISOString()
          }
        }
      };
      
      api.post.mockResolvedValue(mockResponse);
      
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      const passwordInput = screen.getByLabelText('Senha');
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      const submitButton = screen.getByRole('button', { name: 'Registrar' });
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/register', {
          username: 'testuser',
          password: 'password123'
        });
      });
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('mock-token');
      });
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      });
    });

    it('should handle registration error', async () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            message: 'Nome de usuário já existe'
          }
        }
      };
      
      api.post.mockRejectedValue(mockError);
      
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      const passwordInput = screen.getByLabelText('Senha');
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      const submitButton = screen.getByRole('button', { name: 'Registrar' });
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Nome de usuário já existe')).toBeInTheDocument();
      });
    });

    it('should handle network error', async () => {
      const mockError = {
        request: {}
      };
      
      api.post.mockRejectedValue(mockError);
      
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      const passwordInput = screen.getByLabelText('Senha');
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      const submitButton = screen.getByRole('button', { name: 'Registrar' });
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Não foi possível conectar ao servidor. Verifique sua conexão.')).toBeInTheDocument();
      });
    });

    it('should handle server error', async () => {
      const mockError = {
        response: {
          status: 500,
          data: {
            message: 'Erro interno do servidor'
          }
        }
      };
      
      api.post.mockRejectedValue(mockError);
      
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      const passwordInput = screen.getByLabelText('Senha');
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      const submitButton = screen.getByRole('button', { name: 'Registrar' });
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Erro interno do servidor. Por favor, tente novamente mais tarde.')).toBeInTheDocument();
      });
    });

    it('should handle backend validation errors', async () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            errors: [
              { field: 'username', message: 'Nome de usuário já existe' },
              { field: 'password', message: 'Senha muito fraca' }
            ]
          }
        }
      };
      
      api.post.mockRejectedValue(mockError);
      
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      const passwordInput = screen.getByLabelText('Senha');
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      const submitButton = screen.getByRole('button', { name: 'Registrar' });
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Nome de usuário já existe')).toBeInTheDocument();
      });
      
      await waitFor(() => {
        expect(screen.getByText('Senha muito fraca')).toBeInTheDocument();
      });
    });

    it('should prevent multiple submissions', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token'
        }
      };
      
      api.post.mockResolvedValue(mockResponse);
      
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      const passwordInput = screen.getByLabelText('Senha');
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      const submitButton = screen.getByRole('button', { name: 'Registrar' });
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      fireEvent.click(submitButton);
      fireEvent.click(submitButton); // Segunda tentativa
      
      expect(api.post).toHaveBeenCalledTimes(1);
    });

    it('should show loading state during submission', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token'
        }
      };
      
      api.post.mockResolvedValue(mockResponse);
      
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      const passwordInput = screen.getByLabelText('Senha');
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      const submitButton = screen.getByRole('button', { name: 'Registrar' });
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      fireEvent.click(submitButton);
      
      expect(screen.getByText('Registrando...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Validação de Formulário Completo', () => {
    it('should validate all fields before submission', async () => {
      renderRegister();
      
      const submitButton = screen.getByRole('button', { name: 'Registrar' });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Nome de usuário é obrigatório')).toBeInTheDocument();
      });
      
      await waitFor(() => {
        expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
      });
      
      await waitFor(() => {
        expect(screen.getByText('Confirmação de senha é obrigatória')).toBeInTheDocument();
      });
    });

    it('should trim username before submission', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token'
        }
      };
      
      api.post.mockResolvedValue(mockResponse);
      
      renderRegister();
      
      const usernameInput = screen.getByLabelText('Nome de Usuário');
      const passwordInput = screen.getByLabelText('Senha');
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      const submitButton = screen.getByRole('button', { name: 'Registrar' });
      
      fireEvent.change(usernameInput, { target: { value: '  testuser  ' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/register', {
          username: 'testuser',
          password: 'password123'
        });
      });
    });
  });
}); 