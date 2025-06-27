import { render } from '@testing-library/react';
import useNotificationFormatter from '../useNotificationFormatter';

function TestComponent({ onRender }) {
  const hook = useNotificationFormatter();
  onRender && onRender(hook);
  return null;
}

describe('useNotificationFormatter', () => {
  function getHookResult() {
    let hookResult;
    render(<TestComponent onRender={r => { hookResult = r; }} />);
    return hookResult;
  }

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const result = getHookResult();
      const date = '2023-12-25T10:30:00.000Z';
      const formattedDate = result.formatDate(date);
      expect(formattedDate).toBe('25/12/2023');
    });

    it('should return "Data não informada" for null date', () => {
      const result = getHookResult();
      const formattedDate = result.formatDate(null);
      expect(formattedDate).toBe('Data não informada');
    });

    it('should return "Data não informada" for empty string', () => {
      const result = getHookResult();
      const formattedDate = result.formatDate('');
      expect(formattedDate).toBe('Data não informada');
    });
  });

  describe('getValidityStatus', () => {
    it('should return "Vencido" for expired date', () => {
      const result = getHookResult();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const status = result.getValidityStatus(yesterday.toISOString());
      expect(status).toBe('Vencido');
    });

    it('should return "Vence em breve" for date within 15 days', () => {
      const result = getHookResult();
      const in15Days = new Date();
      in15Days.setDate(in15Days.getDate() + 15);
      const status = result.getValidityStatus(in15Days.toISOString());
      expect(status).toBe('Vence em breve');
    });

    it('should return "Vence em um mês" for date within 30 days', () => {
      const result = getHookResult();
      const in30Days = new Date();
      in30Days.setDate(in30Days.getDate() + 30);
      const status = result.getValidityStatus(in30Days.toISOString());
      expect(status).toBe('Vence em um mês');
    });

    it('should return "Válido" for date more than 30 days away', () => {
      const result = getHookResult();
      const in2Months = new Date();
      in2Months.setDate(in2Months.getDate() + 60);
      const status = result.getValidityStatus(in2Months.toISOString());
      expect(status).toBe('Válido');
    });

    it('should return "Data não informada" for null date', () => {
      const result = getHookResult();
      const status = result.getValidityStatus(null);
      expect(status).toBe('Data não informada');
    });
  });

  describe('getStatusClass', () => {
    it('should return correct CSS class for each status', () => {
      const result = getHookResult();
      expect(result.getStatusClass('Vencido')).toBe('status-expired');
      expect(result.getStatusClass('Vence em breve')).toBe('status-warning');
      expect(result.getStatusClass('Vence em um mês')).toBe('status-info');
      expect(result.getStatusClass('Válido')).toBe('status-valid');
      expect(result.getStatusClass('Unknown')).toBe('status-valid');
    });
  });

  it('should return consistent function behavior across renders', () => {
    const firstResult = getHookResult();
    const secondResult = getHookResult();
    
    // Test that functions return the same results
    const testDate = '2023-12-25T10:30:00.000Z';
    expect(firstResult.formatDate(testDate)).toBe(secondResult.formatDate(testDate));
    expect(firstResult.getValidityStatus(testDate)).toBe(secondResult.getValidityStatus(testDate));
    expect(firstResult.getStatusClass('Vencido')).toBe(secondResult.getStatusClass('Vencido'));
  });
}); 