import { useState } from 'react';

export const useFormValidation = (formData, items) => {
  const [error, setError] = useState(null);

  const validateForm = () => {
    if (!formData.nome || formData.nome.trim() === '') {
      setError('O nome do item é obrigatório');
      return false;
    }
    
    if (!formData.unidade || formData.unidade.trim() === '') {
      setError('A unidade do item é obrigatória');
      return false;
    }

    // Verificar se já existe um item com o mesmo nome
    const itemExists = items.some(item => 
      item.nome.toLowerCase() === formData.nome.trim().toLowerCase() &&
      (!formData._id || item._id !== formData._id)
    );

    if (itemExists) {
      setError('Já existe um item cadastrado com este nome');
      return false;
    }

    setError(null);
    return true;
  };

  return { error, setError, validateForm };
}; 