import React from 'react';
import { useApp } from '../context/AppContext';
import ItemRow from './ItemRow';
import ItemTableHeader from './ItemTableHeader';
import styles from '../styles/ItemTable.module.css';

const ItemTable = () => {
  const { state } = useApp();
  const { items, loading, error } = state;

  console.log('ItemTable - Estado atual:', { items, loading, error });

  if (loading) {
    return <div className={styles.loading}>Carregando itens...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!items || items.length === 0) {
    return <div className={styles.error}>Nenhum item encontrado.</div>;
  }

  return (
    <div className="item-table-container">
      <table className={styles.table}>
        <ItemTableHeader />
        <tbody>
          {items.map((item) => (
            <ItemRow key={item._id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable; 