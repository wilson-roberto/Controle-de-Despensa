import { useMemo } from 'react';
import { isStockLow, isExpired } from './ItemStatus';

export function useNotificationItems(items = []) {
  return useMemo(() => {
    // Filtrar baixo estoque
    const lowStock = items.filter(isStockLow);

    // Filtrar validade próxima
    const expired = items.filter(isExpired);

    // Evitar duplicidade: remover do lowStock os que já estão em expired
    const expiredIds = new Set(expired.map(item => item._id));
    const onlyLowStock = lowStock.filter(item => !expiredIds.has(item._id));

    return {
      lowStockItems: onlyLowStock,
      expiredItems: expired
    };
  }, [items]);
} 