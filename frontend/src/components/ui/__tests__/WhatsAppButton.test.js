import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WhatsAppButton from '../WhatsAppButton';

describe('WhatsAppButton Component', () => {
  test('renders with default text "Enviar WhatsApp"', () => {
    render(<WhatsAppButton onClick={() => {}} />);
    const buttonElement = screen.getByText('Enviar WhatsApp');
    expect(buttonElement).toBeInTheDocument();
  });

  test('renders with custom text when provided', () => {
    render(<WhatsAppButton onClick={() => {}}>Enviar Mensagem</WhatsAppButton>);
    const buttonElement = screen.getByText('Enviar Mensagem');
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<WhatsAppButton onClick={handleClick} />);
    const buttonElement = screen.getByText('Enviar WhatsApp');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('has correct aria-label', () => {
    render(<WhatsAppButton onClick={() => {}} />);
    const buttonElement = screen.getByLabelText('Enviar mensagem via WhatsApp');
    expect(buttonElement).toBeInTheDocument();
  });

  test('is disabled when disabled prop is true', () => {
    render(<WhatsAppButton onClick={() => {}} disabled />);
    const buttonElement = screen.getByText('Enviar WhatsApp');
    expect(buttonElement).toBeDisabled();
  });
}); 