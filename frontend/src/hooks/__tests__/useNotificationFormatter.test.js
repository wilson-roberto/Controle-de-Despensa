import { renderHook } from '@testing-library/react';
import useNotificationFormatter from '../useNotificationFormatter';

describe('useNotificationFormatter', () => {
  // Teste 1: Formatação de data
  test('deve formatar data corretamente', () => {
    const { result } = renderHook(() => useNotificationFormatter());
    const formattedDate = result.current.formatDate('2024-03-15');
    expect(formattedDate).toBe('15/03/2024');
  });

  // Teste 2: Data inválida
  test('deve retornar mensagem para data inválida', () => {
    const { result } = renderHook(() => useNotificationFormatter());
    const formattedDate = result.current.formatDate(null);
    expect(formattedDate).toBe('Data não informada');
  });

  // Teste 3: Status de validade - vencido
  test('deve retornar status correto para item vencido', () => {
    const { result } = renderHook(() => useNotificationFormatter());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const status = result.current.getValidityStatus(yesterday.toISOString());
    expect(status).toBe('Vencido');
  });

  // Teste 4: Status de validade - vence em breve
  test('deve retornar status correto para item que vence em breve', () => {
    const { result } = renderHook(() => useNotificationFormatter());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const status = result.current.getValidityStatus(tomorrow.toISOString());
    expect(status).toBe('Vence em breve');
  });

  // Teste 5: Status de validade - vence em um mês
  test('deve retornar status correto para item que vence em um mês', () => {
    const { result } = renderHook(() => useNotificationFormatter());
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 15);
    const status = result.current.getValidityStatus(nextMonth.toISOString());
    expect(status).toBe('Vence em um mês');
  });

  // Teste 6: Status de validade - válido
  test('deve retornar status correto para item válido', () => {
    const { result } = renderHook(() => useNotificationFormatter());
    const farFuture = new Date();
    farFuture.setDate(farFuture.getDate() + 60);
    const status = result.current.getValidityStatus(farFuture.toISOString());
    expect(status).toBe('Válido');
  });

  // Teste 7: Classe CSS para status
  test('deve retornar classe CSS correta para cada status', () => {
    const { result } = renderHook(() => useNotificationFormatter());
    expect(result.current.getStatusClass('Vencido')).toBe('status-expired');
    expect(result.current.getStatusClass('Vence em breve')).toBe('status-warning');
    expect(result.current.getStatusClass('Vence em um mês')).toBe('status-info');
    expect(result.current.getStatusClass('Válido')).toBe('status-valid');
  });

  // Teste 8: Formatação de número de WhatsApp
  test('deve formatar número de WhatsApp corretamente', () => {
    const { result } = renderHook(() => useNotificationFormatter());
    const formattedNumber = result.current.formatWhatsAppNumber('11999999999');
    expect(formattedNumber).toBe('(11) 99999-9999');
  });

  // Teste 9: Número de WhatsApp inválido
  test('deve retornar mensagem para número de WhatsApp inválido', () => {
    const { result } = renderHook(() => useNotificationFormatter());
    const formattedNumber = result.current.formatWhatsAppNumber(null);
    expect(formattedNumber).toBe('Número não informado');
  });

  // Teste 10: Memoização
  test('deve manter a referência das funções entre renderizações', () => {
    const { result, rerender } = renderHook(() => useNotificationFormatter());
    const firstResult = result.current;
    
    rerender();
    
    expect(result.current.formatDate).toBe(firstResult.formatDate);
    expect(result.current.getValidityStatus).toBe(firstResult.getValidityStatus);
    expect(result.current.getStatusClass).toBe(firstResult.getStatusClass);
    expect(result.current.formatWhatsAppNumber).toBe(firstResult.formatWhatsAppNumber);
  });
}); 