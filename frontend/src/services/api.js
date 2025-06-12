import axios from 'axios';

console.log('Valor de process.env.REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api`
    : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se for um erro de autenticação
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isLoginPage = currentPath === '/login';
      const isItemOperation = error.config?.url?.includes('/items/');
      const isUpdateOperation = error.config?.method === 'put' || error.config?.method === 'patch';
      const isFormOperation = error.config?.url?.includes('/form/');
      const isMainForm = currentPath === '/';
      
      // Só redireciona se:
      // 1. Não estiver na página de login
      // 2. Não for uma operação de item
      // 3. Não for uma operação de atualização
      // 4. Não for uma operação de formulário
      // 5. Não estiver no formulário principal
      if (!isLoginPage && !isItemOperation && !isUpdateOperation && !isFormOperation && !isMainForm) {
        // Limpa o token
        localStorage.removeItem('token');
        // Redireciona para login
        window.location.href = '/login';
      }
    }
    
    // Sempre rejeita o erro para que possa ser tratado pelo componente
    return Promise.reject(error);
  }
);

export default api; 