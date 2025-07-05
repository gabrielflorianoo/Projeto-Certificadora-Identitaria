import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../contexts/AuthContext";
import { registerUser } from "../lib/server";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "STUDENT"
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Redirecionar se já estiver autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validações básicas
        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...registerData } = formData;
            const result = await registerUser(registerData);
            
            if (result.message) {
                // Registro bem-sucedido - redirecionar para login
                navigate("/login", { 
                    state: { 
                        message: "Conta criada com sucesso! Faça login para continuar." 
                    } 
                });
            }
        } catch (err) {
            setError(err.error || "Erro ao criar conta. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-white text-3xl font-bold animate-float mb-2">
                        Criar Conta
                    </h1>
                    <p className="text-blue-200 text-sm">
                        Educação Lógica, Lúdica e Programação
                    </p>
                    <p className="text-white/70 text-xs mt-1">
                        UTFPR - Campus Cornélio Procópio
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition-all duration-200"
                            placeholder="Seu nome completo"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition-all duration-200"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Função
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition-all duration-200"
                            required
                        >
                            <option value="STUDENT" className="bg-gray-800 text-white">Estudante</option>
                            <option value="VOLUNTEER" className="bg-gray-800 text-white">Voluntário</option>
                            <option value="TEACHER" className="bg-gray-800 text-white">Professor</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Senha
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition-all duration-200"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Confirmar Senha
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
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
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50"
                    >
                        {loading ? "Criando conta..." : "Criar Conta"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-white/70 text-sm">
                        Já tem uma conta?{" "}
                        <Link 
                            to="/login" 
                            className="text-blue-300 hover:text-blue-200 underline transition-colors"
                        >
                            Fazer login
                        </Link>
                    </p>
                </div>

                <div className="mt-8 p-4 bg-white/5 rounded-lg">
                    <h3 className="text-white font-semibold mb-3 text-center text-sm">
                        Informações sobre as Funções:
                    </h3>
                    <div className="space-y-2 text-xs text-white/70">
                        <div>
                            <strong className="text-blue-300">Estudante:</strong> Participa dos workshops e atividades
                        </div>
                        <div>
                            <strong className="text-green-300">Voluntário:</strong> Auxilia nas atividades e workshops
                        </div>
                        <div>
                            <strong className="text-purple-300">Professor:</strong> Leciona e gerencia workshops
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default Register;
