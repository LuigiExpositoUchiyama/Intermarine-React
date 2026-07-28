import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShip } from 'react-icons/fa';

import authService from '../../Services/authService';

import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const usernameInvalid = touched.username && !form.username.trim();

  const passwordInvalid = touched.password && !form.password;

  const formInvalid = !form.username.trim() || !form.password;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleBlur(event) {
    const { name } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }

  async function entrar(event) {
    event.preventDefault();

    setErro('');

    setTouched({
      username: true,
      password: true,
    });

    if (formInvalid) {
      return;
    }

    setCarregando(true);

    try {
      await authService.login({
        username: form.username.trim(),
        password: form.password,
      });

      navigate('/', {
        replace: true,
      });
    } catch (error) {
      setErro(error?.error?.message ?? 'Usuário ou senha inválidos');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <FaShip />
          </div>

          <div className={styles.loginTitle}>
            <h2>Entrar</h2>

            <p>Faça login para acessar o sistema</p>
          </div>
        </div>

        <form className={styles.loginForm} onSubmit={entrar}>
          <label htmlFor="username">Usuário</label>

          <input
            id="username"
            name="username"
            type="text"
            placeholder="Seu usuário"
            value={form.username}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {usernameInvalid && (
            <small className={styles.err}>Usuário é obrigatório</small>
          )}

          <label htmlFor="password">Senha</label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Sua senha"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {passwordInvalid && (
            <small className={styles.err}>Senha é obrigatória</small>
          )}

          {erro && <div className={styles.errBox}>{erro}</div>}

          <button type="submit" disabled={carregando || formInvalid}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
