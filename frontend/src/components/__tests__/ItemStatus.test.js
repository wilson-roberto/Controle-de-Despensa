import { isStockLow, isExpired, getItemStatus } from '../ItemStatus';

describe('ItemStatus', () => {
  describe('isStockLow', () => {
    it('deve retornar true para estoque baixo não notificado', () => {
      const item = {
        totalEstoque: 2,
        limiteEstoque: 5,
        notificadoEstoque: false
      };

      expect(isStockLow(item)).toBe(true);
    });

    it('deve retornar false para estoque baixo já notificado', () => {
      const item = {
        totalEstoque: 2,
        limiteEstoque: 5,
        notificadoEstoque: true
      };

      expect(isStockLow(item)).toBe(false);
    });

    it('deve retornar true para estoque igual ao limite não notificado', () => {
      const item = {
        totalEstoque: 5,
        limiteEstoque: 5,
        notificadoEstoque: false
      };

      expect(isStockLow(item)).toBe(true);
    });

    it('deve retornar false para estoque adequado', () => {
      const item = {
        totalEstoque: 6,
        limiteEstoque: 5,
        notificadoEstoque: false
      };

      expect(isStockLow(item)).toBe(false);
    });

    it('deve lidar com valores string', () => {
      const item = {
        totalEstoque: '2',
        limiteEstoque: '5',
        notificadoEstoque: false
      };

      expect(isStockLow(item)).toBe(true);
    });

    it('deve retornar false para item inválido', () => {
      const item = {};

      expect(isStockLow(item)).toBe(false);
    });
  });

  describe('isExpired', () => {
    it('deve retornar true para item vencido não notificado', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const item = {
        dataValidade: yesterday.toISOString(),
        notificadoValidade: false
      };

      expect(isExpired(item)).toBe(true);
    });

    it('deve retornar false para item vencido já notificado', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const item = {
        dataValidade: yesterday.toISOString(),
        notificadoValidade: true
      };

      expect(isExpired(item)).toBe(false);
    });

    it('deve retornar true para item que vence hoje não notificado', () => {
      const today = new Date();
      
      const item = {
        dataValidade: today.toISOString(),
        notificadoValidade: false
      };

      expect(isExpired(item)).toBe(true);
    });

    it('deve retornar true para item que vence em 15 dias não notificado', () => {
      const future = new Date();
      future.setDate(future.getDate() + 15);
      
      const item = {
        dataValidade: future.toISOString(),
        notificadoValidade: false
      };

      expect(isExpired(item)).toBe(true);
    });

    it('deve retornar true para item que vence em 7 dias não notificado', () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);
      
      const item = {
        dataValidade: future.toISOString(),
        notificadoValidade: false
      };

      expect(isExpired(item)).toBe(true);
    });

    it('deve retornar false para item que vence em 16 dias', () => {
      const future = new Date();
      future.setDate(future.getDate() + 16);
      
      const item = {
        dataValidade: future.toISOString(),
        notificadoValidade: false
      };

      expect(isExpired(item)).toBe(false);
    });

    it('deve retornar false para item sem data de validade', () => {
      const item = {};

      expect(isExpired(item)).toBe(false);
    });

    it('deve retornar false para item com data de validade null', () => {
      const item = {
        dataValidade: null
      };

      expect(isExpired(item)).toBe(false);
    });
  });

  describe('getItemStatus', () => {
    it('deve retornar "low-stock expired" para item com ambos os problemas não notificados', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const item = {
        totalEstoque: 2,
        limiteEstoque: 5,
        dataValidade: yesterday.toISOString(),
        notificadoEstoque: false,
        notificadoValidade: false
      };

      expect(getItemStatus(item)).toBe('low-stock expired');
    });

    it('deve retornar "low-stock" para item apenas com estoque baixo não notificado', () => {
      const future = new Date();
      future.setDate(future.getDate() + 20);
      
      const item = {
        totalEstoque: 2,
        limiteEstoque: 5,
        dataValidade: future.toISOString(),
        notificadoEstoque: false,
        notificadoValidade: false
      };

      expect(getItemStatus(item)).toBe('low-stock');
    });

    it('deve retornar "expired" para item apenas com validade próxima não notificada', () => {
      const future = new Date();
      future.setDate(future.getDate() + 10);
      
      const item = {
        totalEstoque: 6,
        limiteEstoque: 5,
        dataValidade: future.toISOString(),
        notificadoEstoque: false,
        notificadoValidade: false
      };

      expect(getItemStatus(item)).toBe('expired');
    });

    it('deve retornar string vazia para item sem problemas', () => {
      const future = new Date();
      future.setDate(future.getDate() + 20);
      
      const item = {
        totalEstoque: 6,
        limiteEstoque: 5,
        dataValidade: future.toISOString(),
        notificadoEstoque: false,
        notificadoValidade: false
      };

      expect(getItemStatus(item)).toBe('');
    });

    it('deve retornar string vazia para item sem data de validade e estoque adequado', () => {
      const item = {
        totalEstoque: 6,
        limiteEstoque: 5,
        notificadoEstoque: false
      };

      expect(getItemStatus(item)).toBe('');
    });

    it('deve retornar string vazia para item com problemas já notificados', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const item = {
        totalEstoque: 2,
        limiteEstoque: 5,
        dataValidade: yesterday.toISOString(),
        notificadoEstoque: true,
        notificadoValidade: true
      };

      expect(getItemStatus(item)).toBe('');
    });
  });
}); 