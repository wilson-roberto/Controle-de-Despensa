import { useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const useNotificationFormatter = () => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    
    // Ajusta a data para o fuso horário local
    const localDate = new Date(dateString);
    localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
    
    return format(localDate, 'dd/MM/yyyy', { locale: ptBR });
  };

  const getValidityStatus = (dateString) => {
    if (!dateString) return 'Data não informada';
    
    const today = new Date();
    const validityDate = new Date(dateString);
    const diffTime = validityDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Vencido';
    if (diffDays <= 7) return 'Vence em breve';
    if (diffDays <= 30) return 'Vence em um mês';
    return 'Válido';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Vencido':
        return 'status-expired';
      case 'Vence em breve':
        return 'status-warning';
      case 'Vence em um mês':
        return 'status-info';
      default:
        return 'status-valid';
    }
  };

  const formatWhatsAppNumber = (number) => {
    // Se for undefined, null ou vazio
    if (!number) return 'Número não informado';
    
    // Se for array, formata cada número e junta com vírgula
    if (Array.isArray(number)) {
      return number
        .map(n => formatWhatsAppNumber(n))
        .filter(Boolean)
        .join(', ');
    }
    
    // Converte para string e remove caracteres não numéricos
    const numericValue = String(number).replace(/\D/g, '');
    
    // Se não houver números após a limpeza
    if (!numericValue) return 'Número inválido';
    
    // Remove o prefixo 55 se existir
    const cleanNumber = numericValue.startsWith('55') ? numericValue.slice(2) : numericValue;
    
    // Formata o número conforme o tamanho
    if (cleanNumber.length <= 2) {
      return `(${cleanNumber}`;
    } else if (cleanNumber.length <= 7) {
      return `(${cleanNumber.slice(0, 2)}) ${cleanNumber.slice(2)}`;
    } else if (cleanNumber.length <= 11) {
      return `(${cleanNumber.slice(0, 2)}) ${cleanNumber.slice(2, 7)}-${cleanNumber.slice(7)}`;
    } else {
      // Se tiver mais de 11 dígitos, formata apenas os primeiros 11
      return `(${cleanNumber.slice(0, 2)}) ${cleanNumber.slice(2, 7)}-${cleanNumber.slice(7, 11)}`;
    }
  };

  return useMemo(() => ({
    formatDate,
    getValidityStatus,
    getStatusClass,
    formatWhatsAppNumber
  }), []);
};

export default useNotificationFormatter; 