import WhatsAppService from '../whatsappService';

describe('WhatsAppService', () => {
  describe('formatPhoneNumber', () => {
    it('deve formatar número brasileiro com 11 dígitos', () => {
      const result = WhatsAppService.formatPhoneNumber('11999999999');
      expect(result).toBe('5511999999999');
    });

    it('deve formatar número brasileiro com 10 dígitos', () => {
      const result = WhatsAppService.formatPhoneNumber('1199999999');
      expect(result).toBe('551199999999');
    });

    it('deve formatar número com formatação', () => {
      const result = WhatsAppService.formatPhoneNumber('(11) 99999-9999');
      expect(result).toBe('5511999999999');
    });

    it('deve retornar string vazia para número inválido', () => {
      const result = WhatsAppService.formatPhoneNumber('');
      expect(result).toBe('');
    });
  });

  describe('generateLowStockMessage', () => {
    it('deve gerar mensagem de estoque baixo', () => {
      const item = {
        nome: 'Arroz',
        totalEstoque: 2,
        unidade: 'kg',
        limiteEstoque: 5
      };

      const message = WhatsAppService.generateLowStockMessage(item);
      
      expect(message).toContain('ALERTA DE ESTOQUE BAIXO');
      expect(message).toContain('Arroz');
      expect(message).toContain('2 kg');
      expect(message).toContain('5 kg');
    });
  });

  describe('generateExpiredMessage', () => {
    it('deve gerar mensagem para item vencido', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const item = {
        nome: 'Leite',
        totalEstoque: 3,
        unidade: 'l',
        dataValidade: yesterday.toISOString()
      };

      const message = WhatsAppService.generateExpiredMessage(item);
      
      expect(message).toContain('ALERTA DE VALIDADE');
      expect(message).toContain('Leite');
      expect(message).toContain('3 l');
      expect(message).toContain('VENCIDO');
    });

    it('deve gerar mensagem para item que vence hoje', () => {
      const today = new Date();
      
      const item = {
        nome: 'Iogurte',
        totalEstoque: 1,
        unidade: 'un',
        dataValidade: today.toISOString()
      };

      const message = WhatsAppService.generateExpiredMessage(item);
      
      expect(message).toContain('VENCE HOJE');
    });

    it('deve gerar mensagem para item que vence amanhã', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const item = {
        nome: 'Queijo',
        totalEstoque: 2,
        unidade: 'kg',
        dataValidade: tomorrow.toISOString()
      };

      const message = WhatsAppService.generateExpiredMessage(item);
      
      expect(message).toContain('VENCE AMANHÃ');
    });
  });

  describe('isLowStock', () => {
    it('deve retornar true para estoque baixo', () => {
      const item = {
        totalEstoque: 2,
        limiteEstoque: 5
      };

      expect(WhatsAppService.isLowStock(item)).toBe(true);
    });

    it('deve retornar false para estoque adequado', () => {
      const item = {
        totalEstoque: 6,
        limiteEstoque: 5
      };

      expect(WhatsAppService.isLowStock(item)).toBe(false);
    });
  });

  describe('isExpired', () => {
    it('deve retornar true para validade próxima (15 dias)', () => {
      const future = new Date();
      future.setDate(future.getDate() + 10);
      
      const item = {
        dataValidade: future.toISOString()
      };

      expect(WhatsAppService.isExpired(item)).toBe(true);
    });

    it('deve retornar false para validade distante', () => {
      const future = new Date();
      future.setDate(future.getDate() + 20);
      
      const item = {
        dataValidade: future.toISOString()
      };

      expect(WhatsAppService.isExpired(item)).toBe(false);
    });

    it('deve retornar false para item sem data de validade', () => {
      const item = {};

      expect(WhatsAppService.isExpired(item)).toBe(false);
    });
  });

  describe('sendBulkNotification', () => {
    it('deve gerar mensagens para itens com estoque baixo', () => {
      const items = [
        {
          nome: 'Arroz',
          totalEstoque: 2,
          limiteEstoque: 5,
          whatsapp: '11999999999'
        },
        {
          nome: 'Feijão',
          totalEstoque: 1,
          limiteEstoque: 3,
          whatsapp: '11888888888'
        }
      ];

      const messages = WhatsAppService.sendBulkNotification(items, 'lowStock');
      
      expect(messages).toHaveLength(2);
      expect(messages[0].phone).toBe('11999999999');
      expect(messages[0].itemName).toBe('Arroz');
      expect(messages[1].phone).toBe('11888888888');
      expect(messages[1].itemName).toBe('Feijão');
    });

    it('deve filtrar itens sem WhatsApp', () => {
      const items = [
        {
          nome: 'Arroz',
          totalEstoque: 2,
          limiteEstoque: 5,
          whatsapp: '11999999999'
        },
        {
          nome: 'Feijão',
          totalEstoque: 1,
          limiteEstoque: 3
        }
      ];

      const messages = WhatsAppService.sendBulkNotification(items, 'lowStock');
      
      expect(messages).toHaveLength(1);
      expect(messages[0].itemName).toBe('Arroz');
    });
  });
}); 