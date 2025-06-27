import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ItemActions from '../ItemActions';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock do contexto App
jest.mock('../../context/AppContext', () => ({
  useApp: () => ({
    deleteItem: jest.fn(),
    items: [],
    fetchItems: jest.fn(),
    addItem: jest.fn(),
    updateItem: jest.fn(),
  }),
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ItemActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock do window.confirm
    window.confirm = jest.fn(() => true);
  });

  test('renderiza os botões Editar e Excluir', () => {
    renderWithRouter(<ItemActions itemId="123" />);
    
    expect(screen.getByTestId('edit-item-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-item-button')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Excluir')).toBeInTheDocument();
  });

  test('navega para a página de edição quando o botão Editar é clicado', () => {
    renderWithRouter(<ItemActions itemId="123" />);
    
    const editButton = screen.getByTestId('edit-item-button');
    fireEvent.click(editButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/editar-item/123');
  });
}); 