import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Home from '../Home';
import { AppProvider } from '../../context/AppContext';
import NotificationModal from '../../components/NotificationModal';
import { useNotificationItems } from '../../components/useNotificationItems';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock do AppContext
jest.mock('../../context/AppContext', () => ({
  AppProvider: ({ children }) => <div data-testid="app-provider">{children}</div>,
  useApp: () => ({
    state: {
      items: [
        { _id: '1', nome: 'Arroz', totalEstoque: 2, unidade: 'kg', limiteEstoque: 5 },
        { _id: '2', nome: 'Leite', totalEstoque: 3, unidade: 'l', dataValidade: '2024-01-15' }
      ],
    },
    fetchItems: jest.fn(),
  }),
}));

// Mock do ItemTable
jest.mock('../../components/ItemTable', () => {
  return function MockItemTable() {
    return <div data-testid="item-table">Item Table</div>;
  };
});

// Mock do ThreeDotsIcon
jest.mock('../../components/ui/ThreeDotsIcon', () => {
  return function MockThreeDotsIcon({ testId, onClick }) {
    return (
      <div 
        data-testid={testId || 'three-dots-icon'} 
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      >
        ⋮
      </div>
    );
  };
});

// Mock do NotificationModal
jest.mock('../../components/NotificationModal', () => {
  return function MockNotificationModal({ lowStockItems, expiredItems, onClose }) {
    return (
      <div data-testid="notification-modal">
        <h2>Modal de Notificação</h2>
        <p>Itens com estoque baixo: {lowStockItems.length}</p>
        <p>Itens com validade próxima: {expiredItems.length}</p>
        <button onClick={onClose}>Fechar</button>
      </div>
    );
  };
});

// Mock do useNotificationItems
jest.mock('../../components/useNotificationItems', () => ({
  useNotificationItems: jest.fn()
}));

const renderHome = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Home />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    // Mock do localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        clear: jest.fn(),
      },
      writable: true,
    });
    
    // Mock do sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        clear: jest.fn(),
      },
      writable: true,
    });
    
    // Configurar mock padrão do useNotificationItems
    useNotificationItems.mockReturnValue({
      lowStockItems: [],
      expiredItems: []
    });
    
    jest.clearAllMocks();
  });

  test('renderiza o título da página', () => {
    renderHome();
    expect(screen.getByText('Controle de Despensa')).toBeInTheDocument();
  });

  test('renderiza o card do logout no canto superior direito', () => {
    renderHome();
    const logoutCard = screen.getByTestId('logout-card');
    
    expect(logoutCard).toBeInTheDocument();
  });

  test('renderiza o ícone de três bolinhas no card', () => {
    renderHome();
    const threeDotsIcon = screen.getByTestId('three-dots-icon');
    
    expect(threeDotsIcon).toBeInTheDocument();
  });

  test('não renderiza os botões inicialmente', () => {
    renderHome();
    
    expect(screen.queryByTestId('register-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('card-buttons')).not.toBeInTheDocument();
  });

  test('renderiza os botões após clicar no ícone de três bolinhas', () => {
    renderHome();
    const threeDotsIcon = screen.getByTestId('three-dots-icon');
    
    fireEvent.click(threeDotsIcon);
    
    const registerButton = screen.getByTestId('register-button');
    const logoutButton = screen.getByTestId('logout-button');
    const cardButtons = screen.getByTestId('card-buttons');
    
    expect(registerButton).toBeInTheDocument();
    expect(registerButton).toHaveTextContent('Cadastrar Usuário');
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveTextContent('Sair');
    expect(cardButtons).toBeInTheDocument();
  });

  test('esconde os botões após clicar novamente no ícone', () => {
    renderHome();
    const threeDotsIcon = screen.getByTestId('three-dots-icon');
    
    // Primeiro clique - mostra os botões
    fireEvent.click(threeDotsIcon);
    expect(screen.getByTestId('register-button')).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    
    // Segundo clique - esconde os botões
    fireEvent.click(threeDotsIcon);
    expect(screen.queryByTestId('register-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
  });

  test('renderiza os botões principais (apenas Adicionar)', () => {
    renderHome();
    expect(screen.getByTestId('add-button')).toBeInTheDocument();
  });

  test('não renderiza o botão Sair na área de botões principais', () => {
    renderHome();
    const formButtons = screen.getByTestId('form-buttons');
    const logoutCard = screen.getByTestId('logout-card');
    
    // Verifica que o card do logout não está dentro da área de botões principais
    expect(formButtons).not.toContainElement(logoutCard);
  });

  test('chama a função de logout quando o botão Sair é clicado', () => {
    renderHome();
    const threeDotsIcon = screen.getByTestId('three-dots-icon');
    
    // Mostra os botões primeiro
    fireEvent.click(threeDotsIcon);
    
    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);
    
    // Verifica se o localStorage e sessionStorage foram limpos
    expect(window.localStorage.clear).toHaveBeenCalled();
    expect(window.sessionStorage.clear).toHaveBeenCalled();
    
    // Verifica se o navigate foi chamado para redirecionar para login
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  test('chama a função de navegação quando Adicionar Novo Item é clicado', () => {
    renderHome();
    const addButton = screen.getByTestId('add-button');
    
    fireEvent.click(addButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/adicionar-item');
  });

  test('chama a função de navegação quando Cadastrar Usuário é clicado', () => {
    renderHome();
    const threeDotsIcon = screen.getByTestId('three-dots-icon');
    
    // Mostra os botões primeiro
    fireEvent.click(threeDotsIcon);
    
    const registerButton = screen.getByTestId('register-button');
    fireEvent.click(registerButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/notification-user-register');
  });

  test('renderiza a tabela de itens', () => {
    renderHome();
    expect(screen.getByTestId('item-table')).toBeInTheDocument();
  });

  test('verifica que o ícone está dentro do card', () => {
    renderHome();
    const logoutCard = screen.getByTestId('logout-card');
    const threeDotsIcon = screen.getByTestId('three-dots-icon');
    
    expect(logoutCard).toContainElement(threeDotsIcon);
  });

  test('verifica que os botões aparecem dentro do card quando visíveis', () => {
    renderHome();
    const logoutCard = screen.getByTestId('logout-card');
    const threeDotsIcon = screen.getByTestId('three-dots-icon');
    
    // Mostra os botões
    fireEvent.click(threeDotsIcon);
    
    const registerButton = screen.getByTestId('register-button');
    const logoutButton = screen.getByTestId('logout-button');
    const cardButtons = screen.getByTestId('card-buttons');
    
    expect(logoutCard).toContainElement(threeDotsIcon);
    expect(logoutCard).toContainElement(registerButton);
    expect(logoutCard).toContainElement(logoutButton);
    expect(logoutCard).toContainElement(cardButtons);
  });
});

describe('Home - Notificações', () => {
  beforeEach(() => {
    // Mock do localStorage para simular usuário autenticado
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    // Mock do sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        clear: jest.fn(),
      },
      writable: true,
    });

    // Mock do setTimeout para controlar o delay das notificações
    jest.useFakeTimers();
    
    // Configurar mock padrão do useNotificationItems
    useNotificationItems.mockReturnValue({
      lowStockItems: [],
      expiredItems: []
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('deve abrir modal de notificação automaticamente quando há itens com problemas', async () => {
    // Mock de itens com problemas
    useNotificationItems.mockReturnValue({
      lowStockItems: [
        { _id: '1', nome: 'Arroz', totalEstoque: 2, unidade: 'kg', limiteEstoque: 5 }
      ],
      expiredItems: []
    });

    renderHome();

    // Aguardar o useEffect ser executado
    await waitFor(() => {
      expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
    });

    expect(screen.getByText('Itens com estoque baixo: 1')).toBeInTheDocument();
    expect(screen.getByText('Itens com validade próxima: 0')).toBeInTheDocument();
  });

  it('deve fechar modal de notificação quando o botão fechar é clicado', async () => {
    // Mock de itens com problemas
    useNotificationItems.mockReturnValue({
      lowStockItems: [
        { _id: '1', nome: 'Arroz', totalEstoque: 2, unidade: 'kg', limiteEstoque: 5 }
      ],
      expiredItems: []
    });

    renderHome();

    // Aguardar o modal aparecer
    await waitFor(() => {
      expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
    });

    // Fechar modal
    fireEvent.click(screen.getByText('Fechar'));

    await waitFor(() => {
      expect(screen.queryByTestId('notification-modal')).not.toBeInTheDocument();
    });
  });

  it('não deve abrir modal automaticamente quando não há itens com problemas', async () => {
    // Mock sem itens com problemas
    useNotificationItems.mockReturnValue({
      lowStockItems: [],
      expiredItems: []
    });

    renderHome();

    // Aguardar um tempo para garantir que o modal não aparece
    await waitFor(() => {
      expect(screen.queryByTestId('notification-modal')).not.toBeInTheDocument();
    });
  });

  it('deve abrir modal quando há itens com validade próxima', async () => {
    // Mock de itens com validade próxima
    useNotificationItems.mockReturnValue({
      lowStockItems: [],
      expiredItems: [
        { _id: '2', nome: 'Leite', totalEstoque: 3, unidade: 'l', dataValidade: '2024-01-15' }
      ]
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
    });

    expect(screen.getByText('Itens com validade próxima: 1')).toBeInTheDocument();
  });

  it('deve abrir modal quando há itens com estoque baixo e validade próxima', async () => {
    // Mock de itens com ambos os problemas
    useNotificationItems.mockReturnValue({
      lowStockItems: [
        { _id: '1', nome: 'Arroz', totalEstoque: 2, unidade: 'kg', limiteEstoque: 5 }
      ],
      expiredItems: [
        { _id: '2', nome: 'Leite', totalEstoque: 3, unidade: 'l', dataValidade: '2024-01-15' }
      ]
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
    });

    expect(screen.getByText('Itens com estoque baixo: 1')).toBeInTheDocument();
    expect(screen.getByText('Itens com validade próxima: 1')).toBeInTheDocument();
  });
}); 