import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';

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
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md text-white">
       <img
  src="/ellpi.png"
  alt="Ellpi"
  className="mx-auto mb-6 w-100 h-auto animate-float"
/>
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        {erro && <p className="text-red-400">{erro}</p>}
        <form onSubmit={handleLogin}>
          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-3 text-white" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full p-2 border rounded bg-white/20 text-white placeholder-white"
              required
            />
          </div>
          <div className="relative mb-6">
            <FaLock className="absolute left-3 top-3 text-white" />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="pl-10 w-full p-2 border rounded bg-white/20 text-white placeholder-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded hover:scale-105 transition-transform"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          <a href="/esqueci-senha" className="underline text-blue-300 hover:text-blue-100">
            Esqueceu sua senha?
          </a>
        </p>
      </div>
    </div>
  );
}
