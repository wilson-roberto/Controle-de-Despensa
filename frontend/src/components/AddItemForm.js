import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/AddItemForm.module.css';
import { useFormValidation } from '../hooks/useFormValidation';
import { useFormState } from '../hooks/useFormState';
import { useFormSubmission } from '../hooks/useFormSubmission';
import FormFields from './FormFields';
import FormButtons from './FormButtons';

const AddItemForm = ({ onCancel }) => {
  const navigate = useNavigate();
  const { state, addItem, updateItem } = useApp();
  const { editingItem, items } = state;
  const { isAuthenticated } = useAuth();
  
  const { formData, handleInputChange, handleWhatsAppChange, resetForm } = useFormState(editingItem);
  const { error: validationError, validateForm } = useFormValidation(formData, items);
  const { isSubmitting, error: submissionError, handleSubmit } = useFormSubmission({
    formData,
    editingItem,
    updateItem,
    addItem,
    onCancel,
    validateForm,
    resetForm
  });

  return (
    <form onSubmit={handleSubmit} className={styles.addItemForm}>
      <div className={styles.formContainer}>
        {(validationError || submissionError) && (
          <div className={styles.errorMessage}>
            {validationError || submissionError}
          </div>
        )}
        
        <FormFields 
          formData={formData}
          handleInputChange={handleInputChange}
          handleWhatsAppChange={handleWhatsAppChange}
          items={items}
        />

        <FormButtons
          isSubmitting={isSubmitting}
          onReset={resetForm}
          onCancel={onCancel}
          isEditing={!!editingItem}
        />
      </div>
    </form>
  );
};

export default AddItemForm; 