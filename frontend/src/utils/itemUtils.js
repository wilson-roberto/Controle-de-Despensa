import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function toDateOnly(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDate(date) {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
}

export function getValidityStatus(dataValidade) {
  if (!dataValidade) return '';
  const dataValidadeObj = toDateOnly(dataValidade);
  const hoje = toDateOnly(new Date());
  const diffTime = dataValidadeObj - hoje;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'VENCIDO';
  if (diffDays === 0) return 'VENCE HOJE';
  return `Vence em ${diffDays} dias`;
}

export function getStatusClass(status) {
  if (status === 'VENCIDO') return 'expired';
  if (status === 'VENCE HOJE') return 'near-expiry';
  if (status.startsWith('Vence em')) return 'near-expiry';
  return '';
} 