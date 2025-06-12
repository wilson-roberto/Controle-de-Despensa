import React from 'react';
import ItemDatalist from './ItemDatalist';
import UnidadesDatalist from './UnidadesDatalist';
import DatePickerField from './DatePickerField';
import NumberInputField from './NumberInputField';
import gridStyles from './InputGrid.module.css';
import numberStyles from './NumberInput.module.css';

const FormFields = ({ formData, handleInputChange, handleWhatsAppChange, items }) => {
  console.log('FormFields - Items recebidos:', items); // Debug

  const handleMouseOver = (e) => {
    e.target.select();
  };

  return (
    <>
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

        <DatePickerField
          id="dataUltimaEntrada"
          label="Data Última Entrada"
          name="dataUltimaEntrada"
          value={formData.dataUltimaEntrada}
          onChange={handleInputChange}
        />
      </div>

      <div className={gridStyles.inputGrid}>
        <NumberInputField
          id="quantidadeSaida"
          label="Saída"
          name="quantidadeSaida"
          value={formData.quantidadeSaida}
          onChange={handleInputChange}
          onMouseOver={handleMouseOver}
          placeholder="Digite números inteiros ou selecione na seta ao lado."
        />

        <DatePickerField
          id="dataUltimaSaida"
          label="Data Última Saída"
          name="dataUltimaSaida"
          value={formData.dataUltimaSaida}
          onChange={handleInputChange}
        />
      </div>

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

      <NumberInputField
        id="limiteEstoque"
        label="Limite de Estoque"
        name="limiteEstoque"
        value={formData.limiteEstoque}
        onChange={handleInputChange}
        onMouseOver={handleMouseOver}
        className={gridStyles.centeredInput}
        placeholder="Digite números inteiros ou selecione na seta ao lado."
      />

      <div className={gridStyles.inputGroup}>
        <label htmlFor="whatsapp">WhatsApp</label>
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleWhatsAppChange}
          className="text-input"
          placeholder="(99) 99999-9999, (99) 99999-9999, ..."
          title="Digite os números separados por vírgula"
        />
      </div>
    </>
  );
};

export default FormFields; 