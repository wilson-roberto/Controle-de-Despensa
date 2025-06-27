import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/index';

// Suprimir warnings do React Router v6 em ambiente de teste
if (process.env.NODE_ENV === 'test') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0]?.includes?.('React Router Future Flag Warning') ||
      args[0]?.includes?.('v7_startTransition') ||
      args[0]?.includes?.('v7_relativeSplatPath')
    ) {
      return;
    }
    originalWarn(...args);
  };
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 