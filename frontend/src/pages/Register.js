import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import { API_URL } from '../config/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateUsername = (username) => {
    const errors = [];
    if (!username) {
      errors.push('Nome de usuário é obrigatório');
    }
    if (username.includes(' ')) {
      errors.push('Nome de usuário não pode conter espaços');
    }
    if (username.length < 3) {
      errors.push('Nome de usuário deve ter no mínimo 3 caracteres');
    }
    return errors;
  };

  const validatePassword = (password) => {
    const errors = [];
    if (!password) {
      errors.push('Senha é obrigatória');
    }
    if (password.length < 4) {
      errors.push('Senha deve ter no mínimo 4 caracteres');
    }
    if (password.includes(' ')) {
      errors.push('Senha não pode conter espaços');
    }
    return errors;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    const errors = [];
    if (!confirmPassword) {
      errors.push('Confirmação de senha é obrigatória');
    }
    if (password !== confirmPassword) {
      errors.push('As senhas não coincidem');
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const usernameErrors = validateUsername(formData.username);
    const passwordErrors = validatePassword(formData.password);
    const confirmPasswordErrors = validateConfirmPassword(formData.password, formData.confirmPassword);
    
    if (usernameErrors.length > 0 || passwordErrors.length > 0 || confirmPasswordErrors.length > 0) {
      setErrors({
        username: usernameErrors,
        password: passwordErrors,
        confirmPassword: confirmPasswordErrors
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setErrors({
          submit: [data.message]
        });
      }
    } catch (error) {
      setErrors({
        submit: ['Erro ao tentar registrar. Tente novamente.']
      });
    }
  };

  return (
    <div className={styles['login-container']}>
      <form onSubmit={handleSubmit} className={styles['login-form']}>
        <h2>Registro</h2>
        
        <div className={styles['form-group']}>
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? styles.error : ''}
          />
          {errors.username && (
            <div className={styles['error-message']}>
              {errors.username.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? styles.error : ''}
          />
          {errors.password && (
            <div className={styles['error-message']}>
              {errors.password.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="confirmPassword">Confirmar Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? styles.error : ''}
          />
          {errors.confirmPassword && (
            <div className={styles['error-message']}>
              {errors.confirmPassword.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>

        {errors.submit && (
          <div className={styles['error-message']}>
            {errors.submit.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <button type="submit">Registrar</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Já tem uma conta? <Link to="/login" style={{ color: '#007bff' }}>Faça login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register; 