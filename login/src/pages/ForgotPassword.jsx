import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSendCode = (e) => {
    e.preventDefault();
    if (email.includes('@')) {
      setCodeSent(true);
      setStep(2);
    } else {
      setErro('Digite um e-mail válido.');
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (code === '123456') {
      setStep(3);
      setErro('');
    } else {
      setErro('Código inválido.');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErro('As senhas não coincidem.');
      return;
    }
    setErro('');
    navigate('/login');
  };

  return (
    <div className="animated-bg flex items-center justify-center min-h-screen">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md text-white">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Recuperar senha</h2>
            <form onSubmit={handleSendCode}>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 rounded bg-white/20 mb-4"
              />
              {erro && <p className="text-red-400 mb-2">{erro}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
              >
                Enviar código
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Digite o código</h2>
            <form onSubmit={handleVerifyCode}>
              <label>Código enviado ao email:</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full p-2 rounded bg-white/20 mb-4"
              />
              {erro && <p className="text-red-400 mb-2">{erro}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
              >
                Verificar código
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Nova senha</h2>
            <form onSubmit={handleResetPassword}>
              <label>Nova senha:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-2 rounded bg-white/20 mb-4"
              />
              <label>Confirmar senha:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 rounded bg-white/20 mb-4"
              />
              {erro && <p className="text-red-400 mb-2">{erro}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
              >
                Redefinir senha
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
