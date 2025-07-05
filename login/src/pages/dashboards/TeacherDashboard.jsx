import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import StatCard from "../../components/StatCard";
import GlassCard from "../../components/GlassCard";

const TeacherDashboard = () => {
    const { user } = useAuth();
    const { students, grades, attendance } = useData();

    // Filtrar alunos do professor
    const teacherStudents = students.filter((s) => s.teacher === user.name);
    const totalStudents = teacherStudents.length;
    const activeStudents = teacherStudents.filter(
        (s) => s.status === "ativo",
    ).length;

    // Cálculo de médias por disciplina (apenas para as disciplinas do professor)
    const disciplines = [
        "Informática Básica",
        "Lógica de Programação",
        "Robótica",
    ]; // Assumindo que o professor leciona essas
    const disciplineStats = disciplines.map((discipline) => {
        const disciplineGrades = grades.filter(
            (g) =>
                g.discipline === discipline &&
                teacherStudents.some((s) => s.id === g.studentId),
        );

        const avgBefore =
            disciplineGrades.reduce((acc, g) => acc + g.gradeBefore, 0) /
            (disciplineGrades.length || 1);
        const avgAfter =
            disciplineGrades.reduce((acc, g) => acc + g.gradeAfter, 0) /
            (disciplineGrades.length || 1);
        return {
            discipline,
            avgBefore: avgBefore.toFixed(1),
            avgAfter: avgAfter.toFixed(1),
            improvement: (avgAfter - avgBefore).toFixed(1),
        };
    });

    // Taxa de frequência do professor
    const teacherAttendance = attendance.filter((a) =>
        teacherStudents.some((s) => s.id === a.studentId),
    );
    const attendanceRate =
        teacherAttendance.length > 0
            ? (
                  (teacherAttendance.filter((a) => a.present).length /
                      teacherAttendance.length) *
                  100
              ).toFixed(1)
            : "0";

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">
                    Prof. {user.name}
                </h1>
                <p className="text-blue-200 text-lg">
                    Professor do Projeto ELLP - UTFPR
                </p>
                <p className="text-white/70 text-sm mt-1">
                    Acompanhamento de Turma e Desempenho
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
                    title="Frequência da Turma"
                    value={`${attendanceRate}%`}
                    subtitle="Geral da turma"
                    color="green"
                />
                <StatCard
                    title="Melhoria Média"
                    value="+2.1" // Substituir pelo cálculo real
                    subtitle="Pontos nas notas"
                    color="yellow"
                />
                <StatCard
                    title="Alunos Concluintes"
                    value="92%" // Substituir pelo cálculo real
                    subtitle="Alunos que finalizaram"
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                    <h3 className="text-white text-xl font-semibold mb-4">
                        Desempenho da Turma por Disciplina
                    </h3>
                    <div className="space-y-4">
                        {disciplineStats.map((stat) => (
                            <div
                                key={stat.discipline}
                                className="bg-white/5 p-4 rounded-lg"
                            >
                                <h4 className="text-white font-medium mb-2">
                                    {stat.discipline}
                                </h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-white/60 text-xs">
                                            Antes
                                        </p>
                                        <p className="text-red-300 text-lg font-bold">
                                            {stat.avgBefore}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-xs">
                                            Depois
                                        </p>
                                        <p className="text-green-300 text-lg font-bold">
                                            {stat.avgAfter}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-xs">
                                            Melhoria
                                        </p>
                                        <p className="text-blue-300 text-lg font-bold">
                                            +{stat.improvement}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-white text-xl font-semibold mb-4">
                        Ferramentas do Professor
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full bg-blue-500/30 hover:bg-blue-500/40 text-white py-3 px-4 rounded-lg transition-colors duration-200 text-left">
                            📊 Avaliar Desempenho
                        </button>
                        <button className="w-full bg-green-500/30 hover:bg-green-500/40 text-white py-3 px-4 rounded-lg transition-colors duration-200 text-left">
                            📈 Acompanhamento Individual
                        </button>
                    </div>
                </GlassCard>
            </div>

            {/* Removendo Distribuição por Escola de Origem */}

            <GlassCard className="p-6">
                <h3 className="text-white text-xl font-semibold mb-4">
                    Agenda e Comunicados
                </h3>
                <div className="space-y-3">
                    <div className="bg-white/5 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-white font-medium">
                                    Reunião de Professores
                                </h4>
                                <p className="text-blue-200 text-sm">
                                    Alinhamento pedagógico
                                </p>
                            </div>
                            <span className="text-yellow-300 text-sm">
                                Amanhã
                            </span>
                        </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-white font-medium">
                                    Plantão de Dúvidas
                                </h4>
                                <p className="text-blue-200 text-sm">
                                    Atendimento aos alunos
                                </p>
                            </div>
                            <span className="text-green-300 text-sm">
                                Quarta-feira
                            </span>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default TeacherDashboard;
