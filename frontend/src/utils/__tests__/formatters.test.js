import { capitalizeFirstLetter, capitalizeWords, autoAccent } from '../formatters';

describe('formatters', () => {
  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
      expect(capitalizeFirstLetter('world')).toBe('World');
      expect(capitalizeFirstLetter('test')).toBe('Test');
    });

    it('should handle empty string', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });

    it('should handle null and undefined', () => {
      expect(capitalizeFirstLetter(null)).toBe('');
      expect(capitalizeFirstLetter(undefined)).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalizeFirstLetter('a')).toBe('A');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize first letter of each word except prepositions', () => {
      expect(capitalizeWords('arroz branco')).toBe('Arroz Branco');
      expect(capitalizeWords('feijão preto')).toBe('Feijão Preto');
      expect(capitalizeWords('óleo de soja')).toBe('Óleo de Soja');
      expect(capitalizeWords('farinha de trigo')).toBe('Farinha de Trigo');
    });

    it('should handle prepositions correctly', () => {
      expect(capitalizeWords('produto de limpeza')).toBe('Produto de Limpeza');
      expect(capitalizeWords('item para casa')).toBe('Item para Casa');
      expect(capitalizeWords('alimento com conservantes')).toBe('Alimento com Conservantes');
      expect(capitalizeWords('produto sem glúten')).toBe('Produto sem Glúten');
    });

    it('should handle multiple prepositions', () => {
      expect(capitalizeWords('produto de limpeza para casa')).toBe('Produto de Limpeza para Casa');
      expect(capitalizeWords('alimento com conservantes sem glúten')).toBe('Alimento com Conservantes sem Glúten');
    });

    it('should handle empty string', () => {
      expect(capitalizeWords('')).toBe('');
    });

    it('should handle null and undefined', () => {
      expect(capitalizeWords(null)).toBe('');
      expect(capitalizeWords(undefined)).toBe('');
    });

    it('should handle single word', () => {
      expect(capitalizeWords('arroz')).toBe('Arroz');
      expect(capitalizeWords('de')).toBe('De');
    });

    it('should handle mixed case input', () => {
      expect(capitalizeWords('ARROZ BRANCO')).toBe('Arroz Branco');
      expect(capitalizeWords('Feijão Preto')).toBe('Feijão Preto');
      expect(capitalizeWords('óleo DE soja')).toBe('Óleo de Soja');
    });

    it('should handle special characters and numbers', () => {
      expect(capitalizeWords('produto 123')).toBe('Produto 123');
      expect(capitalizeWords('item-teste')).toBe('Item-teste');
      expect(capitalizeWords('produto & cia')).toBe('Produto & Cia');
    });
  });

  describe('autoAccent', () => {
    it('should automatically accent common Portuguese words', () => {
      expect(autoAccent('cafe')).toBe('café');
      expect(autoAccent('pao')).toBe('pão');
      expect(autoAccent('acucar')).toBe('açúcar');
      expect(autoAccent('feijao')).toBe('feijão');
    });

    it('should automatically accent óleo', () => {
      expect(autoAccent('oleo')).toBe('óleo');
      expect(autoAccent('oleos')).toBe('óleos');
      expect(autoAccent('oleo de soja')).toBe('óleo de soja');
      expect(autoAccent('oleo de oliva')).toBe('óleo de oliva');
    });

    it('should handle words that are already accented', () => {
      expect(autoAccent('óleo')).toBe('óleo');
      expect(autoAccent('café')).toBe('café');
      expect(autoAccent('pão')).toBe('pão');
    });

    it('should handle empty string', () => {
      expect(autoAccent('')).toBe('');
    });

    it('should handle null and undefined', () => {
      expect(autoAccent(null)).toBe('');
      expect(autoAccent(undefined)).toBe('');
    });

    it('should handle mixed case', () => {
      expect(autoAccent('OLEO')).toBe('óleo');
      expect(autoAccent('Oleo')).toBe('óleo');
      expect(autoAccent('OLEO DE SOJA')).toBe('óleo de soja');
    });
  });
}); 