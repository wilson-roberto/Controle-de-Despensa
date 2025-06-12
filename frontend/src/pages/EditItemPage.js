import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AddItemForm from '../components/AddItemForm';
import styles from '../styles/EditItemPage.module.css';

function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItemById, setEditingItem, state } = useApp();

  useEffect(() => {
    const item = getItemById(id);
    if (item) {
      setEditingItem(item);
    } else {
      navigate('/');
    }
  }, [id, getItemById, setEditingItem, navigate]);

  const handleCancel = () => {
    setEditingItem(null);
    navigate('/');
  };

  return (
    <div className={styles.editItemPage}>
      <h1 className={styles.title}>Editar Item</h1>
      {state.editingItem ? (
        <AddItemForm onCancel={handleCancel} />
      ) : (
        <div className={styles.loading}>Carregando item...</div>
      )}
    </div>
  );
}

export default EditItemPage; 