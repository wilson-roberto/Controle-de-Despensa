import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import styles from '../styles/buttons/index.module.css';

const ItemActions = ({ itemId }) => {
  const navigate = useNavigate();
  const { deleteItem } = useApp();

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        console.log(`Iniciando exclusão do item com ID: ${itemId}`);
        await deleteItem(itemId);
        console.log(`Item com ID ${itemId} excluído com sucesso`);
      } catch (error) {
        console.error(`Erro ao excluir item com ID ${itemId}:`, error);
        alert(`Erro ao excluir item: ${error.message}`);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/editar-item/${itemId}`);
  };

  return (
    <div className={styles.buttonContainer}>
      <button 
        className={`${styles.button} ${styles.edit}`} 
        onClick={handleEdit}
        data-testid="edit-item-button"
      >
        Editar
      </button>
      <button 
        className={`${styles.button} ${styles.danger}`} 
        onClick={handleDelete}
        data-testid="delete-item-button"
      >
        Excluir
      </button>
    </div>
  );
};

export default ItemActions; 