import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemTable from '../ItemTable';

// Mock do AppContext
let mockState = {
  items: [
    {
      _id: '1',
      nome: 'Arroz',
      unidade: 'kg',
      quantidadeEntrada: 10,
      quantidadeSaida: 5,
      totalEstoque: 5,
      dataValidade: '2024-12-31',
      limiteEstoque: 2
    }
  ],
  loading: false,
  error: null
};

jest.mock('../../context/AppContext', () => ({
  useApp: () => ({ state: mockState })
}));

// Mock dos componentes filhos
jest.mock('../ItemTableHeader', () => {
  return function MockItemTableHeader() {
    return (
      <thead>
        <tr>
          <th>Item</th>
          <th>Unidade</th>
          <th>Entrada</th>
          <th>Saída</th>
          <th>Estoque</th>
          <th>Validade</th>
          <th>Limite</th>
          <th>Ações</th>
        </tr>
      </thead>
    );
  };
});

jest.mock('../ItemRow', () => {
  return function MockItemRow({ item }) {
    return (
      <tr>
        <td>{item.nome}</td>
        <td>{item.unidade}</td>
        <td>{item.quantidadeEntrada}</td>
        <td>{item.quantidadeSaida}</td>
        <td>{item.totalEstoque}</td>
        <td>{item.dataValidade}</td>
        <td>{item.limiteEstoque}</td>
        <td>Ações</td>
      </tr>
    );
  };
});

describe('ItemTable Component', () => {
  beforeEach(() => {
    mockState = {
      items: [
        {
          _id: '1',
          nome: 'Arroz',
          unidade: 'kg',
          quantidadeEntrada: 10,
          quantidadeSaida: 5,
          totalEstoque: 5,
          dataValidade: '2024-12-31',
          limiteEstoque: 2
        }
      ],
      loading: false,
      error: null
    };
  });

  test('renderiza a tabela com dados', () => {
    render(<ItemTable />);
    expect(screen.getByText('Arroz')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    // Existem dois "5" (quantidadeSaida e totalEstoque)
    expect(screen.queryAllByText('5').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('renderiza o cabeçalho da tabela sem a coluna WhatsApp', () => {
    render(<ItemTable />);
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Unidade')).toBeInTheDocument();
    expect(screen.getByText('Entrada')).toBeInTheDocument();
    expect(screen.getByText('Saída')).toBeInTheDocument();
    expect(screen.getByText('Estoque')).toBeInTheDocument();
    expect(screen.getByText('Validade')).toBeInTheDocument();
    expect(screen.getByText('Limite')).toBeInTheDocument();
    // Existem dois "Ações" (th e td)
    expect(screen.queryAllByText('Ações').length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText('WhatsApp')).not.toBeInTheDocument();
  });

  test('renderiza mensagem de carregamento quando loading é true', () => {
    mockState = {
      items: [],
      loading: true,
      error: null
    };
    render(<ItemTable />);
    expect(screen.getByText('Carregando itens...')).toBeInTheDocument();
  });

  test('renderiza mensagem de erro quando há erro', () => {
    mockState = {
      items: [],
      loading: false,
      error: 'Erro ao carregar itens'
    };
    render(<ItemTable />);
    expect(screen.getByText('Erro ao carregar itens')).toBeInTheDocument();
  });

  test('renderiza mensagem quando não há itens', () => {
    mockState = {
      items: [],
      loading: false,
      error: null
    };
    render(<ItemTable />);
    expect(screen.getByText('Nenhum item encontrado.')).toBeInTheDocument();
  });

  test('aplica as classes CSS corretas para bordas da tabela', () => {
    render(<ItemTable />);
    
    // Verifica se a tabela tem a classe table
    const table = screen.getByRole('table');
    expect(table).toHaveClass('table');
  });
}); 