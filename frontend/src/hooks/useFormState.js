import { useState, useCallback } from 'react';
import { capitalizeWords, autoAccent } from '../utils/formatters';

const initialState = {
  nome: '',
  unidade: '',
  dataValidade: '',
  limiteEstoque: '',
  quantidadeEntrada: '',
  quantidadeSaida: '',
  totalEstoque: '',
  notificado: false
};

export const useFormState = (editingItem = null) => {
  const [formData, setFormData] = useState(editingItem ? {
    ...initialState,
    ...editingItem,
    dataValidade: editingItem.dataValidade ? editingItem.dataValidade.split('T')[0] : '',
  } : initialState);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev };
      
      // Aplicar formatação de capitalização para nome e unidade
      if (name === 'nome') {
        newData[name] = capitalizeWords(autoAccent(value));
      } else if (name === 'unidade') {
        newData[name] = capitalizeWords(value);
      } else {
        newData[name] = value;
      }
      
      // Calcular o total em estoque
      const quantidadeEntrada = Number(newData.quantidadeEntrada || 0);
      const quantidadeSaida = Number(newData.quantidadeSaida || 0);
      newData.totalEstoque = Math.floor(quantidadeEntrada - quantidadeSaida);
      
      return newData;
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
  }, []);

  return {
    formData,
    setFormData,
    handleInputChange,
    resetForm
  };
}; 