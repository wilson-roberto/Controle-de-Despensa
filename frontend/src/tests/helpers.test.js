import { formatDate, formatCurrency, isValidEmail } from '../utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-04-25');
      expect(formatDate(date)).toBe('25/04/2024');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('R$ 1.000,00');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should invalidate incorrect email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
    });
  });
}); 