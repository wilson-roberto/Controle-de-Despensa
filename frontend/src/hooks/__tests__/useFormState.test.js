import { render, act } from '@testing-library/react';
import { useFormState } from '../useFormState';

function TestComponent({ hookProps, onRender }) {
  const hook = useFormState(hookProps);
  onRender && onRender(hook);
  return null;
}

describe('useFormState', () => {
  function getHookResult(hookProps) {
    let hookResult;
    render(<TestComponent hookProps={hookProps} onRender={r => { hookResult = r; }} />);
    return hookResult;
  }

  it('should initialize with default state', () => {
    const result = getHookResult();
    expect(result.formData).toEqual({
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
    const result = getHookResult(editingItem);
    expect(result.formData).toEqual({
      ...editingItem,
      dataValidade: '2023-12-25'
    });
  });

  it('should handle input change for regular fields', () => {
    let hookResult;
    render(<TestComponent onRender={r => { hookResult = r; }} />);
    act(() => {
      hookResult.handleInputChange({
        target: { name: 'quantidadeEntrada', value: '10' }
      });
    });
    expect(hookResult.formData.quantidadeEntrada).toBe('10');
    expect(hookResult.formData.totalEstoque).toBe(10);
  });

  it('should capitalize nome field on input change', () => {
    let hookResult;
    render(<TestComponent onRender={r => { hookResult = r; }} />);
    act(() => {
      hookResult.handleInputChange({
        target: { name: 'nome', value: 'arroz branco' }
      });
    });
    expect(hookResult.formData.nome).toBe('Arroz Branco');
  });

  it('should capitalize unidade field on input change', () => {
    let hookResult;
    render(<TestComponent onRender={r => { hookResult = r; }} />);
    act(() => {
      hookResult.handleInputChange({
        target: { name: 'unidade', value: 'quilos' }
      });
    });
    expect(hookResult.formData.unidade).toBe('Quilos');
  });

  it('should handle prepositions correctly in nome field', () => {
    let hookResult;
    render(<TestComponent onRender={r => { hookResult = r; }} />);
    act(() => {
      hookResult.handleInputChange({
        target: { name: 'nome', value: 'óleo de soja' }
      });
    });
    expect(hookResult.formData.nome).toBe('Óleo de Soja');
  });

  it('should handle prepositions correctly in unidade field', () => {
    let hookResult;
    render(<TestComponent onRender={r => { hookResult = r; }} />);
    act(() => {
      hookResult.handleInputChange({
        target: { name: 'unidade', value: 'pacotes de 500g' }
      });
    });
    expect(hookResult.formData.unidade).toBe('Pacotes de 500g');
  });

  it('should calculate totalEstoque correctly', () => {
    let hookResult;
    render(<TestComponent onRender={r => { hookResult = r; }} />);
    act(() => {
      hookResult.handleInputChange({
        target: { name: 'quantidadeEntrada', value: '15' }
      });
    });
    act(() => {
      hookResult.handleInputChange({
        target: { name: 'quantidadeSaida', value: '3' }
      });
    });
    expect(hookResult.formData.totalEstoque).toBe(12);
  });

  it('should handle decimal values in stock calculation', () => {
    let hookResult;
    render(<TestComponent onRender={r => { hookResult = r; }} />);
    act(() => {
      hookResult.handleInputChange({
        target: { name: 'quantidadeEntrada', value: '10.5' }
      });
    });
    act(() => {
      hookResult.handleInputChange({
        target: { name: 'quantidadeSaida', value: '2.3' }
      });
    });
    expect(hookResult.formData.totalEstoque).toBe(8);
  });

  it('should reset form to initial state', () => {
    let hookResult;
    render(<TestComponent onRender={r => { hookResult = r; }} />);
    act(() => {
      hookResult.handleInputChange({
        target: { name: 'nome', value: 'Test Item' }
      });
    });
    act(() => {
      hookResult.resetForm();
    });
    expect(hookResult.formData.nome).toBe('');
    expect(hookResult.formData.totalEstoque).toBe('');
  });

  it('should handle empty values in stock calculation', () => {
    let hookResult;
    render(<TestComponent onRender={r => { hookResult = r; }} />);
    act(() => {
      hookResult.handleInputChange({
        target: { name: 'quantidadeEntrada', value: '' }
      });
    });
    act(() => {
      hookResult.handleInputChange({
        target: { name: 'quantidadeSaida', value: '' }
      });
    });
    expect(hookResult.formData.totalEstoque).toBe(0);
  });
}); 