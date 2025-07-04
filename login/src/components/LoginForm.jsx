import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';

// Importa o CSS do próprio LoginForm
import './LoginForm.css';

// Importações dos CSS de outros componentes que mencionou (caso precise usar os estilos globais)
import './ForgotPassword.css';
import './Dashboard.css';
import './NotFound.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@teste.com' && senha === 'senha123') {
      localStorage.setItem('token', 'fake-jwt-token');
      navigate('/dashboard');
    } else {
      setErro('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="animated-bg flex items-center justify-center min-h-screen">
      <div className="login-container">
        <img
          src="/ellpi.png"
          alt="Ellpi"
          className="mx-auto mb-6 w-100 h-auto animate-float"
        />
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        {erro && <p className="error-msg">{erro}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaUser />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>
        <p className="forgot-password">
          <a href="/esqueci-senha">
            Esqueceu sua senha?
          </a>
        </p>
      </div>
    </div>
  );
}
