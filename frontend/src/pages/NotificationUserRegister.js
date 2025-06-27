import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';
import api from '../services/api';

const NotificationUserRegister = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validações
  const validateFullName = useCallback((fullName) => {
    const trimmed = fullName.trim();
    if (!trimmed) return ['Nome completo é obrigatório'];
    
    const errors = [];
    if (trimmed.length < 2) {
      errors.push('Nome completo deve ter no mínimo 2 caracteres');
    }
    if (trimmed.length > 100) {
      errors.push('Nome completo deve ter no máximo 100 caracteres');
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed)) {
      errors.push('Nome completo deve conter apenas letras e espaços');
    }
    return errors;
  }, []);

  const validatePhone = useCallback((phone) => {
    const trimmed = phone.trim();
    if (!trimmed) return ['Telefone é obrigatório'];
    
    const errors = [];
    const cleaned = trimmed.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 11) {
      errors.push('Telefone deve ter 10 ou 11 dígitos');
    }
    return errors;
  }, []);

  // Função para limpar erro de um campo específico
  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpa erro do campo quando usuário começa a digitar
    if (errors[name]) {
      clearFieldError(name);
    }

    // Validação em tempo real
    if (name === 'fullName') {
      const fullNameErrors = validateFullName(value);
      if (fullNameErrors.length > 0) {
        setErrors(prev => ({
          ...prev,
          fullName: fullNameErrors
        }));
      }
    } else if (name === 'phone') {
      const phoneErrors = validatePhone(value);
      if (phoneErrors.length > 0) {
        setErrors(prev => ({
          ...prev,
          phone: phoneErrors
        }));
      }
    }
  }, [errors, validateFullName, validatePhone, clearFieldError]);

  const validateForm = useCallback(() => {
    const fullNameErrors = validateFullName(formData.fullName);
    const phoneErrors = validatePhone(formData.phone);
    
    const allErrors = {};
    if (fullNameErrors.length > 0) allErrors.fullName = fullNameErrors;
    if (phoneErrors.length > 0) allErrors.phone = phoneErrors;
    
    return allErrors;
  }, [formData, validateFullName, validatePhone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await api.post('/notification-users', {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim()
      });

      if (response.data?.success) {
        setSuccess(true);
        setFormData({ fullName: '', phone: '' });
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } else {
        setErrors({
          submit: ['Resposta inválida do servidor']
        });
      }
    } catch (error) {
      let errorMessage = 'Erro ao tentar cadastrar. Tente novamente.';
      
      if (error.response) {
        if (error.response.status === 400 && error.response.data.errors) {
          // Erros de validação do backend
          const backendErrors = {};
          error.response.data.errors.forEach(err => {
            backendErrors[err.field] = [err.message];
          });
          setErrors(backendErrors);
          return;
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 500) {
          errorMessage = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
        }
      } else if (error.request) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      }
      
      setErrors({ submit: [errorMessage] });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Componente reutilizável para exibir erros
  const ErrorDisplay = ({ errors }) => {
    if (!errors || errors.length === 0) return null;
    
    return (
      <div className={styles.errorMessage}>
        {errors.map((error, index) => (
          <p key={index}>{error}</p>
        ))}
      </div>
    );
  };

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated) {
    navigate('/login', { replace: true });
    return null;
  }

  if (success) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <div style={{ textAlign: 'center', color: '#28a745' }}>
            <FontAwesomeIcon icon={faCheckCircle} size="3x" style={{ marginBottom: '1rem' }} />
            <h1>Cadastro Realizado!</h1>
            <p>Usuário de notificação cadastrado com sucesso.</p>
            <p>Redirecionando para a página principal...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Cadastrar Usuário de Notificação</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
          Cadastre usuários que receberão notificações via WhatsApp sobre estoque baixo e validade de produtos.
        </p>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="fullName">
            Nome Completo
          </label>
          <div className={styles.inputContainer}>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className={errors.fullName ? styles.error : styles.input}
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Digite o nome completo"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="words"
              spellCheck="false"
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <div className={styles.errorIcon}>
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
            )}
          </div>
          <ErrorDisplay errors={errors.fullName} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="phone">
            Telefone (WhatsApp)
          </label>
          <div className={styles.inputContainer}>
            <input
              id="phone"
              name="phone"
              type="text"
              className={errors.phone ? styles.error : styles.input}
              value={formData.phone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <div className={styles.errorIcon}>
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
            )}
          </div>
          <ErrorDisplay errors={errors.phone} />
        </div>

        <ErrorDisplay errors={errors.submit} />

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Usuário'}
          </button>
        </div>

        <div className={styles.linkContainer}>
          <p>
            <Link to="/" className={styles.link}>Voltar para a página principal</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default NotificationUserRegister; 