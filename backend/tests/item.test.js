const mongoose = require('mongoose');
const Item = require('../models/Item');

describe('Item Model', () => {
  it('should validate required fields', () => {
    const itemData = {
      // nome é obrigatório
      unidade: 'kg'
    };

    const item = new Item(itemData);
    
    const validationError = item.validateSync();
    expect(validationError).toBeDefined();
    expect(validationError.errors.nome).toBeDefined();
    expect(validationError.errors.nome.message).toBe('Item é obrigatório');
  });

  it('should accept valid item data', () => {
    const itemData = {
      nome: 'Arroz Branco',
      unidade: 'kg',
      quantidadeEntrada: 10,
      quantidadeSaida: 2,
      totalEstoque: 8,
      dataValidade: new Date('2024-12-31'),
      limiteEstoque: 5
    };

    const item = new Item(itemData);
    const validationError = item.validateSync();
    
    expect(validationError).toBeUndefined();
    expect(item.nome).toBe('Arroz Branco');
    expect(item.unidade).toBe('kg');
    expect(item.quantidadeEntrada).toBe(10);
    expect(item.quantidadeSaida).toBe(2);
    expect(item.totalEstoque).toBe(8);
    expect(item.limiteEstoque).toBe(5);
  });

  it('should set default values', () => {
    const itemData = {
      nome: 'Feijão Preto',
      unidade: 'kg'
    };

    const item = new Item(itemData);
    
    expect(item.quantidadeEntrada).toBe(0);
    expect(item.quantidadeSaida).toBe(0);
    expect(item.totalEstoque).toBe(0);
    expect(item.limiteEstoque).toBe(0);
    expect(item.notificado).toBe(false);
    expect(item.notificadoEstoque).toBe(false);
    expect(item.notificadoValidade).toBe(false);
  });

  it('should not have WhatsApp field', () => {
    const itemData = {
      nome: 'Arroz',
      unidade: 'kg'
    };

    const item = new Item(itemData);
    
    // Verificar que o campo WhatsApp não existe no schema
    expect(item.schema.paths.whatsapp).toBeUndefined();
  });

  it('should handle prepositions in nome field correctly', () => {
    const itemData = {
      nome: 'Óleo de Soja',
      unidade: 'Litro'
    };

    const item = new Item(itemData);
    const validationError = item.validateSync();
    
    expect(validationError).toBeUndefined();
    expect(item.nome).toBe('Óleo de Soja');
  });

  it('should handle prepositions in unidade field correctly', () => {
    const itemData = {
      nome: 'Arroz',
      unidade: 'Pacotes de 500g'
    };

    const item = new Item(itemData);
    const validationError = item.validateSync();
    
    expect(validationError).toBeUndefined();
    expect(item.unidade).toBe('Pacotes de 500g');
  });

  it('should trim string fields', () => {
    const itemData = {
      nome: '  Arroz Branco  ',
      unidade: '  kg  '
    };

    const item = new Item(itemData);
    
    expect(item.nome).toBe('Arroz Branco');
    expect(item.unidade).toBe('kg');
  });
}); 