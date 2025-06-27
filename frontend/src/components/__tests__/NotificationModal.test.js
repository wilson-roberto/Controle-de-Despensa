import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationModal from '../NotificationModal';
import WhatsAppService from '../../services/whatsappService';

// Mock do WhatsAppService
jest.mock('../../services/whatsappService');

// Mock do window.alert
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('NotificationModal', () => {
  const mockOnClose = jest.fn();
  
  const mockLowStockItems = [
    {
      _id: '1',
      nome: 'Arroz',
      totalEstoque: 2,
      unidade: 'kg',
      limiteEstoque: 5,
      whatsapp: '11999999999'
    },
    {
      _id: '2',
      nome: 'Feijão',
      totalEstoque: 1,
      unidade: 'kg',
      limiteEstoque: 3,
      whatsapp: '11888888888'
    }
  ];

  const mockExpiredItems = [
    {
      _id: '3',
      nome: 'Leite',
      totalEstoque: 3,
      unidade: 'l',
      dataValidade: '2024-01-15',
      whatsapp: '11777777777'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock da função window.open
    Object.defineProperty(window, 'open', {
      value: jest.fn(),
      writable: true
    });
  });

  afterAll(() => {
    mockAlert.mockRestore();
  });

  it('deve renderizar o modal com título correto para estoque baixo', () => {
    render(
      <NotificationModal
        lowStockItems={mockLowStockItems}
        expiredItems={[]}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('🚨 Estoque Baixo e Validade Próxima/Vencida')).toBeInTheDocument();
    expect(screen.getByText(/2.*itens precisam.*de atenção/)).toBeInTheDocument();
    expect(screen.getByText('Estoque Baixo')).toBeInTheDocument();
  });

  it('deve renderizar o modal com título correto para validade próxima', () => {
    render(
      <NotificationModal
        lowStockItems={[]}
        expiredItems={mockExpiredItems}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('🚨 Estoque Baixo e Validade Próxima/Vencida')).toBeInTheDocument();
    expect(screen.getByText(/1.*item precisa.*de atenção/)).toBeInTheDocument();
    expect(screen.getByText('Validade Próxima/Vencida')).toBeInTheDocument();
  });

  it('deve renderizar o modal com título correto para ambos os problemas', () => {
    render(
      <NotificationModal
        lowStockItems={mockLowStockItems}
        expiredItems={mockExpiredItems}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('🚨 Estoque Baixo e Validade Próxima/Vencida')).toBeInTheDocument();
    expect(screen.getByText(/3.*itens precisam.*de atenção/)).toBeInTheDocument();
  });

  it('deve renderizar todos os itens com problemas', () => {
    render(
      <NotificationModal
        lowStockItems={mockLowStockItems}
        expiredItems={mockExpiredItems}
        onClose={mockOnClose}
      />
    );

    // Verificar se todos os itens estão sendo exibidos
    expect(screen.getByText('Arroz')).toBeInTheDocument();
    expect(screen.getByText('Feijão')).toBeInTheDocument();
    expect(screen.getByText('Leite')).toBeInTheDocument();
  });

  it('deve renderizar botão para enviar alertas', () => {
    render(
      <NotificationModal
        lowStockItems={mockLowStockItems}
        expiredItems={mockExpiredItems}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Enviar Alertas')).toBeInTheDocument();
  });

  it('deve chamar WhatsAppService ao enviar alertas', async () => {
    WhatsAppService.sendNotificationToAllUsers.mockResolvedValue({
      success: true,
      message: 'Notificações enviadas com sucesso'
    });

    render(
      <NotificationModal
        lowStockItems={mockLowStockItems}
        expiredItems={mockExpiredItems}
        onClose={mockOnClose}
      />
    );

    const button = screen.getByText('Enviar Alertas');
    fireEvent.click(button);

    await waitFor(() => {
      expect(WhatsAppService.sendNotificationToAllUsers).toHaveBeenCalledWith('all');
    });
  });

  it('deve mostrar alerta de sucesso quando notificações são enviadas', async () => {
    WhatsAppService.sendNotificationToAllUsers.mockResolvedValue({
      success: true,
      message: 'Notificações enviadas com sucesso'
    });

    render(
      <NotificationModal
        lowStockItems={mockLowStockItems}
        expiredItems={mockExpiredItems}
        onClose={mockOnClose}
      />
    );

    const button = screen.getByText('Enviar Alertas');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Notificações enviadas: Notificações enviadas com sucesso');
    });
  });

  it('deve mostrar alerta de erro quando falha ao enviar notificações', async () => {
    WhatsAppService.sendNotificationToAllUsers.mockResolvedValue({
      success: false,
      message: 'Erro ao enviar notificações'
    });

    render(
      <NotificationModal
        lowStockItems={mockLowStockItems}
        expiredItems={mockExpiredItems}
        onClose={mockOnClose}
      />
    );

    const button = screen.getByText('Enviar Alertas');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Erro ao enviar notificações: Erro ao enviar notificações');
    });
  });

  it('deve chamar onClose quando o botão de fechar for clicado', () => {
    render(
      <NotificationModal
        lowStockItems={mockLowStockItems}
        expiredItems={mockExpiredItems}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: /fechar/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('deve desabilitar botão durante o envio', async () => {
    WhatsAppService.sendNotificationToAllUsers.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'Sucesso' }), 100))
    );

    render(
      <NotificationModal
        lowStockItems={mockLowStockItems}
        expiredItems={mockExpiredItems}
        onClose={mockOnClose}
      />
    );

    const button = screen.getByText('Enviar Alertas');
    
    // Verificar se o botão está habilitado antes do clique
    expect(button).not.toBeDisabled();
    
    fireEvent.click(button);

    // Verificar se o botão está desabilitado após o clique
    expect(button).toBeDisabled();
    expect(screen.getByText('Enviando...')).toBeInTheDocument();
  });

  it('não deve renderizar o modal quando não há itens com problemas', () => {
    render(
      <NotificationModal
        lowStockItems={[]}
        expiredItems={[]}
        onClose={mockOnClose}
      />
    );

    // Verificar que o modal não está sendo renderizado
    expect(screen.queryByText(/.*itens precisam.*de atenção/)).not.toBeInTheDocument();
    expect(screen.queryByText('Enviar Alertas')).not.toBeInTheDocument();
  });
}); 