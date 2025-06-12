import React from 'react';
import Button from './ui/Button';
import styles from '../styles/buttons/index.module.css';

const FormButtons = ({ isSubmitting, onReset, onCancel, isEditing }) => {
  return (
    <div className={styles.formButtons}>
      <Button 
        type="submit" 
        className="btn-add"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processando...' : (isEditing ? 'Atualizar' : 'Adicionar')}
      </Button>
      <Button 
        type="button" 
        onClick={onReset} 
        className="btn-clear"
        disabled={isSubmitting}
      >
        Limpar Campos
      </Button>
      <Button 
        type="button" 
        onClick={onCancel} 
        className="danger"
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
    </div>
  );
};

export default FormButtons; 