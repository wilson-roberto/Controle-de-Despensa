import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const useFormSubmission = ({ formData, editingItem, updateItem, addItem, onCancel, validateForm, resetForm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (isSubmitting) return;

    // Validate the form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingItem) {
        await updateItem(formData);
      } else {
        await addItem(formData);
      }
      resetForm();
      onCancel();
    } catch (error) {
      setError(error.message || 'Erro ao salvar o item. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editingItem, isAuthenticated, isSubmitting, validateForm, resetForm, onCancel, navigate, addItem, updateItem]);

  return {
    isSubmitting,
    error,
    handleSubmit
  };
}; 