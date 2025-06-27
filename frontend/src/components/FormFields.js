import React from 'react';
import ItemDatalist from './ItemDatalist';
import UnidadesDatalist from './UnidadesDatalist';
import DatePickerField from './DatePickerField';
import NumberInputField from './NumberInputField';
import gridStyles from './InputGrid.module.css';

const FormFields = ({ formData, handleInputChange, items }) => {
  // console.log('FormFields - Items recebidos:', items); // Debug removido

  const handleMouseOver = (e) => {
    e.target.select();
  };

  return (
    <>
      <div className={gridStyles.inputGrid}>
        <div className={gridStyles.inputGroup}>
          <label htmlFor="nome">Item</label>
          <div className="input-with-datalist">
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="text-input"
              list="items-list"
              required
              placeholder="Digite o item ou selecione na seta ao lado."
            />
            <ItemDatalist items={items || []} />
          </div>
        </div>

        <div className={gridStyles.inputGroup}>
          <label htmlFor="unidade">Unidade</label>
          <div className="input-with-datalist">
            <input
              type="text"
              id="unidade"
              name="unidade"
              value={formData.unidade}
              onChange={handleInputChange}
              className="text-input"
              list="unidades-list"
              placeholder="Digite a unidade ou selecione na seta ao lado."
            />
            <UnidadesDatalist />
          </div>
        </div>
      </div>

      <div className={gridStyles.inputGrid}>
        <NumberInputField
          id="quantidadeEntrada"
          label="Entrada"
          name="quantidadeEntrada"
          value={formData.quantidadeEntrada}
          onChange={handleInputChange}
          onMouseOver={handleMouseOver}
          placeholder="Digite números inteiros ou selecione na seta ao lado."
        />

        <NumberInputField
          id="quantidadeSaida"
          label="Saída"
          name="quantidadeSaida"
          value={formData.quantidadeSaida}
          onChange={handleInputChange}
          onMouseOver={handleMouseOver}
          placeholder="Digite números inteiros ou selecione na seta ao lado."
        />
      </div>

      <div className={gridStyles.inputGrid}>
        <NumberInputField
          id="totalEstoque"
          label="Estoque"
          name="totalEstoque"
          value={formData.totalEstoque}
          readOnly={true}
          placeholder="Não preencher. Preenchimento automático."
        />

        <DatePickerField
          id="dataValidade"
          label="Validade"
          name="dataValidade"
          value={formData.dataValidade}
          onChange={handleInputChange}
        />
      </div>

      <div className={gridStyles.inputGrid}>
        <NumberInputField
          id="limiteEstoque"
          label="Limite de Estoque"
          name="limiteEstoque"
          value={formData.limiteEstoque}
          onChange={handleInputChange}
          onMouseOver={handleMouseOver}
          placeholder="Digite números inteiros ou selecione na seta ao lado."
        />
      </div>
    </>
  );
};

export default FormFields; 