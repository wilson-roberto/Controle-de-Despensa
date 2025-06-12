import { renderHook, act } from '@testing-library/react';
import { useNotificationHandler } from '../useNotificationHandler';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

// Mock dos hooks e funções necessárias
jest.mock('../../context/AppContext', () => ({
  useApp: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

// Mock das funções auxiliares
jest.mock('../ItemStatus', () => ({
  isStockLow: jest.fn().mockReturnValue(true),
  isExpired: jest.fn().mockReturnValue(false)
}));

jest.mock('../../utils/formatters', () => ({
  formatWhatsAppForAPI: jest.fn().mockImplementation(phone => phone)
}));

// Mock do alert
global.alert = jest.fn();

describe('useNotificationHandler', () => {
  const mockUpdateItem = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset dos mocks antes de cada teste
    jest.clearAllMocks();
    useApp.mockReturnValue({ updateItem: mockUpdateItem });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('deve redirecionar para a página principal após o envio bem-sucedido de mensagens', async () => {
    // Mock do fetch para simular uma resposta bem-sucedida
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true })
      })
    );

    const notificationItems = [
      {
        _id: '1',
        nome: 'Item Teste',
        whatsapp: '5511999999999',
        totalEstoque: 5,
        limiteEstoque: 10,
        unidade: 'un',
        notificadoEstoque: false,
        notificadoValidade: false
      }
    ];

    const { result } = renderHook(() => useNotificationHandler(notificationItems));

    await act(async () => {
      await result.current.handleSendWhatsApp();
    });

    // Verifica se o redirecionamento foi chamado
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('não deve redirecionar se houver erro no envio das mensagens', async () => {
    // Mock do fetch para simular um erro
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Erro ao enviar mensagem' })
      })
    );

    const notificationItems = [
      {
        _id: '1',
        nome: 'Item Teste',
        whatsapp: '5511999999999',
        totalEstoque: 5,
        limiteEstoque: 10,
        unidade: 'un',
        notificadoEstoque: false,
        notificadoValidade: false
      }
    ];

    const { result } = renderHook(() => useNotificationHandler(notificationItems));

    await act(async () => {
      await result.current.handleSendWhatsApp();
    });

    // Verifica se o redirecionamento NÃO foi chamado
    expect(mockNavigate).not.toHaveBeenCalled();
    // Verifica se o alerta de erro foi chamado
    expect(global.alert).toHaveBeenCalledWith('Erro ao enviar notificações. Por favor, tente novamente.');
  });

  it('não deve fazer nada se não houver itens para notificar', async () => {
    const { result } = renderHook(() => useNotificationHandler([]));

    await act(async () => {
      await result.current.handleSendWhatsApp();
    });

    // Verifica se nenhuma chamada foi feita
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockUpdateItem).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
}); 