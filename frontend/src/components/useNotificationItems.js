import { useMemo } from 'react';
import { isStockLow, isExpired } from './ItemStatus';

export function useNotificationItems(items = []) {
  return useMemo(() => {
    // Garantir que items seja sempre um array válido
    const validItems = Array.isArray(items) ? items : [];
    
    console.log('🔍 useNotificationItems: Analisando', validItems.length, 'itens');
    
    // Log detalhado de cada item para debug
    validItems.forEach(item => {
      console.log(`📋 Item: ${item.nome}`);
      console.log(`   - Estoque: ${item.totalEstoque}/${item.limiteEstoque}`);
      console.log(`   - Validade: ${item.dataValidade}`);
      console.log(`   - Notificado estoque: ${item.notificadoEstoque}`);
      console.log(`   - Notificado validade: ${item.notificadoValidade}`);
    });
    
    // Filtrar baixo estoque
    const lowStock = validItems.filter(item => {
      const isLow = isStockLow(item);
      if (isLow) {
        console.log(`📉 Item com estoque baixo: ${item.nome} (${item.totalEstoque}/${item.limiteEstoque})`);
      }
      return isLow;
    });

    // Filtrar validade próxima
    const expired = validItems.filter(item => {
      const isExp = isExpired(item);
      if (isExp) {
        console.log(`⏰ Item com validade próxima: ${item.nome} (${item.dataValidade})`);
      }
      return isExp;
    });

    // Evitar duplicidade: remover do lowStock os que já estão em expired
    const expiredIds = new Set(expired.map(item => item._id));
    const onlyLowStock = lowStock.filter(item => !expiredIds.has(item._id));

    const result = {
      lowStockItems: onlyLowStock,
      expiredItems: expired
    };

    console.log('📊 Resultado da análise:', {
      totalItems: validItems.length,
      lowStockItems: onlyLowStock.length,
      expiredItems: expired.length,
      totalWithProblems: onlyLowStock.length + expired.length
    });

    // Log detalhado dos itens com problemas
    if (onlyLowStock.length > 0) {
      console.log('📉 Itens com estoque baixo:');
      onlyLowStock.forEach(item => {
        console.log(`   - ${item.nome}: ${item.totalEstoque}/${item.limiteEstoque} ${item.unidade}`);
      });
    }

    if (expired.length > 0) {
      console.log('⏰ Itens com validade próxima:');
      expired.forEach(item => {
        console.log(`   - ${item.nome}: ${item.dataValidade}`);
      });
    }

    return result;
  }, [items]);
} 