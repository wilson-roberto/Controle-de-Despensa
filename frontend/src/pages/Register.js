import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validações otimizadas
  const validateUsername = useCallback((username) => {
    const trimmed = username.trim();
    if (!trimmed) return ['Nome de usuário é obrigatório'];
    
    const errors = [];
    if (trimmed.includes(' ')) {
      errors.push('Nome de usuário não pode conter espaços');
    }
    if (trimmed.length < 3) {
      errors.push('Nome de usuário deve ter no mínimo 3 caracteres');
    }
    if (trimmed.length > 30) {
      errors.push('Nome de usuário deve ter no máximo 30 caracteres');
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      errors.push('Nome de usuário deve conter apenas letras, números, underscore (_) ou hífen (-)');
    }
    return errors;
  }, []);

  const validatePassword = useCallback((password) => {
    if (!password) return ['Senha é obrigatória'];
    
    const errors = [];
    if (password.length < 8) {
      errors.push('Senha deve ter no mínimo 8 caracteres');
    }
    if (password.includes(' ')) {
      errors.push('Senha não pode conter espaços');
    }
    if (!/[a-zA-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra');
    }
    if (!/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }
    return errors;
  }, []);

  const validateConfirmPassword = useCallback((password, confirmPassword) => {
    if (!confirmPassword) return ['Confirmação de senha é obrigatória'];
    if (password !== confirmPassword) return ['As senhas não coincidem'];
    return [];
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

    // Validação em tempo real apenas para campos críticos
    if (name === 'username') {
      const usernameErrors = validateUsername(value);
      if (usernameErrors.length > 0) {
        setErrors(prev => ({
          ...prev,
          username: usernameErrors
        }));
      }
    } else if (name === 'password') {
      const passwordErrors = validatePassword(value);
      const confirmPasswordErrors = validateConfirmPassword(value, formData.confirmPassword);
      
      setErrors(prev => ({
        ...prev,
        ...(passwordErrors.length > 0 && { password: passwordErrors }),
        ...(confirmPasswordErrors.length > 0 && { confirmPassword: confirmPasswordErrors })
      }));
    } else if (name === 'confirmPassword') {
      const confirmPasswordErrors = validateConfirmPassword(formData.password, value);
      if (confirmPasswordErrors.length > 0) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: confirmPasswordErrors
        }));
      }
    }
  }, [errors, validateUsername, validatePassword, validateConfirmPassword, clearFieldError, formData.password, formData.confirmPassword]);

  const validateForm = useCallback(() => {
    const usernameErrors = validateUsername(formData.username);
    const passwordErrors = validatePassword(formData.password);
    const confirmPasswordErrors = validateConfirmPassword(formData.password, formData.confirmPassword);
    
    const allErrors = {};
    if (usernameErrors.length > 0) allErrors.username = usernameErrors;
    if (passwordErrors.length > 0) allErrors.password = passwordErrors;
    if (confirmPasswordErrors.length > 0) allErrors.confirmPassword = confirmPasswordErrors;
    
    return allErrors;
  }, [formData, validateUsername, validatePassword, validateConfirmPassword]);

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
      const response = await api.post('/auth/register', {
        username: formData.username.trim(),
        password: formData.password
      });

      if (response.data?.token) {
        login(response.data.token);
        navigate('/', { replace: true });
      } else {
        setErrors({
          submit: ['Resposta inválida do servidor']
        });
      }
    } catch (error) {
      let errorMessage = 'Erro ao tentar registrar. Tente novamente.';
      
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

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Registro</h1>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="username">
            Nome de Usuário
          </label>
          <div className={styles.inputContainer}>
            <input
              id="username"
              name="username"
              type="text"
              className={errors.username ? styles.error : styles.input}
              value={formData.username}
              onChange={handleChange}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              disabled={isSubmitting}
            />
            {errors.username && (
              <div className={styles.errorIcon}>
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
            )}
          </div>
          <ErrorDisplay errors={errors.username} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="password">
            Senha
          </label>
          <div className={styles.passwordInputContainer}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className={errors.password ? styles.error : styles.input}
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <ErrorDisplay errors={errors.password} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="confirmPassword">
            Confirmar Senha
          </label>
          <div className={styles.passwordInputContainer}>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className={errors.confirmPassword ? styles.error : styles.input}
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <ErrorDisplay errors={errors.confirmPassword} />
        </div>

        <ErrorDisplay errors={errors.submit} />

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar'}
          </button>
        </div>

        <div className={styles.linkContainer}>
          <p>
            Já tem uma conta? <Link to="/login" className={styles.link}>Faça login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register; 