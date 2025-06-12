export const formatWhatsAppNumbers = (numbers) => {
  if (!numbers) return [];
  
  return numbers
    .split(',')
    .map(num => num.trim())
    .filter(Boolean)
    .map(num => {
      // Remove todos os caracteres não numéricos
      const numericOnly = num.replace(/\D/g, '');
      // Adiciona o prefixo 55 se não existir
      return numericOnly.startsWith('55') ? numericOnly : `55${numericOnly}`;
    })
    .filter(num => num.length >= 12); // Garante que só números válidos sejam incluídos
}; 