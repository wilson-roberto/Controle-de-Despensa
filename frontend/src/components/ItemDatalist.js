import React from 'react';

const ItemDatalist = ({ items }) => {
  return (
    <datalist id="items-list">
      {Array.isArray(items) && items.map(item => (
        <option key={item._id} value={item.nome} />
      ))}
    </datalist>
  );
};

export default ItemDatalist; 