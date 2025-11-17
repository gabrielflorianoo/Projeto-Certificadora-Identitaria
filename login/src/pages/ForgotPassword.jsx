import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { forgotPassword, resetPassword } from '../lib/server';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Digite um e-mail válido.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await forgotPassword(email);
      setCodeSent(true);
      setStep(2);
      setError('');
    } catch (err) {
      setError(err.error || 'Erro ao enviar código. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (code.trim().length === 0) {
      setError('Digite o código de verificação.');
      return;
    }
    setStep(3);
    setError('');
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await resetPassword({
        email,
        token: code,
        newPassword
      });
      navigate('/login', { 
        state: { 
          message: 'Senha redefinida com sucesso! Faça login com sua nova senha.' 
        } 
      });
    } catch (err) {
      setError(err.error || 'Erro ao redefinir senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-bold animate-float mb-2">
            Recuperar Senha
          </h1>
          <p className="text-blue-200 text-sm">
            Educação Lógica, Lúdica e Programação
          </p>
          <p className="text-white/70 text-xs mt-1">
            UTFPR - Campus Cornélio Procópio
          </p>
        </div>

        {step === 1 && (
          <>
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition-all duration-200"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-300 text-sm text-center bg-red-500/20 p-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar código'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="text-blue-300 hover:text-blue-200 underline transition-colors text-sm"
              >
                Voltar ao login
              </Link>
            </div>
          </>
        )}        {step === 2 && (
          <>
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Código de verificação
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition-all duration-200"
                  placeholder="Digite o código enviado"
                  required
                />
                <p className="text-white/60 text-xs mt-2">
                  Código enviado para: {email}
                </p>
              </div>
              
              {error && (
                <div className="text-red-300 text-sm text-center bg-red-500/20 p-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:scale-105 transition-transform duration-200"
              >
                Verificar código
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => setStep(1)}
                className="text-blue-300 hover:text-blue-200 underline transition-colors text-sm"
              >
                Voltar
              </button>
            </div>
          </>
        )}        {step === 3 && (
          <>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Nova senha
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Confirmar nova senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-300 text-sm text-center bg-red-500/20 p-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-3 px-4 rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50"
              >
                {loading ? 'Redefinindo...' : 'Redefinir senha'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => setStep(2)}
                className="text-blue-300 hover:text-blue-200 underline transition-colors text-sm"
              >
                Voltar
              </button>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
}
