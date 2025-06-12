/**
 * Formata uma data para o formato brasileiro (dd/mm/yyyy)
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data formatada
 */
const formatDateBR = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Verifica se uma data está expirada
 * @param {Date|string} date - Data a ser verificada
 * @returns {boolean} true se a data estiver expirada, false caso contrário
 */
const isExpired = (date) => {
  if (!date) return false;
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return d < today;
};

/**
 * Calcula a diferença em dias entre duas datas
 * @param {Date|string} date1 - Primeira data
 * @param {Date|string} date2 - Segunda data
 * @returns {number} Diferença em dias
 */
const daysBetween = (date1, date2) => {
  if (!date1 || !date2) return 0;
  
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
  
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

module.exports = {
  formatDateBR,
  isExpired,
  daysBetween
}; 