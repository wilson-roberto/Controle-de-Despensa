import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddItemForm from '../components/AddItemForm';
import styles from '../styles/AddItemPage.module.css';

function AddItemPage() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className={styles.addItemPage}>
      <h1 className={styles.title}>Adicionar Novo Item</h1>
      <AddItemForm onCancel={handleCancel} />
    </div>
  );
}

export default AddItemPage; 