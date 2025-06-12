export const isStockLow = (item) => {
  return Number(item.totalEstoque) <= Number(item.limiteEstoque);
};

export const isExpired = (item) => {
  if (!item.dataValidade) return false;
  
  const dataValidade = new Date(item.dataValidade);
  const hoje = new Date();
  
  const diffTime = dataValidade - hoje;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 7;
};

export const getItemStatus = (item) => {
  const stockLow = isStockLow(item);
  const expired = isExpired(item);
  
  if (stockLow && expired) return 'low-stock expired';
  if (stockLow) return 'low-stock';
  if (expired) return 'expired';
  return '';
}; 