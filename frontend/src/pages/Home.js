import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import ItemTable from '../components/ItemTable';
import NotificationModal from '../components/NotificationModal';
import ThreeDotsIcon from '../components/ui/ThreeDotsIcon';
import { useNotificationItems } from '../components/useNotificationItems';
import styles from '../styles/Home.module.css';
import buttonStyles from '../styles/buttons/index.module.css';

const Home = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const { state, fetchItems } = useApp();
  const { items } = state;
  const [showButtons, setShowButtons] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const modalShownRef = useRef(false);
  
  // Usar o hook para detectar itens com problemas
  const { lowStockItems, expiredItems } = useNotificationItems(items || []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    console.log('Carregando itens na página principal');
    fetchItems();
  }, [isAuthenticated, navigate, fetchItems]);

  // Efeito para mostrar o modal de notificação automaticamente
  useEffect(() => {
    const totalItemsWithProblems = lowStockItems.length + expiredItems.length;

    console.log('🔔 Verificando se deve mostrar modal de notificação:', {
      lowStockItems: lowStockItems.length,
      expiredItems: expiredItems.length,
      totalItemsWithProblems,
      showNotificationModal,
      modalShownRef: modalShownRef.current,
      itemsLoaded: items && items.length > 0
    });

    // Aguardar os itens serem carregados
    if (!items || items.length === 0) {
      console.log('⏳ Aguardando carregamento dos itens...');
      return;
    }

    // Se não há itens com problemas, resetar o estado
    if (totalItemsWithProblems === 0) {
      console.log('✅ Nenhum item com problemas detectado');
      modalShownRef.current = false;
      setShowNotificationModal(false);
      return;
    }

    // Se há itens com problemas e o modal não foi mostrado ainda
    if (totalItemsWithProblems > 0 && !modalShownRef.current && !showNotificationModal) {
      console.log('🚨 Mostrando modal de notificação para itens com problemas');
      modalShownRef.current = true;
      setShowNotificationModal(true);
      console.log('✅ Modal de notificação exibido');
    } else if (totalItemsWithProblems > 0 && modalShownRef.current && !showNotificationModal) {
      console.log('ℹ️ Modal já foi mostrado para este ciclo de itens');
    }
  }, [lowStockItems, expiredItems, showNotificationModal, items]);

  const handleLogout = () => {
    logout();
  };

  const handleAddNewItem = () => {
    navigate('/adicionar-item');
  };

  const handleRegister = () => {
    navigate('/notification-user-register');
  };

  const handleThreeDotsClick = () => {
    setShowButtons(!showButtons);
  };

  const handleCloseNotificationModal = () => {
    setShowNotificationModal(false);
    // Impede reabertura imediata
    modalShownRef.current = true;
    setTimeout(() => {
      modalShownRef.current = false;
    }, 2000);
  };

  return (
    <div className={styles.homeContainer}>
      <div className={`${styles.logoutCard} ${showButtons ? styles.expanded : ''}`} data-testid="logout-card">
        <div className={styles.cardHeader}>
          <ThreeDotsIcon 
            testId="three-dots-icon" 
            onClick={handleThreeDotsClick}
          />
        </div>
        {showButtons && (
          <div className={styles.cardButtons} data-testid="card-buttons">
            <button 
              className={`${buttonStyles.button} ${buttonStyles.register}`}
              onClick={handleRegister}
              data-testid="register-button"
            >
              Cadastrar Usuário
            </button>
            <button 
              className={`${buttonStyles.button} ${buttonStyles.logout}`}
              onClick={handleLogout}
              data-testid="logout-button"
            >
              Sair
            </button>
          </div>
        )}
      </div>
      
      <div className={styles.header}>
        <h1>Controle de Despensa</h1>
      </div>
      <div className={styles.content}>
        <ItemTable />
        <div className={buttonStyles.formButtons} data-testid="form-buttons">
          <button 
            className={`${buttonStyles.button} ${buttonStyles.add}`}
            onClick={handleAddNewItem}
            data-testid="add-button"
          >
            Adicionar Novo Item
          </button>
        </div>
      </div>

      {/* Modal de Notificação */}
      {showNotificationModal && (
        <NotificationModal
          lowStockItems={lowStockItems}
          expiredItems={expiredItems}
          onClose={handleCloseNotificationModal}
        />
      )}
    </div>
  );
};

export default Home;