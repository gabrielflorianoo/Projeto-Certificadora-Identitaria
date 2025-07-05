import React, { useState, useEffect } from "react";
import GlassCard from "../components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Filter,
} from "lucide-react";
import { listClasses, listStudents } from "../lib/server";

const Attendance = () => {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const loadClasses = async () => {
        try {
            const classesData = await listClasses();
            console.log("Dados de turmas:", classesData);
            setClasses(classesData.classes || []);
        } catch (error) {
            console.error("Erro ao carregar classes:", error);
        }
    };

    const loadStudents = async () => {
        try {
            const studentsData = await listStudents();
            console.log("Dados de estudantes:", studentsData);
            setStudents(studentsData.users || []);
        } catch (error) {
            console.error("Erro ao carregar estudantes:", error);
        }
    };

    useEffect(() => {
        loadClasses();
        loadStudents();
    }, []);

    useEffect(() => {
        if (selectedClass && selectedDate) {
            loadAttendanceData();
        }
    }, [selectedClass, selectedDate]);

    const loadAttendanceData = async () => {
        setLoading(true);
        try {
            const attendances = await listAttendances();

            const classAttendances = attendances.filter(
                (attendance) =>
                    attendance.classId === parseInt(selectedClass) &&
                    attendance.date === selectedDate
            );

            if (classAttendances.length > 0) {
                setAttendanceData(classAttendances[0].records);
            } else {
                const classStudents = students.filter((student) =>
                    student.enrollments?.some(
                        (enrollment) =>
                            enrollment.classId === parseInt(selectedClass)
                    )
                );

                const initialAttendanceRecords = classStudents.map(
                    (student) => ({
                        studentId: student.id,
                        studentName: student.name,
                        studentEmail: student.email,
                        status: "absent",
                        checkedAt: null,
                        notes: "",
                    })
                );

                setAttendanceData(initialAttendanceRecords);
            }
        } catch (error) {
            console.error("Erro ao carregar dados de presença:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateAttendance = (studentId, status) => {
        setAttendanceData((prev) =>
            prev.map((record) =>
                record.studentId === studentId
                    ? {
                          ...record,
                          status,
                          checkedAt: new Date().toLocaleTimeString(),
                      }
                    : record
            )
        );
    };

    const saveAttendance = async () => {
        try {
            const attendanceDataToSave = {
                classId: parseInt(selectedClass),
                date: selectedDate,
                records: attendanceData,
            };

            const attendances = await listAttendances();
            const existingAttendance = attendances.find(
                (attendance) =>
                    attendance.classId === parseInt(selectedClass) &&
                    attendance.date === selectedDate
            );

            if (existingAttendance) {
                await updateAttendanceAPI(
                    existingAttendance.id,
                    attendanceDataToSave
                );
            } else {
                await createAttendance(attendanceDataToSave);
            }

            alert("Presença salva com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar presença:", error);
            alert("Erro ao salvar presença");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "present":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "absent":
                return <XCircle className="w-5 h-5 text-red-500" />;
            case "late":
                return <Clock className="w-5 h-5 text-yellow-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            present: {
                variant: "default",
                text: "Presente",
                className: "bg-green-500 hover:bg-green-600",
            },
            absent: { variant: "destructive", text: "Ausente", className: "" },
            late: {
                variant: "secondary",
                text: "Atrasado",
                className: "bg-yellow-500 hover:bg-yellow-600",
            },
        };

        const config = variants[status] || {
            variant: "outline",
            text: "Pendente",
            className: "",
        };

        return (
            <Badge variant={config.variant} className={config.className}>
                {config.text}
            </Badge>
        );
    };

    const filteredAttendance = attendanceData.filter(
        (record) =>
            record.studentName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            record.studentEmail
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const presentCount = attendanceData.filter(
        (r) => r.status === "present"
    ).length;
    const absentCount = attendanceData.filter(
        (r) => r.status === "absent"
    ).length;
    const lateCount = attendanceData.filter((r) => r.status === "late").length;
    const totalStudents = attendanceData.length;

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-blue-300" />
                        <h1 className="text-3xl font-bold text-white">
                            Controle de Presença
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                            onClick={() => window.print()}
                        >
                            Imprimir Lista
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={saveAttendance}
                            disabled={
                                !selectedClass || attendanceData.length === 0
                            }
                        >
                            Salvar Presença
                        </Button>
                    </div>
                </div>

                {/* Filtros */}
                <GlassCard className="p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Turma
                            </label>
                            <Select
                                value={selectedClass}
                                onValueChange={setSelectedClass}
                            >
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue placeholder="Selecione uma turma" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes &&
                                        classes.length > 0 &&
                                        classes.map((cls) => (
                                            <SelectItem
                                                key={cls.id}
                                                value={cls.id.toString()}
                                            >
                                                {cls.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Data
                            </label>
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="bg-white/10 border-white/20 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Buscar Aluno
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Nome ou email..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10 bg-white/10 border-white/20 text-white"
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10"
                                onClick={loadAttendanceData}
                                disabled={!selectedClass}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Atualizar
                            </Button>
                        </div>
                    </div>
                </GlassCard>

                {/* Estatísticas */}
                {totalStudents > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <GlassCard className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                    {totalStudents}
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Total de Alunos
                                </div>
                            </div>
                        </GlassCard>
                        <GlassCard className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-300">
                                    {presentCount}
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Presentes
                                </div>
                                <div className="text-green-300 text-xs">
                                    {totalStudents > 0
                                        ? Math.round(
                                              (presentCount / totalStudents) *
                                                  100
                                          )
                                        : 0}
                                    %
                                </div>
                            </div>
                        </GlassCard>
                        <GlassCard className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-300">
                                    {absentCount}
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Ausentes
                                </div>
                                <div className="text-red-300 text-xs">
                                    {totalStudents > 0
                                        ? Math.round(
                                              (absentCount / totalStudents) *
                                                  100
                                          )
                                        : 0}
                                    %
                                </div>
                            </div>
                        </GlassCard>
                        <GlassCard className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-300">
                                    {lateCount}
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Atrasados
                                </div>
                                <div className="text-yellow-300 text-xs">
                                    {totalStudents > 0
                                        ? Math.round(
                                              (lateCount / totalStudents) * 100
                                          )
                                        : 0}
                                    %
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                )}

                {/* Lista de Presença */}
                <GlassCard className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-blue-300" />
                        <h3 className="text-xl font-semibold text-white">
                            Lista de Presença
                        </h3>
                        {selectedClass && (
                            <Badge variant="outline" className="ml-2">
                                {
                                    classes.find(
                                        (c) => c.id.toString() === selectedClass
                                    )?.name
                                }
                            </Badge>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="text-white">Carregando...</div>
                        </div>
                    ) : !selectedClass ? (
                        <div className="text-center py-8">
                            <div className="text-blue-200">
                                Selecione uma turma para visualizar a lista de
                                presença
                            </div>
                        </div>
                    ) : filteredAttendance.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-blue-200">
                                Nenhum aluno encontrado
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead className="text-white">
                                            #
                                        </TableHead>
                                        <TableHead className="text-white">
                                            Aluno
                                        </TableHead>
                                        <TableHead className="text-white">
                                            Email
                                        </TableHead>
                                        <TableHead className="text-white">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-white">
                                            Horário
                                        </TableHead>
                                        <TableHead className="text-white">
                                            Ações
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAttendance.map((record, index) => (
                                        <TableRow
                                            key={record.studentId}
                                            className="border-white/10"
                                        >
                                            <TableCell className="text-white font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="text-white">
                                                {record.studentName}
                                            </TableCell>
                                            <TableCell className="text-blue-200">
                                                {record.studentEmail}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(
                                                        record.status
                                                    )}
                                                    {getStatusBadge(
                                                        record.status
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-blue-200">
                                                {record.checkedAt || "-"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                                        onClick={() =>
                                                            updateAttendance(
                                                                record.studentId,
                                                                "present"
                                                            )
                                                        }
                                                    >
                                                        Presente
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                                                        onClick={() =>
                                                            updateAttendance(
                                                                record.studentId,
                                                                "late"
                                                            )
                                                        }
                                                    >
                                                        Atrasado
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                        onClick={() =>
                                                            updateAttendance(
                                                                record.studentId,
                                                                "absent"
                                                            )
                                                        }
                                                    >
                                                        Ausente
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </GlassCard>
            </div>
        </div>
    );
};

export default Attendance;
