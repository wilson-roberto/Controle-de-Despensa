import React, { useState, useEffect } from 'react';
import DespensaService from '../services/despensaService';
import styles from './ItemList.module.css';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await DespensaService.getAllItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar itens. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await DespensaService.deleteItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError('Erro ao deletar item. Por favor, tente novamente.');
      console.error(err);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="item-list">
      <h2>Itens na Despensa</h2>
      {items.length === 0 ? (
        <p>Nenhum item encontrado.</p>
      ) : (
        <ul>
          {Array.isArray(items) && items.map(item => (
            <li key={item.id}>
              <div className="item-details">
                <span>{item.nome}</span>
                <span>{item.unidade}</span>
                <span>{item.totalEstoque}</span>
                <span>{item.dataValidade ? formatDate(item.dataValidade) : '-'}</span>
              </div>
              <button onClick={() => handleDelete(item.id)}>Deletar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemList; 