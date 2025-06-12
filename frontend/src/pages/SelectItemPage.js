import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import styles from '../styles/SelectItemPage.module.css';
import buttonStyles from '../styles/buttons/index.module.css';

function SelectItemPage() {
  const navigate = useNavigate();
  const { state, fetchItems } = useApp();
  const { items, loading, error } = state;
  const [selectedItemId, setSelectedItemId] = useState('');

  useEffect(() => {
    console.log('SelectItemPage - Iniciando carregamento de itens...');
    console.log('Estado inicial:', { items, loading, error });
    
    const loadItems = async () => {
      try {
        console.log('Chamando fetchItems...');
        await fetchItems();
        console.log('fetchItems concluído');
      } catch (err) {
        console.error('Erro ao carregar itens:', err);
      }
    };
    loadItems();
  }, [fetchItems]);

  useEffect(() => {
    console.log('SelectItemPage - Estado atual:', {
      items: items,
      itemsLength: items?.length,
      loading: loading,
      error: error,
      itemsIsArray: Array.isArray(items),
      firstItem: items?.[0],
      itemsType: typeof items
    });
  }, [items, loading, error]);

  const handleItemSelect = (e) => {
    const itemId = e.target.value;
    console.log('Item selecionado - ID:', itemId);
    setSelectedItemId(itemId);
    if (itemId) {
      const selectedItem = items.find(item => item._id === itemId);
      console.log('Item encontrado:', selectedItem);
      if (selectedItem) {
        console.log('Navegando para editar item:', selectedItem._id);
        navigate(`/editar-item/${selectedItem._id}`);
      } else {
        console.error('Item não encontrado:', itemId);
      }
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className={styles.selectItemPage}>
        <div className={styles.loadingContainer}>
          <h2>Carregando itens...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.selectItemPage}>
        <div className={styles.errorContainer}>
          <h2>Erro ao carregar itens</h2>
          <p>{error}</p>
          <button onClick={() => fetchItems()} className={`${buttonStyles.button} ${buttonStyles.primary}`}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.selectItemPage}>
      <h3>Selecione um item para editar</h3>
      {items && items.length > 0 ? (
        <div className={styles.selectContainer}>
          <select
            value={selectedItemId}
            onChange={handleItemSelect}
            className={styles.select}
          >
            <option value="">Selecione um item</option>
            {items.map(item => (
              <option key={item._id} value={item._id}>
                {item.nome} - Estoque: {item.totalEstoque} {item.unidade}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>Nenhum item cadastrado</p>
      )}
      <div className={buttonStyles.buttonContainer}>
        <button onClick={handleCancel} className={`${buttonStyles.button} ${buttonStyles.cancel}`}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default SelectItemPage; 