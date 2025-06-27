import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Home from '../pages/Home';
import AddItemPage from '../pages/AddItemPage';
import EditItemPage from '../pages/EditItemPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotificationUserRegister from '../pages/NotificationUserRegister';
import NotFound from '../pages/NotFound';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirecionar para login se não estiver autenticado
      return;
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/" replace /> : <Register />
      } />
      <Route path="/notification-user-register" element={
        <ProtectedRoute>
          <NotificationUserRegister />
        </ProtectedRoute>
      } />
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/adicionar-item" element={
        <ProtectedRoute>
          <AddItemPage />
        </ProtectedRoute>
      } />
      <Route path="/editar-item/:id" element={
        <ProtectedRoute>
          <EditItemPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 