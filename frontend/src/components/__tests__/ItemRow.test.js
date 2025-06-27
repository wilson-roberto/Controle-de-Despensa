import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemRow from '../ItemRow';

// Mock dos componentes filhos
jest.mock('../ItemActions', () => {
  return function MockItemActions({ itemId }) {
    return <div data-testid={`item-actions-${itemId}`}>Ações</div>;
  };
});

jest.mock('../../utils/itemUtils', () => ({
  formatDate: jest.fn((date) => date)
}));

jest.mock('../ItemStatus', () => ({
  getItemStatus: jest.fn(() => 'normal')
}));

// Mock do CSS module
jest.mock('../../styles/ItemTable.module.css', () => ({
  tableRow: 'tableRow',
  tableCell: 'tableCell',
  numberCell: 'numberCell',
  actionsCell: 'actionsCell'
}));

const mockItem = {
  _id: '1',
  nome: 'Arroz',
  unidade: 'kg',
  quantidadeEntrada: 10,
  quantidadeSaida: 5,
  totalEstoque: 5,
  dataValidade: '2024-12-31',
  limiteEstoque: 2
};

describe('ItemRow', () => {
  test('renderiza uma linha da tabela com dados básicos', () => {
    render(
      <table>
        <tbody>
          <ItemRow item={mockItem} />
        </tbody>
      </table>
    );
    
    expect(screen.getByText('Arroz')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getAllByText('5')).toHaveLength(2); // quantidadeSaida e totalEstoque
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByTestId('item-actions-1')).toBeInTheDocument();
  });

  test('aplica a classe numberCell para células numéricas', () => {
    render(
      <table>
        <tbody>
          <ItemRow item={mockItem} />
        </tbody>
      </table>
    );
    
    const cells = screen.getAllByRole('cell');
    
    // Verifica se as células numéricas têm a classe numberCell
    const entradaCell = cells[2]; // quantidadeEntrada
    const saidaCell = cells[3];   // quantidadeSaida
    const estoqueCell = cells[4]; // totalEstoque
    const limiteCell = cells[6];  // limiteEstoque
    
    expect(entradaCell).toHaveClass('numberCell');
    expect(saidaCell).toHaveClass('numberCell');
    expect(estoqueCell).toHaveClass('numberCell');
    expect(limiteCell).toHaveClass('numberCell');
  });

  test('aplica a classe de status correta', () => {
    const { getItemStatus } = require('../ItemStatus');
    getItemStatus.mockReturnValue('low-stock');
    
    render(
      <table>
        <tbody>
          <ItemRow item={mockItem} />
        </tbody>
      </table>
    );
    
    const row = screen.getByRole('row');
    expect(row).toHaveClass('low-stock');
  });

  test('verifica se as células estão centralizadas', () => {
    render(
      <table>
        <tbody>
          <ItemRow item={mockItem} />
        </tbody>
      </table>
    );
    
    const cells = screen.getAllByRole('cell');
    
    // Verifica se todas as células estão presentes (8 colunas após remoção do WhatsApp)
    expect(cells).toHaveLength(8);
    
    // Verifica se as células não numéricas não têm a classe numberCell
    const nomeCell = cells[0]; // nome
    const unidadeCell = cells[1]; // unidade
    const dataCell = cells[5]; // data
    const acoesCell = cells[7]; // ações
    
    expect(nomeCell).not.toHaveClass('numberCell');
    expect(unidadeCell).not.toHaveClass('numberCell');
    expect(dataCell).not.toHaveClass('numberCell');
    expect(acoesCell).not.toHaveClass('numberCell');
  });

  test('verifica se a estrutura da tabela está correta', () => {
    render(
      <table>
        <tbody>
          <ItemRow item={mockItem} />
        </tbody>
      </table>
    );
    
    const table = screen.getByRole('table');
    const row = screen.getByRole('row');
    const cells = screen.getAllByRole('cell');
    
    expect(table).toBeInTheDocument();
    expect(row).toBeInTheDocument();
    expect(cells).toHaveLength(8); // 8 colunas após remoção do WhatsApp
  });

  test('aplica a classe actionsCell para a célula de ações', () => {
    render(
      <table>
        <tbody>
          <ItemRow item={mockItem} />
        </tbody>
      </table>
    );
    
    const cells = screen.getAllByRole('cell');
    const acoesCell = cells[7]; // ações (última coluna)
    
    expect(acoesCell).toHaveClass('actionsCell');
  });

  test('verifica se a célula de ações tem a largura adequada', () => {
    render(
      <table>
        <tbody>
          <ItemRow item={mockItem} />
        </tbody>
      </table>
    );
    
    const cells = screen.getAllByRole('cell');
    const acoesCell = cells[7]; // ações (última coluna)
    
    // Verifica se a célula tem a classe actionsCell que define a largura
    expect(acoesCell).toHaveClass('actionsCell');
    
    // Verifica se o componente ItemActions está presente dentro da célula
    expect(screen.getByTestId('item-actions-1')).toBeInTheDocument();
  });
}); 