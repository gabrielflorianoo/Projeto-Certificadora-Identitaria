import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading, isAuthenticated } = useAuth();
    const { toast } = useToast();

    // Mostrar mensagem de sucesso do registro se existir
    useEffect(() => {
        if (location.state?.message) {
            toast({
                title: "Sucesso!",
                description: location.state.message,
                variant: "default",
            });
            // Limpar o state para evitar mostrar a mensagem novamente
            window.history.replaceState({}, document.title);
        }
    }, [location, toast]);

    // Redirecionar se já estiver autenticado
    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate("/dashboard");
            } else {
                setError(result.error || "Invalid credentials. Try again.");
            }
        } catch (err) {
            setError("Failed to login. Try again.");
        }
    };

    const handleDemoLogin = (email, password) => {
        setEmail(email);
        setPassword(password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <img
                      src="/ellpi.png"
                      alt="Ellpi"
                      className="mx-auto mb-2 w-35 h-auto animate-float"
                    />
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

                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50"
                    >
                        {loading ? "Entrando..." : "Entrar"}                    </button>
                </form>                <div className="mt-6 text-center space-y-3">
                    <p className="text-white/70 text-sm">
                        <Link 
                            to="/forgot-password" 
                            className="text-blue-300 hover:text-blue-200 underline transition-colors"
                        >
                            Esqueci minha senha
                        </Link>
                    </p>
                    <p className="text-white/70 text-sm">
                        Não tem uma conta?{" "}
                        <Link 
                            to="/register" 
                            className="text-blue-300 hover:text-blue-200 underline transition-colors"
                        >
                            Criar conta
                        </Link>
                    </p>
                </div>

                <div className="mt-8 p-4 bg-white/5 rounded-lg">
                    <h3 className="text-white font-semibold mb-3 text-center">
                        Contas de Demonstração:
                    </h3>
                    <div className="space-y-2 text-sm text-white/80">
                        <button className="hover:underline" onClick={() => handleDemoLogin('admin@example.com', 'admin123')}>
                            <strong>Admin:</strong> admin@example.com / admin123
                        </button>
                        <button className="hover:underline" onClick={() => handleDemoLogin('joao@example.com', '123456')}>
                            <strong>Professor:</strong> joao@example.com / 123456
                        </button>
                        <button className="hover:underline" onClick={() => handleDemoLogin('ana@example.com', '123456')}>
                            <strong>Estudante:</strong> ana@example.com / 123456
                        </button>
                        <button className="hover:underline" onClick={() => handleDemoLogin('beatriz@example.com', '123456')}>
                            <strong>Voluntário:</strong> beatriz@example.com / 123456
                        </button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default Login;
