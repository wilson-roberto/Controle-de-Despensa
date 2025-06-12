import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

export const formatWhatsAppNumber = (number) => {
  if (!number) return '';
  const cleaned = number.replace(/\D/g, '');
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
}; 