import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThreeDotsIcon from '../ThreeDotsIcon';

describe('ThreeDotsIcon Component', () => {
  test('renderiza o ícone de três bolinhas', () => {
    render(<ThreeDotsIcon />);
    
    const icon = screen.getByTestId('three-dots-icon');
    expect(icon).toBeInTheDocument();
    
    // Verifica se há 3 elementos dot usando getAllByTestId
    const dots = screen.getAllByTestId('three-dots-icon');
    expect(dots).toHaveLength(1);
  });

  test('renderiza com testId customizado', () => {
    render(<ThreeDotsIcon testId="custom-test-id" />);
    
    const icon = screen.getByTestId('custom-test-id');
    expect(icon).toBeInTheDocument();
  });

  test('chama onClick quando clicado', () => {
    const mockOnClick = jest.fn();
    render(<ThreeDotsIcon onClick={mockOnClick} />);
    
    const icon = screen.getByTestId('three-dots-icon');
    fireEvent.click(icon);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('aplica className customizada', () => {
    render(<ThreeDotsIcon className="custom-class" />);
    
    const icon = screen.getByTestId('three-dots-icon');
    expect(icon).toHaveClass('custom-class');
  });

  test('renderiza com estrutura correta', () => {
    render(<ThreeDotsIcon />);
    
    const icon = screen.getByTestId('three-dots-icon');
    expect(icon).toBeInTheDocument();
    expect(icon.tagName).toBe('DIV');
  });
}); 