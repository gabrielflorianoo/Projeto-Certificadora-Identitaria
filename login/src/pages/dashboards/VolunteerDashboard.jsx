import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import StatCard from "../../components/StatCard";
import GlassCard from "../../components/GlassCard";

const VolunteerDashboard = () => {
    const { user } = useAuth();
    const { students, grades, attendance } = useData();

    // Para demonstração, vamos assumir que o voluntário tem alguns alunos atribuídos
    const myStudents = students.slice(0, 2); // Primeiros 2 alunos como exemplo
    const myGrades = grades.filter((g) =>
        myStudents.some((s) => s.id === g.studentId),
    );
    const recentAttendance = attendance.filter((a) => {
        const today = new Date();
        const attendanceDate = new Date(a.date);
        const diffTime = Math.abs(today - attendanceDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && myStudents.some((s) => s.id === a.studentId);
    }).length;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">
                    Olá, {user.name}!
                </h1>
                <p className="text-blue-200 text-lg">
                    Painel do Voluntário - Suas Turmas e Atividades
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Meus Alunos"
                    value={myStudents.length}
                    subtitle="Ativos"
                    color="blue"
                />
                <StatCard
                    title="Notas Lançadas"
                    value={myGrades.length}
                    subtitle="Este mês"
                    color="green"
                />
                <StatCard
                    title="Presenças (7 dias)"
                    value={recentAttendance}
                    subtitle="Última semana"
                    color="yellow"
                />
                <StatCard
                    title="Próximas Aulas"
                    value="3"
                    subtitle="Esta semana"
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                    <h3 className="text-white text-xl font-semibold mb-4">
                        Ações Rápidas
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full bg-blue-500/30 hover:bg-blue-500/40 text-white py-3 px-4 rounded-lg transition-colors duration-200 text-left">
                            ✅ Registrar Presença
                        </button>
                        <button className="w-full bg-green-500/30 hover:bg-green-500/40 text-white py-3 px-4 rounded-lg transition-colors duration-200 text-left">
                            📝 Lançar Notas
                        </button>
                        <button className="w-full bg-purple-500/30 hover:bg-purple-500/40 text-white py-3 px-4 rounded-lg transition-colors duration-200 text-left">
                            👥 Ver Meus Alunos
                        </button>
                        <button className="w-full bg-yellow-500/30 hover:bg-yellow-500/40 text-white py-3 px-4 rounded-lg transition-colors duration-200 text-left">
                            📊 Relatório da Turma
                        </button>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-white text-xl font-semibold mb-4">
                        Meus Alunos
                    </h3>
                    <div className="space-y-3">
                        {myStudents.map((student) => (
                            <div
                                key={student.id}
                                className="bg-white/10 p-3 rounded-lg"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-white font-medium">
                                            {student.name}
                                        </h4>
                                        <p className="text-blue-200 text-sm">
                                            {student.turma}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-green-300 text-sm">
                                            Ativo
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            <GlassCard className="p-6">
                <h3 className="text-white text-xl font-semibold mb-4">
                    Progresso dos Alunos
                </h3>
                <div className="space-y-4">
                    {myStudents.map((student) => {
                        const studentGrades = grades.filter(
                            (g) => g.studentId === student.id,
                        );
                        const avgBefore =
                            studentGrades.reduce(
                                (acc, g) => acc + g.gradeBefore,
                                0,
                            ) / (studentGrades.length || 1);
                        const avgAfter =
                            studentGrades.reduce(
                                (acc, g) => acc + g.gradeAfter,
                                0,
                            ) / (studentGrades.length || 1);

                        return (
                            <div
                                key={student.id}
                                className="bg-white/5 p-4 rounded-lg"
                            >
                                <h4 className="text-white font-medium mb-2">
                                    {student.name}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-white/60 text-sm">
                                            Média Antes
                                        </p>
                                        <p className="text-red-300 text-xl font-bold">
                                            {avgBefore.toFixed(1)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm">
                                            Média Atual
                                        </p>
                                        <p className="text-green-300 text-xl font-bold">
                                            {avgAfter.toFixed(1)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm">
                                            Evolução
                                        </p>
                                        <p className="text-blue-300 text-xl font-bold">
                                            +{(avgAfter - avgBefore).toFixed(1)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </GlassCard>
        </div>
    );
};

export default VolunteerDashboard;
