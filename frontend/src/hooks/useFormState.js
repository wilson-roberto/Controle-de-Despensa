import { useState, useCallback } from 'react';

const initialState = {
  nome: '',
  unidade: '',
  dataValidade: '',
  limiteEstoque: '',
  quantidadeEntrada: '',
  dataUltimaEntrada: '',
  quantidadeSaida: '',
  dataUltimaSaida: '',
  totalEstoque: '',
  whatsapp: '',
  notificado: false
};

export const useFormState = (editingItem = null) => {
  const [formData, setFormData] = useState(editingItem ? {
    ...initialState,
    ...editingItem,
    dataValidade: editingItem.dataValidade ? editingItem.dataValidade.split('T')[0] : '',
    dataUltimaEntrada: editingItem.dataUltimaEntrada ? editingItem.dataUltimaEntrada.split('T')[0] : '',
    dataUltimaSaida: editingItem.dataUltimaSaida ? editingItem.dataUltimaSaida.split('T')[0] : '',
    whatsapp: Array.isArray(editingItem.whatsapp) ? editingItem.whatsapp.join(', ') : '',
  } : initialState);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Calcular o total em estoque
      const quantidadeEntrada = Number(newData.quantidadeEntrada || 0);
      const quantidadeSaida = Number(newData.quantidadeSaida || 0);
      newData.totalEstoque = Math.floor(quantidadeEntrada - quantidadeSaida);
      
      return newData;
    });
  }, []);

  const handleWhatsAppChange = useCallback((e) => {
    const inputValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      whatsapp: inputValue
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
  }, []);

  return {
    formData,
    setFormData,
    handleInputChange,
    handleWhatsAppChange,
    resetForm
  };
}; 