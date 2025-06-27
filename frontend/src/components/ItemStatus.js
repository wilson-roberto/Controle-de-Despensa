export const isStockLow = (item) => {
  if (!item || typeof item.totalEstoque === 'undefined' || typeof item.limiteEstoque === 'undefined') {
    console.warn('Item inválido para verificação de estoque baixo:', item);
    return false;
  }
  
  const totalEstoque = Number(item.totalEstoque);
  const limiteEstoque = Number(item.limiteEstoque);
  
  // Verificar se o estoque está baixo E se não foi notificado
  const isLow = totalEstoque <= limiteEstoque && !item.notificadoEstoque;
  
  if (totalEstoque <= limiteEstoque) {
    if (isLow) {
      console.log(`📉 Estoque baixo detectado (não notificado): ${item.nome} - ${totalEstoque} <= ${limiteEstoque}`);
    } else {
      console.log(`📉 Estoque baixo mas já notificado: ${item.nome} - ${totalEstoque} <= ${limiteEstoque}`);
    }
  }
  
  return isLow;
};

export const isExpired = (item) => {
  if (!item || !item.dataValidade) {
    return false;
  }
  
  try {
    const dataValidade = new Date(item.dataValidade);
    const hoje = new Date();
    
    // Resetar horas para comparar apenas as datas
    hoje.setHours(0, 0, 0, 0);
    dataValidade.setHours(0, 0, 0, 0);
    
    const diffTime = dataValidade - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Verificar se a validade está próxima E se não foi notificado
    const isExp = diffDays <= 15 && !item.notificadoValidade;
    
    if (diffDays <= 15) {
      if (isExp) {
        console.log(`⏰ Validade próxima detectada (não notificado): ${item.nome} - ${item.dataValidade} (${diffDays} dias)`);
      } else {
        console.log(`⏰ Validade próxima mas já notificado: ${item.nome} - ${item.dataValidade} (${diffDays} dias)`);
      }
    }
    
    return isExp;
  } catch (error) {
    console.error('Erro ao verificar validade do item:', item.nome, error);
    return false;
  }
};

export const getItemStatus = (item) => {
  const stockLow = isStockLow(item);
  const expired = isExpired(item);
  
  if (stockLow && expired) return 'low-stock expired';
  if (stockLow) return 'low-stock';
  if (expired) return 'expired';
  return '';
}; 