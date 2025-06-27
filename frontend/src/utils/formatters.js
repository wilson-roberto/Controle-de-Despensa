/**
 * Converte a primeira letra de uma string para maiúscula
 */
export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Capitaliza a primeira letra de cada palavra, exceto preposições
 */
export const capitalizeWords = (string) => {
  if (!string) return '';
  
  // Lista de preposições que não devem ser capitalizadas
  const prepositions = ['de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos', 'por', 'para', 'com', 'sem', 'sob', 'sobre', 'entre', 'contra', 'desde', 'até', 'perante', 'segundo', 'conforme', 'mediante', 'salvo', 'exceto', 'menos', 'fora', 'afora', 'senão', 'tirante', 'que', 'se', 'mas', 'e', 'ou', 'nem', 'tanto', 'quanto', 'como', 'assim', 'logo', 'portanto', 'então', 'pois', 'porque', 'já', 'ainda', 'sempre', 'nunca', 'jamais', 'talvez', 'quiçá', 'acaso', 'porventura', 'será', 'quem', 'qual', 'quais', 'quanto', 'quanta', 'quantos', 'quantas', 'cujo', 'cuja', 'cujos', 'cujas', 'onde', 'quando', 'como', 'porque', 'porquê', 'por que', 'para que', 'a fim de que', 'de modo que', 'de forma que', 'de maneira que', 'de sorte que', 'de jeito que', 'de tal forma que', 'de tal modo que', 'de tal maneira que', 'de tal sorte que', 'de tal jeito que'];
  
  return string
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Se for a primeira palavra ou não for preposição, capitaliza
      if (index === 0 || !prepositions.includes(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word.toLowerCase();
    })
    .join(' ');
};

/**
 * Automatiza a acentuação de palavras comuns em português.
 * Exemplo: cafe -> café, pao -> pão, acucar -> açúcar
 */
export const autoAccent = (string) => {
  if (!string) return '';
  
  // Dicionário simples de palavras comuns sem acento -> com acento
  const accentMap = {
    'cafe': 'café',
    'pao': 'pão',
    'acucar': 'açúcar',
    'feijao': 'feijão',
    'leite': 'leite',
    'mamao': 'mamão',
    'limao': 'limão',
    'melao': 'melão',
    'coracao': 'coração',
    'irmao': 'irmão',
    'irmaos': 'irmãos',
    'aviao': 'avião',
    'camarao': 'camarão',
    'macarrao': 'macarrão',
    'sabado': 'sábado',
    'sabados': 'sábados',
    'sabia': 'sabía',
    'sabio': 'sábio',
    'sabios': 'sábios',
    'mae': 'mãe',
    'maes': 'mães',
    'voce': 'você',
    'voces': 'vocês',
    'ja': 'já',
    'ate': 'até',
    'oleo': 'óleo',
    'oleos': 'óleos',
    // Adicione mais conforme necessário
  };
  
  // Converte para minúscula e substitui cada palavra se estiver no dicionário
  return string.toLowerCase().split(' ').map(word => accentMap[word] || word).join(' ');
}; 