import React from 'react';
import { formatDate } from '../utils/itemUtils';
import { getItemStatus } from './ItemStatus';
import ItemActions from './ItemActions';
import styles from '../styles/ItemTable.module.css';

const ItemRow = ({ item }) => {
  const status = getItemStatus(item);

  return (
    <tr key={item._id} className={`${styles.tableRow} ${status}`}>
      <td className={styles.tableCell}>{item.nome}</td>
      <td className={styles.tableCell}>{item.unidade}</td>
      <td className={`${styles.tableCell} ${styles.numberCell}`}>{item.quantidadeEntrada}</td>
      <td className={`${styles.tableCell} ${styles.numberCell}`}>{item.quantidadeSaida}</td>
      <td className={`${styles.tableCell} ${styles.numberCell}`}>{item.totalEstoque}</td>
      <td className={styles.tableCell}>{formatDate(item.dataValidade)}</td>
      <td className={`${styles.tableCell} ${styles.numberCell}`}>{item.limiteEstoque}</td>
      <td className={styles.actionsCell}>
        <ItemActions itemId={item._id} />
      </td>
    </tr>
  );
};

export default ItemRow; 