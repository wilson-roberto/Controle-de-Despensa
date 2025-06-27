import { renderHook, act } from '@testing-library/react';
import { useFormState } from '../useFormState';

describe('useFormState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFormState());
    
    expect(result.current.formData).toEqual({
      nome: '',
      unidade: '',
      dataValidade: '',
      limiteEstoque: '',
      quantidadeEntrada: '',
      quantidadeSaida: '',
      totalEstoque: '',
      notificado: false
    });
  });

  it('should initialize with editing item data', () => {
    const editingItem = {
      _id: '123',
      nome: 'Arroz',
      unidade: 'kg',
      quantidadeEntrada: 10,
      quantidadeSaida: 2,
      totalEstoque: 8,
      dataValidade: '2023-12-25T00:00:00.000Z',
      limiteEstoque: 5,
      notificado: true
    };

    const { result } = renderHook(() => useFormState(editingItem));
    
    expect(result.current.formData).toEqual({
      ...editingItem,
      dataValidade: '2023-12-25'
    });
  });

  it('should handle input change for regular fields', () => {
    const { result } = renderHook(() => useFormState());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'quantidadeEntrada', value: '10' }
      });
    });
    
    expect(result.current.formData.quantidadeEntrada).toBe('10');
    expect(result.current.formData.totalEstoque).toBe(10);
  });

  it('should capitalize nome field on input change', () => {
    const { result } = renderHook(() => useFormState());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'nome', value: 'arroz branco' }
      });
    });
    
    expect(result.current.formData.nome).toBe('Arroz Branco');
  });

  it('should capitalize unidade field on input change', () => {
    const { result } = renderHook(() => useFormState());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'unidade', value: 'quilos' }
      });
    });
    
    expect(result.current.formData.unidade).toBe('Quilos');
  });

  it('should handle prepositions correctly in nome field', () => {
    const { result } = renderHook(() => useFormState());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'nome', value: 'óleo de soja' }
      });
    });
    
    expect(result.current.formData.nome).toBe('Óleo de Soja');
  });

  it('should handle prepositions correctly in unidade field', () => {
    const { result } = renderHook(() => useFormState());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'unidade', value: 'pacotes de 500g' }
      });
    });
    
    expect(result.current.formData.unidade).toBe('Pacotes de 500g');
  });

  it('should calculate totalEstoque correctly', () => {
    const { result } = renderHook(() => useFormState());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'quantidadeEntrada', value: '15' }
      });
    });
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'quantidadeSaida', value: '3' }
      });
    });
    
    expect(result.current.formData.totalEstoque).toBe(12);
  });

  it('should handle decimal values in stock calculation', () => {
    const { result } = renderHook(() => useFormState());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'quantidadeEntrada', value: '10.5' }
      });
    });
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'quantidadeSaida', value: '2.3' }
      });
    });
    
    expect(result.current.formData.totalEstoque).toBe(8);
  });

  it('should reset form to initial state', () => {
    const { result } = renderHook(() => useFormState());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'nome', value: 'Test Item' }
      });
    });
    
    act(() => {
      result.current.resetForm();
    });
    
    expect(result.current.formData.nome).toBe('');
    expect(result.current.formData.totalEstoque).toBe('');
  });

  it('should handle empty values in stock calculation', () => {
    const { result } = renderHook(() => useFormState());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'quantidadeEntrada', value: '' }
      });
    });
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'quantidadeSaida', value: '' }
      });
    });
    
    expect(result.current.formData.totalEstoque).toBe(0);
  });
}); 