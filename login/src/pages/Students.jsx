import React, { useState, useEffect } from "react";
import GlassCard from "../components/GlassCard";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Users, Settings } from "lucide-react";
import { listStudents } from "../lib/server";

const Students = () => {
    const [students, setStudents]  = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const data = await listStudents() || [];
                setStudents(Array.isArray(data.users) ? data.users : []);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const getStatusBadge = (status) => {
        return status === "ativo" ? (
            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                Ativo
            </span>
        ) : (
            <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">
                Inativo
            </span>
        );
    };

    if (loading) {
        return <div>Loading students...</div>;
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-300" />
                        <h1 className="text-3xl font-bold text-white">
                            Gerenciar Alunos
                        </h1>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Novo Aluno
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <GlassCard className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">
                                {students.length}
                            </div>
                            <div className="text-blue-200 text-sm">
                                Total de Alunos
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-300">
                                {
                                    students.filter((s) => s.status === "ativo")
                                        .length
                                }
                            </div>
                            <div className="text-blue-200 text-sm">
                                Alunos Ativos
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-300">
                                {/* Assuming you want to dynamically calculate the number of "Turmas" */}
                                {new Set(students.map(student => student.turma)).size}
                            </div>
                            <div className="text-blue-200 text-sm">Turmas</div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-300">
                                {/* Assuming you want to dynamically calculate the "Taxa de Frequência" */}
                                {students.length > 0 ? Math.round((students.filter(student => student.status === "ativo").length / students.length) * 100) : 0}%
                            </div>
                            <div className="text-blue-200 text-sm">
                                Taxa de Frequência
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <GlassCard className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10">
                                <TableHead className="text-blue-200">
                                    Nome
                                </TableHead>
                                <TableHead className="text-blue-200">
                                    Idade
                                </TableHead>
                                <TableHead className="text-blue-200">
                                    Escola
                                </TableHead>
                                <TableHead className="text-blue-200">
                                    Turma
                                </TableHead>
                                <TableHead className="text-blue-200">
                                    Responsável
                                </TableHead>
                                <TableHead className="text-blue-200">
                                    Status
                                </TableHead>
                                <TableHead className="text-blue-200">
                                    Ações
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow
                                    key={student.id}
                                    className="border-white/10 hover:bg-white/5"
                                >
                                    <TableCell className="text-white font-medium">
                                        {student.name}
                                    </TableCell>
                                    <TableCell className="text-blue-200">
                                        {student.age} anos
                                    </TableCell>
                                    <TableCell className="text-blue-200">
                                        {student.school}
                                    </TableCell>
                                    <TableCell className="text-blue-200">
                                        {student.turma}
                                    </TableCell>
                                    <TableCell className="text-blue-200">
                                        {student.responsibleName}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(student.status)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-300 hover:text-white hover:bg-white/10"
                                        >
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </GlassCard>
            </div>
        </div>
    );
};

export default Students;
