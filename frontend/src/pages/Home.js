import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import ItemTable from '../components/ItemTable';
import styles from '../styles/Home.module.css';
import buttonStyles from '../styles/buttons/index.module.css';

const Home = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const { items, fetchItems } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    console.log('Carregando itens na página principal');
    fetchItems();
  }, [isAuthenticated, navigate, fetchItems]);

  const handleLogout = () => {
    logout();
  };

  const handleEditClick = () => {
    navigate('/selecionar-item');
  };

  const handleAddNewItem = () => {
    navigate('/adicionar-item');
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <h1>Controle de Despensa</h1>
      </div>
      <div className={styles.content}>
        <ItemTable />
        <div className={buttonStyles.formButtons}>
          <button 
            className={`${buttonStyles.button} ${buttonStyles.add}`}
            onClick={handleAddNewItem}
          >
            Adicionar Novo Item
          </button>
          <button 
            className={`${buttonStyles.button} ${buttonStyles.edit}`}
            onClick={handleEditClick}
          >
            Editar Item
          </button>
          <button 
            className={`${buttonStyles.button} ${buttonStyles.logout}`}
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 