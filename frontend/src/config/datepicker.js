import { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);

export const datepickerConfig = {
  locale: 'pt-BR',
  dateFormat: 'dd/MM/yyyy',
  showYearDropdown: true,
  scrollableYearDropdown: true,
  yearDropdownItemNumber: 15,
  isClearable: true,
  placeholderText: 'Selecione uma data'
}; 