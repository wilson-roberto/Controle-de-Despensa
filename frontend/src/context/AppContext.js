import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { API_URL } from '../config/api';
import { useAuth } from './AuthContext';
import api from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState({
    items: [],
    editingItem: null,
    loading: false,
    error: null,
    lowStockItems: [], // Lista de IDs de itens com estoque baixo
    expiredItems: [], // Lista de IDs de itens com data de validade próxima ou expirada
    notifiedItems: new Set() // Conjunto de IDs de itens já notificados
  });

  const fetchItems = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('Usuário não autenticado, pulando fetchItems');
      return;
    }

    try {
      console.log('Executando fetchItems() para carregar itens do banco de dados');
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const token = localStorage.getItem('token');
      console.log('Token de autenticação:', token ? 'Presente' : 'Ausente');
      
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${API_URL}/items`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Resposta da API:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro na resposta da API:', errorData);
        throw new Error(errorData.message || `Falha ao carregar itens: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados recebidos da API:', data);

      if (!Array.isArray(data)) {
        console.error('Dados recebidos não são um array:', data);
        throw new Error('Formato de dados inválido: a resposta não é um array');
      }

      if (data.length === 0) {
        console.log('Nenhum item encontrado no banco de dados');
      }

      // Identificar itens com estoque baixo
      const lowStockItems = data
        .filter(item => {
          const itemId = item._id || item.id;
          const estoque = Number(item.totalEstoque);
          const limite = Number(item.limiteEstoque);
          const isLow = estoque <= limite;
          return isLow;
        })
        .map(item => item._id || item.id);

      // Identificar itens com data de validade próxima ou expirada
      const expiredItems = data
        .filter(item => {
          if (!item.dataValidade) return false;
          const dataValidade = new Date(item.dataValidade);
          const hoje = new Date();
          const diffTime = dataValidade - hoje;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        })
        .map(item => item._id || item.id);

      console.log('Atualizando estado com:', {
        itemsCount: data.length,
        lowStockItemsCount: lowStockItems.length,
        expiredItemsCount: expiredItems.length
      });

      setState(prev => ({
        ...prev,
        items: data,
        lowStockItems,
        expiredItems,
        loading: false,
        error: null
      }));

    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro desconhecido ao carregar itens',
        loading: false
      }));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    console.log('Iniciando AppProvider e chamando fetchItems()');
    if (isAuthenticated) {
      fetchItems();
    }
  }, [fetchItems, isAuthenticated]);

  const addItem = useCallback(async (itemData) => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    try {
      console.log('Iniciando adição de item:', itemData);
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      if (!itemData.nome) {
        throw new Error('O item é obrigatório');
      }
      
      const quantidadeEntrada = Number(itemData.quantidadeEntrada || 0);
      const quantidadeSaida = Number(itemData.quantidadeSaida || 0);
      const totalEstoque = Math.floor(quantidadeEntrada - quantidadeSaida);
      
      const updatedItemData = {
        ...itemData,
        totalEstoque: totalEstoque
      };
      
      const response = await api.post('/items', updatedItemData);
      const newItem = response.data;
      
      console.log('Item adicionado com sucesso:', newItem);

      setState(prev => ({
        ...prev,
        items: [...prev.items, newItem],
        loading: false
      }));
      
      return newItem;
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      setState(prev => ({
        ...prev,
        error: (error.response && error.response.data && error.response.data.message)
          ? `Erro detalhado: ${error.response.data.message}`
          : error.message || 'Erro desconhecido ao adicionar item',
        loading: false
      }));
      if (error.response) {
        console.error('Detalhes do erro na resposta da API:', error.response.data);
      }
      throw error;
    }
  }, [isAuthenticated]);

  const updateItem = useCallback(async (itemData) => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    try {
      console.log('Iniciando atualização de item:', itemData);
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      if (!itemData._id) {
        throw new Error('ID do item é obrigatório para atualização');
      }
      
      const quantidadeEntrada = Number(itemData.quantidadeEntrada || 0);
      const quantidadeSaida = Number(itemData.quantidadeSaida || 0);
      const totalEstoque = Math.floor(quantidadeEntrada - quantidadeSaida);
      
      const updatedItemData = {
        ...itemData,
        totalEstoque: totalEstoque
      };
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/items/${itemData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(updatedItemData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao atualizar item');
      }

      const updatedItem = await response.json();
      console.log('Item atualizado com sucesso:', updatedItem);

      setState(prev => ({
        ...prev,
        items: Array.isArray(prev.items) ? prev.items.map(item => 
          item._id === updatedItem._id ? updatedItem : item
        ) : [],
        editingItem: null,
        loading: false
      }));
      
      return updatedItem;
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
      throw error;
    }
  }, [isAuthenticated]);

  const deleteItem = useCallback(async (itemId) => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    try {
      console.log(`Tentando excluir item com ID: ${itemId}`);
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      await api.delete(`/items/${itemId}`);

      console.log(`Item com ID ${itemId} excluído com sucesso`);
      
      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => item._id !== itemId),
        loading: false
      }));
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      setState(prev => ({
        ...prev,
        error: (error.response && error.response.data && error.response.data.message)
          ? `Erro detalhado: ${error.response.data.message}`
          : error.message || 'Erro desconhecido ao excluir item',
        loading: false
      }));
      if (error.response) {
        console.error('Detalhes do erro na resposta da API:', error.response.data);
      }
      throw error;
    }
  }, [isAuthenticated]);

  const getItemById = useCallback((itemId) => {
    return state.items.find(item => item._id === itemId);
  }, [state.items]);

  const setEditingItem = useCallback((item) => {
    setState(prev => ({
      ...prev,
      editingItem: item
    }));
  }, []);

  // Marcar um item como notificado
  const markItemAsNotified = useCallback(async (itemId, type) => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    try {
      console.log(`Marcando item como notificado: ${itemId}, tipo: ${type}`);
      
      // Buscar o item atual
      const item = state.items.find(i => (i._id || i.id) === itemId);
      if (!item) {
        throw new Error('Item não encontrado');
      }

      // Determinar qual campo de notificação atualizar
      const updateData = {
        ...item,
        dataUltimaNotificacao: new Date()
      };

      if (type === 'estoque') {
        updateData.notificadoEstoque = true;
      } else if (type === 'validade') {
        updateData.notificadoValidade = true;
      }

      // Atualizar o item no banco de dados
      const response = await api.patch(`/items/${itemId}`, updateData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao marcar item como notificado');
      }

      const updatedItem = await response.json();

      // Atualizar o estado local
      setState(prev => {
        const updatedItems = Array.isArray(prev.items) 
          ? prev.items.map(i => i._id === itemId ? { ...i, ...updatedItem } : i)
          : [];
        
        return {
          ...prev,
          items: updatedItems
        };
      });

      console.log('Item marcado como notificado com sucesso:', itemId);
      return true;
    } catch (error) {
      console.error('Erro ao marcar item como notificado:', error);
      throw error;
    }
  }, [isAuthenticated, state.items]);

  // Verificar se um item precisa de notificação
  const checkItemNotification = useCallback((item) => {
    if (!item) return false;

    // Verificar estoque baixo
    const estoque = Number(item.totalEstoque);
    const limite = Number(item.limiteEstoque);
    const isLowStock = estoque <= limite && !item.notificadoEstoque;

    // Verificar validade
    let isExpired = false;
    if (item.dataValidade) {
      const dataValidade = new Date(item.dataValidade);
      const hoje = new Date();
      const diffTime = dataValidade - hoje;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      isExpired = diffDays <= 7 && !item.notificadoValidade;
    }

    return isLowStock || isExpired;
  }, []);

  // Verificar se um item está com estoque baixo e não foi notificado
  const isItemLowStock = useCallback((itemId) => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    const item = state.items.find(i => (i._id || i.id) === itemId);
    if (!item) return false;

    const estoque = Number(item.totalEstoque);
    const limite = Number(item.limiteEstoque);
    const isLow = estoque <= limite;
    return isLow && !item.notificadoEstoque;
  }, [isAuthenticated, state.items]);

  // Verificar se um item está com data de validade próxima ou expirada e não foi notificado
  const isItemExpired = useCallback((itemId) => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    const item = state.items.find(i => (i._id || i.id) === itemId);
    if (!item || !item.dataValidade) return false;

    const dataValidade = new Date(item.dataValidade);
    const hoje = new Date();
    const diffTime = dataValidade - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 7 && !item.notificadoValidade;
  }, [isAuthenticated, state.items]);

  // Resetar notificação de um item
  const resetItemNotification = useCallback(async (itemId) => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    try {
      console.log('Resetando notificação para o item:', itemId);
      
      // Buscar o item atual
      const item = state.items.find(i => (i._id || i.id) === itemId);
      if (!item) {
        throw new Error('Item não encontrado');
      }

      // Atualizar o item no banco de dados
      const response = await api.put(`/items/${itemId}`, {
        ...item,
        notificadoEstoque: false,
        notificadoValidade: false
      });

      if (!response.ok) {
        throw new Error('Erro ao resetar notificação do item');
      }

      const updatedItem = await response.json();

      // Atualizar o estado local
      setState(prev => ({
        ...prev,
        items: Array.isArray(prev.items) ? prev.items.map(i => 
          i._id === itemId ? updatedItem : i
        ) : [],
      }));

      console.log('Notificação do item resetada com sucesso:', itemId);
      return true;
    } catch (error) {
      console.error('Erro ao resetar notificação do item:', error);
      throw error;
    }
  }, [isAuthenticated]);

  const value = {
    state,
    setState,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    setEditingItem,
    markItemAsNotified,
    checkItemNotification,
    isItemLowStock,
    isItemExpired,
    resetItemNotification,
    setItems: items => setState(prev => ({ ...prev, items }))
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 