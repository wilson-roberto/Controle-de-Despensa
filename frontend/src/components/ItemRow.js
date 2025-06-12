import React from 'react';
import { formatDate } from '../utils/itemUtils';
import { formatWhatsAppNumber } from './ItemFormatters';
import { getItemStatus } from './ItemStatus';
import ItemActions from './ItemActions';

const ItemRow = ({ item }) => {
  const status = getItemStatus(item);

  return (
    <tr key={item._id} className={status}>
      <td>{item.nome}</td>
      <td>{item.unidade}</td>
      <td className="number-cell">{item.quantidadeEntrada}</td>
      <td>{formatDate(item.dataUltimaEntrada)}</td>
      <td className="number-cell">{item.quantidadeSaida}</td>
      <td>{formatDate(item.dataUltimaSaida)}</td>
      <td className="number-cell">{item.totalEstoque}</td>
      <td>{formatDate(item.dataValidade)}</td>
      <td className="number-cell">{item.limiteEstoque}</td>
      <td>
        {Array.isArray(item.whatsapp) ? (
          <div className="whatsapp-list">
            {item.whatsapp.map((num, index) => (
              <div key={index} className="whatsapp-number">
                {formatWhatsAppNumber(num)}
              </div>
            ))}
          </div>
        ) : (
          formatWhatsAppNumber(item.whatsapp)
        )}
      </td>
      <td>
        <ItemActions itemId={item._id} />
      </td>
    </tr>
  );
};

export default ItemRow; 