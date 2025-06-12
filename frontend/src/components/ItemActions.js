import React from 'react';
import { useApp } from '../context/AppContext';
import styles from '../styles/buttons/index.module.css';

const ItemActions = ({ itemId }) => {
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

  return (
    <div className={styles.buttonContainer}>
      <button 
        className={`${styles.button} ${styles.danger}`} 
        onClick={handleDelete}
      >
        Excluir
      </button>
    </div>
  );
};

export default ItemActions; 