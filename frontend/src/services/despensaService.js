import api from './api';

// Serviço para gerenciar os itens da despensa
const DespensaService = {
  // Buscar todos os itens
  getAllItems: async () => {
    try {
      const response = await api.get('/items');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      throw error;
    }
  },

  // Buscar um item específico
  getItem: async (id) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar item:', error);
      throw error;
    }
  },

  // Criar um novo item
  createItem: async (itemData) => {
    try {
      const response = await api.post('/items', itemData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar item:', error);
      throw error;
    }
  },

  // Atualizar um item
  updateItem: async (id, itemData) => {
    try {
      const response = await api.put(`/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      throw error;
    }
  },

  // Deletar um item
  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      throw error;
    }
  }
};

export default DespensaService; 