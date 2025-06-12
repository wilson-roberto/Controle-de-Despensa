/**
 * Formata um número de telefone para o padrão WhatsApp
 * Remove caracteres não numéricos e adiciona formatação (XX) XXXXX-XXXX
 */
export const formatWhatsAppNumber = (number) => {
  // Se for undefined, null ou vazio
  if (!number) return '';
  
  // Se for array, formata cada número e junta com vírgula
  if (Array.isArray(number)) {
    return number
      .map(n => formatWhatsAppNumber(n))
      .filter(Boolean)
      .join(', ');
  }
  
  // Converte para string e remove caracteres não numéricos
  const numericValue = String(number || '').replace(/\D/g, '');
  
  // Se não houver números após a limpeza
  if (!numericValue) return '';
  
  // Remove o prefixo 55 se existir
  const cleanNumber = numericValue.startsWith('55') ? numericValue.slice(2) : numericValue;
  
  // Formata o número conforme o tamanho
  if (cleanNumber.length <= 2) {
    return `(${cleanNumber}`;
  } else if (cleanNumber.length <= 7) {
    return `(${cleanNumber.slice(0, 2)}) ${cleanNumber.slice(2)}`;
  } else {
    return `(${cleanNumber.slice(0, 2)}) ${cleanNumber.slice(2, 7)}-${cleanNumber.slice(7, 11)}`;
  }
};

/**
 * Converte a primeira letra de uma string para maiúscula
 */
export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Formata um número de WhatsApp para o formato internacional
 * Adiciona o prefixo 55 se necessário e remove formatação
 */
export const formatWhatsAppForAPI = (number) => {
  // Se for undefined, null ou vazio
  if (!number) return '';
  
  // Se for array, formata todos os números válidos
  if (Array.isArray(number)) {
    return number
      .map(n => formatWhatsAppForAPI(n))
      .filter(Boolean);
  }
  
  // Converte para string e remove caracteres não numéricos
  const numericValue = String(number || '').replace(/\D/g, '');
  
  // Se não houver números após a limpeza
  if (!numericValue) return '';
  
  // Adiciona o prefixo 55 se não existir
  return numericValue.startsWith('55') ? numericValue : `55${numericValue}`;
}; 