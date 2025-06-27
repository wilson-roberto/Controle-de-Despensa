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
    if (diffDays <= 15) return 'Vence em breve';
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

  return useMemo(() => ({
    formatDate,
    getValidityStatus,
    getStatusClass
  }), []);
};

export default useNotificationFormatter; 