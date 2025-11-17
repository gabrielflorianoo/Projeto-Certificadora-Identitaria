import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import StatCard from "../../components/StatCard";
import GlassCard from "../../components/GlassCard";

const AdminDashboard = () => {
    const { user } = useAuth();
    const { students, grades, attendance, loading, error } = useData();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-white text-xl">Carregando dados...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center">
                <div className="text-red-400 text-xl mb-4">
                    Erro ao carregar dados: {error}
                </div>
                <div className="text-blue-200">
                    Verifique sua conexão e se você está autenticado.
                </div>
            </div>
        );
    }

    const totalStudents = students.length;
    const activeStudents = students.filter((s) => s.status === "ativo").length;
    const totalGrades = grades.length;
    const recentAttendance = attendance.filter((a) => {
        const today = new Date();
        const attendanceDate = new Date(a.date);
        const diffTime = Math.abs(today - attendanceDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    }).length;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">
                    Bem-vindo, {user.name}!
                </h1>
                <p className="text-blue-200 text-lg">
                    Painel Administrativo - Sistema ELLP
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total de Alunos"
                    value={totalStudents}
                    subtitle={`${activeStudents} ativos`}
                    color="blue"
                />
                <StatCard
                    title="Notas Lançadas"
                    value={totalGrades}
                    subtitle="Este semestre"
                    color="green"
                />
                <StatCard
                    title="Presenças (7 dias)"
                    value={recentAttendance}
                    subtitle="Última semana"
                    color="yellow"
                />
                <StatCard
                    title="Taxa de Frequência"
                    value="87%"
                    subtitle="Média geral"
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                    <h3 className="text-white text-xl font-semibold mb-4">
                        Gestão Rápida
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full bg-blue-500/30 hover:bg-blue-500/40 text-white py-3 px-4 rounded-lg transition-colors duration-200 text-left">
                            📚 Gerenciar Alunos
                        </button>
                        <button className="w-full bg-green-500/30 hover:bg-green-500/40 text-white py-3 px-4 rounded-lg transition-colors duration-200 text-left">
                            👥 Gerenciar Usuários
                        </button>
                        <button className="w-full bg-purple-500/30 hover:bg-purple-500/40 text-white py-3 px-4 rounded-lg transition-colors duration-200 text-left">
                            🏫 Gerenciar Turmas
                        </button>
                        <button className="w-full bg-yellow-500/30 hover:bg-yellow-500/40 text-white py-3 px-4 rounded-lg transition-colors duration-200 text-left">
                            📊 Ver Relatórios
                        </button>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-white text-xl font-semibold mb-4">
                        Atividades Recentes
                    </h3>
                    <div className="space-y-3">
                        <div className="text-white/80 text-sm">
                            📝 Novas notas lançadas por João Silva
                        </div>
                        <div className="text-white/80 text-sm">
                            👤 3 novos alunos cadastrados hoje
                        </div>
                        <div className="text-white/80 text-sm">
                            ✅ Presença registrada para Turma A
                        </div>
                        <div className="text-white/80 text-sm">
                            📊 Relatório mensal gerado
                        </div>
                    </div>
                </GlassCard>
            </div>

            <GlassCard className="p-6">
                <h3 className="text-white text-xl font-semibold mb-4">
                    Estatísticas por Disciplina
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white/5 p-4 rounded-lg">
                        <h4 className="text-white font-medium">
                            Informática Básica
                        </h4>
                        <p className="text-blue-200 text-2xl font-bold">8.2</p>
                        <p className="text-white/60 text-sm">Média geral</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                        <h4 className="text-white font-medium">
                            Lógica de Programação
                        </h4>
                        <p className="text-green-200 text-2xl font-bold">7.8</p>
                        <p className="text-white/60 text-sm">Média geral</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                        <h4 className="text-white font-medium">Robótica</h4>
                        <p className="text-yellow-200 text-2xl font-bold">
                            8.5
                        </p>
                        <p className="text-white/60 text-sm">Média geral</p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default AdminDashboard;
