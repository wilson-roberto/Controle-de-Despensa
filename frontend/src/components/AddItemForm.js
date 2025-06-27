import React from 'react';
import { useApp } from '../context/AppContext';
import styles from '../styles/AddItemForm.module.css';
import { useFormValidation } from '../hooks/useFormValidation';
import { useFormState } from '../hooks/useFormState';
import { useFormSubmission } from '../hooks/useFormSubmission';
import FormFields from './FormFields';
import FormButtons from './FormButtons';

const AddItemForm = ({ onCancel }) => {
  const { state, addItem, updateItem } = useApp();
  const { editingItem, items } = state;
  
  const { formData, handleInputChange, resetForm } = useFormState(editingItem);
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