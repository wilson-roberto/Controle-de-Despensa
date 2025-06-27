import React from 'react';
import { render, screen } from '@testing-library/react';
import ItemTableHeader from '../ItemTableHeader';

// Mock do CSS module
jest.mock('../../styles/ItemTable.module.css', () => ({
  tableHeader: 'tableHeader',
  actionsCell: 'actionsCell'
}));

describe('ItemTableHeader Component', () => {
  test('renderiza todas as colunas necessárias', () => {
    render(
      <table>
        <ItemTableHeader />
      </table>
    );
    
    // Verifica se todas as colunas estão presentes
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Unidade')).toBeInTheDocument();
    expect(screen.getByText('Entrada')).toBeInTheDocument();
    expect(screen.getByText('Saída')).toBeInTheDocument();
    expect(screen.getByText('Estoque')).toBeInTheDocument();
    expect(screen.getByText('Validade')).toBeInTheDocument();
    expect(screen.getByText('Limite')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  test('não renderiza a coluna WhatsApp', () => {
    render(
      <table>
        <ItemTableHeader />
      </table>
    );
    
    // Verifica se a coluna WhatsApp não está presente
    expect(screen.queryByText('WhatsApp')).not.toBeInTheDocument();
  });

  test('renderiza exatamente 8 colunas', () => {
    render(
      <table>
        <ItemTableHeader />
      </table>
    );
    
    const headerCells = screen.getAllByRole('columnheader');
    expect(headerCells).toHaveLength(8);
  });

  test('aplica a classe tableHeader para todas as labels incluindo Ações', () => {
    render(
      <table>
        <ItemTableHeader />
      </table>
    );
    
    const headerCells = screen.getAllByRole('columnheader');
    
    // Verifica se todas as células do cabeçalho têm a classe tableHeader
    headerCells.forEach(cell => {
      expect(cell).toHaveClass('tableHeader');
    });
    
    // Verifica especificamente se a label 'Ações' tem a classe tableHeader
    const acoesHeader = screen.getByText('Ações');
    expect(acoesHeader).toHaveClass('tableHeader');
  });
}); 