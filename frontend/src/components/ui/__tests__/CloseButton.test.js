import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CloseButton from '../CloseButton';

describe('CloseButton Component', () => {
  test('renders with default text "Fechar"', () => {
    render(<CloseButton onClick={() => {}} />);
    const buttonElement = screen.getByText('Fechar');
    expect(buttonElement).toBeInTheDocument();
  });

  test('renders with custom text when provided', () => {
    render(<CloseButton onClick={() => {}}>Cancelar</CloseButton>);
    const buttonElement = screen.getByText('Cancelar');
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<CloseButton onClick={handleClick} />);
    const buttonElement = screen.getByText('Fechar');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('has correct aria-label', () => {
    render(<CloseButton onClick={() => {}} />);
    const buttonElement = screen.getByLabelText('Fechar modal');
    expect(buttonElement).toBeInTheDocument();
  });

  test('is disabled when disabled prop is true', () => {
    render(<CloseButton onClick={() => {}} disabled />);
    const buttonElement = screen.getByText('Fechar');
    expect(buttonElement).toBeDisabled();
  });
}); 