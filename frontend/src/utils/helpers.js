import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função para formatar datas
export const formatDate = (date) => {
  if (!date) return '';
  
  // Ajusta a data para o fuso horário local
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
  
  return format(localDate, 'dd/MM/yyyy', { locale: ptBR });
};

// Função para formatar valores monetários
export const formatCurrency = (value) => {
  return `R$ ${Number(value).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;
};

// Função para validar email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Função para debounce
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};