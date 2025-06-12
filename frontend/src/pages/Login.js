import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateUsername = (username) => {
    const errors = [];
    const trimmed = username.trim();
    if (!trimmed) {
      errors.push('Nome de usuário é obrigatório');
    }
    if (trimmed.includes(' ')) {
      errors.push('Nome de usuário não pode conter espaços');
    }
    if (trimmed.length < 3) {
      errors.push('Nome de usuário deve ter no mínimo 3 caracteres');
    }
    if (trimmed && !/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      errors.push('Nome de usuário inválido. Use apenas letras, números, underscore (_) ou hífen (-)');
    }
    return errors;
  };

  const validatePassword = (password) => {
    const errors = [];
    if (!password) {
      errors.push('Senha é obrigatória');
    }
    if (password.length < 6) {
      errors.push('Senha deve ter no mínimo 6 caracteres');
    }
    if (password.includes(' ')) {
      errors.push('Senha não pode conter espaços');
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'username') {
      const usernameErrors = validateUsername(value);
      setErrors(prev => ({
        ...prev,
        username: usernameErrors.length > 0 ? usernameErrors : undefined
      }));
    } else if (name === 'password') {
      const passwordErrors = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        password: passwordErrors.length > 0 ? passwordErrors : undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const usernameErrors = validateUsername(formData.username);
    const passwordErrors = validatePassword(formData.password);

    if (usernameErrors.length > 0 || passwordErrors.length > 0) {
      setErrors({
        ...(usernameErrors.length > 0 ? { username: usernameErrors } : {}),
        ...(passwordErrors.length > 0 ? { password: passwordErrors } : {})
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await api.post('/api/auth/login', formData);
      
      if (response.data && response.data.token) {
        login(response.data.token);
      } else {
        setErrors(prev => ({
          ...prev,
          submit: ['Resposta inválida do servidor']
        }));
      }
    } catch (error) {
      let errorMessage = 'Erro ao tentar fazer login. Tente novamente.';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Usuário inválido ou senha incorreta.';
        } else if (error.response.status === 500) {
          errorMessage = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
        }
      } else if (error.request) {
        errorMessage = 'Não foi possível conectar ao servidor de autenticação. Verifique sua conexão ou se a API está ativa.';
      }
      setErrors(prev => ({
        ...prev,
        submit: [errorMessage]
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Login</h1>
        
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
          {errors.username && (
            <div className={styles.errorMessage}>
              {errors.username.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
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
          {errors.password && (
            <div className={styles.errorMessage}>
              {errors.password.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>

        {errors.submit && (
          <div className={styles.errorMessage}>
            {errors.submit.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login; 