import React from 'react';
import styles from '../styles/ItemTable.module.css';

const ItemTableHeader = () => {
  return (
    <thead>
      <tr>
        <th className={styles.tableHeader}>Item</th>
        <th className={styles.tableHeader}>Unidade</th>
        <th className={styles.tableHeader}>Entrada</th>
        <th className={styles.tableHeader}>Saída</th>
        <th className={styles.tableHeader}>Estoque</th>
        <th className={styles.tableHeader}>Validade</th>
        <th className={styles.tableHeader}>Limite</th>
        <th className={styles.tableHeader}>Ações</th>
      </tr>
    </thead>
  );
};

export default ItemTableHeader; 