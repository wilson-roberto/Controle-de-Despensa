import { renderHook } from '@testing-library/react';
import useNotificationFormatter from '../useNotificationFormatter';

describe('useNotificationFormatter', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const { result } = renderHook(() => useNotificationFormatter());
      const date = '2023-12-25T10:30:00.000Z';
      const formattedDate = result.current.formatDate(date);
      expect(formattedDate).toBe('25/12/2023');
    });

    it('should return "Data não informada" for null date', () => {
      const { result } = renderHook(() => useNotificationFormatter());
      const formattedDate = result.current.formatDate(null);
      expect(formattedDate).toBe('Data não informada');
    });

    it('should return "Data não informada" for empty string', () => {
      const { result } = renderHook(() => useNotificationFormatter());
      const formattedDate = result.current.formatDate('');
      expect(formattedDate).toBe('Data não informada');
    });
  });

  describe('getValidityStatus', () => {
    it('should return "Vencido" for expired date', () => {
      const { result } = renderHook(() => useNotificationFormatter());
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const status = result.current.getValidityStatus(yesterday.toISOString());
      expect(status).toBe('Vencido');
    });

    it('should return "Vence em breve" for date within 15 days', () => {
      const { result } = renderHook(() => useNotificationFormatter());
      const in15Days = new Date();
      in15Days.setDate(in15Days.getDate() + 15);
      const status = result.current.getValidityStatus(in15Days.toISOString());
      expect(status).toBe('Vence em breve');
    });

    it('should return "Vence em um mês" for date within 30 days', () => {
      const { result } = renderHook(() => useNotificationFormatter());
      const in30Days = new Date();
      in30Days.setDate(in30Days.getDate() + 30);
      const status = result.current.getValidityStatus(in30Days.toISOString());
      expect(status).toBe('Vence em um mês');
    });

    it('should return "Válido" for date more than 30 days away', () => {
      const { result } = renderHook(() => useNotificationFormatter());
      const in2Months = new Date();
      in2Months.setDate(in2Months.getDate() + 60);
      const status = result.current.getValidityStatus(in2Months.toISOString());
      expect(status).toBe('Válido');
    });

    it('should return "Data não informada" for null date', () => {
      const { result } = renderHook(() => useNotificationFormatter());
      const status = result.current.getValidityStatus(null);
      expect(status).toBe('Data não informada');
    });
  });

  describe('getStatusClass', () => {
    it('should return correct CSS class for each status', () => {
      const { result } = renderHook(() => useNotificationFormatter());
      expect(result.current.getStatusClass('Vencido')).toBe('status-expired');
      expect(result.current.getStatusClass('Vence em breve')).toBe('status-warning');
      expect(result.current.getStatusClass('Vence em um mês')).toBe('status-info');
      expect(result.current.getStatusClass('Válido')).toBe('status-valid');
      expect(result.current.getStatusClass('Unknown')).toBe('status-valid');
    });
  });

  it('should return consistent function behavior across renders', () => {
    const firstResult = renderHook(() => useNotificationFormatter()).result;
    const secondResult = renderHook(() => useNotificationFormatter()).result;
    
    // Test that functions return the same results
    const testDate = '2023-12-25T10:30:00.000Z';
    expect(firstResult.current.formatDate(testDate)).toBe(secondResult.current.formatDate(testDate));
    expect(firstResult.current.getValidityStatus(testDate)).toBe(secondResult.current.getValidityStatus(testDate));
    expect(firstResult.current.getStatusClass('Vencido')).toBe(secondResult.current.getStatusClass('Vencido'));
  });
}); 