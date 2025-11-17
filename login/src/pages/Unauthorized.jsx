import React from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-md p-8 text-center">
                <div className="text-6xl mb-4">🚫</div>
                <h1 className="text-2xl font-bold text-white mb-4">
                    Acesso Não Autorizado
                </h1>
                <p className="text-white/70 mb-6">
                    Você não tem permissão para acessar esta página.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:scale-105 transition-transform duration-200"
                >
                    Voltar ao Dashboard
                </Link>
            </GlassCard>
        </div>
    );
};

export default Unauthorized;
