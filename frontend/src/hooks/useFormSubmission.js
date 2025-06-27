import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useFormSubmission = ({ formData, editingItem, updateItem, addItem, onCancel, validateForm, resetForm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    console.log('Iniciando submissão do formulário:', { formData, editingItem, isAuthenticated });
    
    if (!isAuthenticated) {
      console.log('Usuário não autenticado, redirecionando para login');
      navigate('/login', { replace: true });
      return;
    }

    if (isSubmitting) {
      console.log('Formulário já está sendo submetido, ignorando');
      return;
    }

    // Validate the form
    console.log('Validando formulário...');
    if (!validateForm()) {
      console.log('Validação do formulário falhou');
      return;
    }

    console.log('Validação passou, iniciando submissão...');
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingItem) {
        console.log('Atualizando item existente...');
        await updateItem(formData);
      } else {
        console.log('Adicionando novo item...');
        await addItem(formData);
      }
      
      console.log('Operação realizada com sucesso, resetando formulário...');
      resetForm();
      onCancel();
    } catch (error) {
      console.error('Erro durante a submissão:', error);
      setError(error.message || 'Erro ao salvar o item. Tente novamente.');
    } finally {
      console.log('Finalizando submissão...');
      setIsSubmitting(false);
    }
  }, [formData, editingItem, isAuthenticated, isSubmitting, validateForm, resetForm, onCancel, navigate, addItem, updateItem]);

  return {
    isSubmitting,
    error,
    handleSubmit
  };
}; 