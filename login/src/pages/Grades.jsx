import React, { useState, useEffect } from "react";
import GlassCard from "../components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { 
    GraduationCap, 
    Edit, 
    Plus, 
    Search, 
    Filter, 
    TrendingUp, 
    TrendingDown,
    FileText,
    Download
} from "lucide-react";
import { 
    listClasses, 
    listGrades, 
    createGrade, 
    getGradeById, 
    updateGrade, 
    deleteGrade,
    listStudents
} from "../lib/server";

const Grades = () => {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [gradesData, setGradesData] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingGrade, setEditingGrade] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state for grade editing
    const [gradeForm, setGradeForm] = useState({
        studentId: "",
        subject: "",
        grade: "",
        maxGrade: "10",
        weight: "1",
        description: "",
        date: new Date().toISOString().split('T')[0]
    });

    const loadClasses = async () => {
        try {
            const classesData = await listClasses();
            setClasses(classesData);
        } catch (error) {
            console.error("Erro ao carregar classes:", error);
        }
    };
    
    const loadStudents = async () => {
        try {
            const studentsData = await listStudents();
            setStudents(studentsData || []);
        } catch (error) {
            console.error("Erro ao carregar estudantes:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await loadClasses();
                await loadStudents();
            } catch (error) {
                console.error("Erro ao carregar dados iniciais:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            loadGradesData();
        }
    }, [selectedClass]);    const loadGradesData = async () => {
        setLoading(true);
        try {
            // Temporariamente usando dados mock até o backend estar totalmente configurado
            const mockGrades = [
                {
                    id: 1,
                    studentId: 1,
                    studentName: "João Silva",
                    subject: "Matemática",
                    grade: "8.5",
                    maxGrade: "10",
                    weight: "2",
                    description: "Prova Bimestral",
                    date: "2024-01-15"
                },
                {
                    id: 2,
                    studentId: 2,
                    studentName: "Maria Santos",
                    subject: "Português",
                    grade: "9.0",
                    maxGrade: "10",
                    weight: "1",
                    description: "Trabalho em Grupo",
                    date: "2024-01-20"
                },
                {
                    id: 3,
                    studentId: 1,
                    studentName: "João Silva",
                    subject: "História",
                    grade: "7.5",
                    maxGrade: "10",
                    weight: "1",
                    description: "Seminário",
                    date: "2024-01-25"
                }
            ];

            // Filtrar por turma selecionada
            const classStudents = students.filter(student => 
                student.enrollments?.some(enrollment => enrollment.classId === parseInt(selectedClass))
            );
            
            const filteredGrades = mockGrades.filter(grade => 
                classStudents.some(student => student.id === grade.studentId)
            );

            setGradesData(filteredGrades);
        } catch (error) {
            console.error("Erro ao carregar dados de notas:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditGrade = async (grade) => {
        setEditingGrade(grade);
        setGradeForm({
            studentId: grade.studentId,
            subject: grade.subject,
            grade: grade.grade,
            maxGrade: grade.maxGrade,
            weight: grade.weight,
            description: grade.description,
            date: grade.date
        });
        setIsDialogOpen(true);
    };

    const handleAddGrade = () => {
        setEditingGrade(null);
        setGradeForm({
            studentId: "",
            subject: "",
            grade: "",
            maxGrade: "10",
            weight: "1",
            description: "",
            date: new Date().toISOString().split('T')[0]
        });
        setIsDialogOpen(true);
    };    const saveGrade = async () => {
        try {
            if (editingGrade) {
                // Atualizar nota existente
                // Temporariamente usando update local até o backend estar configurado
                setGradesData(prev => 
                    prev.map(grade => 
                        grade.id === editingGrade.id 
                            ? { 
                                ...grade, 
                                ...gradeForm,
                                studentName: students.find(s => s.id.toString() === gradeForm.studentId)?.name || grade.studentName
                            }
                            : grade
                    )
                );
            } else {
                // Adicionar nova nota
                const student = students.find(s => s.id.toString() === gradeForm.studentId);
                
                if (student) {
                    const newGrade = {
                        id: Math.max(...gradesData.map(g => g.id), 0) + 1,
                        ...gradeForm,
                        studentId: parseInt(gradeForm.studentId),
                        studentName: student.name
                    };
                    setGradesData(prev => [...prev, newGrade]);
                }
            }
            
            setIsDialogOpen(false);
            setEditingGrade(null);
            
            // Reset form
            setGradeForm({
                studentId: "",
                subject: "",
                grade: "",
                maxGrade: "10",
                weight: "1",
                description: "",
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error("Erro ao salvar nota:", error);
            alert("Erro ao salvar nota");
        }
    };

    const calculateStudentAverage = (studentId, subject = null) => {
        const studentGrades = gradesData.filter(grade => 
            grade.studentId === studentId && (subject ? grade.subject === subject : true)
        );
        
        if (studentGrades.length === 0) return 0;
        
        const totalWeighted = studentGrades.reduce((sum, grade) => 
            sum + (parseFloat(grade.grade) * parseFloat(grade.weight)), 0
        );
        const totalWeight = studentGrades.reduce((sum, grade) => 
            sum + parseFloat(grade.weight), 0
        );
        
        return totalWeight > 0 ? (totalWeighted / totalWeight).toFixed(1) : 0;
    };

    const getGradeColor = (grade, maxGrade = 10) => {
        const percentage = (parseFloat(grade) / parseFloat(maxGrade)) * 100;
        if (percentage >= 70) return "text-green-400";
        if (percentage >= 50) return "text-yellow-400";
        return "text-red-400";
    };

    const getGradeBadge = (grade, maxGrade = 10) => {
        const percentage = (parseFloat(grade) / parseFloat(maxGrade)) * 100;
        if (percentage >= 70) return { variant: "default", className: "bg-green-500 hover:bg-green-600" };
        if (percentage >= 50) return { variant: "secondary", className: "bg-yellow-500 hover:bg-yellow-600" };
        return { variant: "destructive", className: "" };
    };

    // Filtrar dados
    const filteredGrades = gradesData.filter(grade => {
        const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             grade.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             grade.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStudent = !selectedStudent || grade.studentId.toString() === selectedStudent;
        return matchesSearch && matchesStudent;
    });

    // Estatísticas
    const classAverage = gradesData.length > 0 ? 
        (gradesData.reduce((sum, grade) => sum + parseFloat(grade.grade), 0) / gradesData.length).toFixed(1) : 0;
    
    const passedStudents = students.filter(student => {
        const avg = calculateStudentAverage(student.id);
        return parseFloat(avg) >= 7.0;
    }).length;

    const subjects = [...new Set(gradesData.map(grade => grade.subject))];
    const classStudents = students.filter(student => 
        student.enrollments?.some(enrollment => enrollment.classId === parseInt(selectedClass))
    );

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="w-8 h-8 text-blue-300" />
                        <h1 className="text-3xl font-bold text-white">
                            Gerenciamento de Notas
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                            onClick={() => window.print()}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Relatório
                        </Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleAddGrade}
                            disabled={!selectedClass}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Nota
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
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue placeholder="Selecione uma turma" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes && classes.length > 0 && classes.map(cls => (
                                        <SelectItem key={cls.id} value={cls.id.toString()}>
                                            {cls.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Aluno (Opcional)
                            </label>
                            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue placeholder="Todos os alunos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Todos os alunos</SelectItem>
                                    {classStudents.map(student => (
                                        <SelectItem key={student.id} value={student.id.toString()}>
                                            {student.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Buscar
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Aluno, matéria, avaliação..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white/10 border-white/20 text-white"
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10"
                                onClick={loadGradesData}
                                disabled={!selectedClass}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Atualizar
                            </Button>
                        </div>
                    </div>
                </GlassCard>

                {/* Estatísticas */}
                {selectedClass && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <GlassCard className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                    {classStudents.length}
                                </div>
                                <div className="text-blue-200 text-sm">Total de Alunos</div>
                            </div>
                        </GlassCard>
                        <GlassCard className="p-4">
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${getGradeColor(classAverage)}`}>
                                    {classAverage}
                                </div>
                                <div className="text-blue-200 text-sm">Média da Turma</div>
                                <div className="flex items-center justify-center mt-1">
                                    {parseFloat(classAverage) >= 7 ? 
                                        <TrendingUp className="w-4 h-4 text-green-400" /> :
                                        <TrendingDown className="w-4 h-4 text-red-400" />
                                    }
                                </div>
                            </div>
                        </GlassCard>
                        <GlassCard className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-300">
                                    {passedStudents}
                                </div>
                                <div className="text-blue-200 text-sm">Aprovados</div>
                                <div className="text-green-300 text-xs">
                                    {classStudents.length > 0 ? Math.round((passedStudents / classStudents.length) * 100) : 0}%
                                </div>
                            </div>
                        </GlassCard>
                        <GlassCard className="p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-300">
                                    {subjects.length}
                                </div>
                                <div className="text-blue-200 text-sm">Matérias</div>
                            </div>
                        </GlassCard>
                    </div>
                )}

                {/* Lista de Notas */}
                <GlassCard className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-blue-300" />
                        <h3 className="text-xl font-semibold text-white">
                            Notas e Avaliações
                        </h3>
                        {selectedClass && (
                            <Badge variant="outline" className="ml-2">
                                {classes.find(c => c.id.toString() === selectedClass)?.name}
                            </Badge>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="text-white">Carregando...</div>
                        </div>
                    ) : !selectedClass ? (
                        <div className="text-center py-8">
                            <div className="text-blue-200">Selecione uma turma para visualizar as notas</div>
                        </div>
                    ) : filteredGrades.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-blue-200">Nenhuma nota encontrada</div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead className="text-white">Aluno</TableHead>
                                        <TableHead className="text-white">Matéria</TableHead>
                                        <TableHead className="text-white">Avaliação</TableHead>
                                        <TableHead className="text-white">Nota</TableHead>
                                        <TableHead className="text-white">Peso</TableHead>
                                        <TableHead className="text-white">Data</TableHead>
                                        <TableHead className="text-white">Média do Aluno</TableHead>
                                        <TableHead className="text-white">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredGrades.map((grade) => {
                                        const studentAvg = calculateStudentAverage(grade.studentId);
                                        const badgeConfig = getGradeBadge(grade.grade, grade.maxGrade);
                                        
                                        return (
                                            <TableRow key={grade.id} className="border-white/10">
                                                <TableCell className="text-white font-medium">
                                                    {grade.studentName}
                                                </TableCell>
                                                <TableCell className="text-blue-200">
                                                    {grade.subject}
                                                </TableCell>
                                                <TableCell className="text-blue-200">
                                                    {grade.description}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={badgeConfig.variant} 
                                                        className={badgeConfig.className}
                                                    >
                                                        {grade.grade}/{grade.maxGrade}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-blue-200">
                                                    {grade.weight}
                                                </TableCell>
                                                <TableCell className="text-blue-200">
                                                    {new Date(grade.date).toLocaleDateString('pt-BR')}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`font-bold ${getGradeColor(studentAvg)}`}>
                                                        {studentAvg}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-white/20 text-white hover:bg-white/10"
                                                        onClick={() => handleEditGrade(grade)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </GlassCard>

                {/* Dialog para Adicionar/Editar Nota */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="bg-black/90 border-white/20 text-white">
                        <DialogHeader>
                            <DialogTitle>
                                {editingGrade ? "Editar Nota" : "Nova Nota"}
                            </DialogTitle>
                            <DialogDescription className="text-blue-200">
                                {editingGrade ? "Edite as informações da nota" : "Adicione uma nova nota para o aluno"}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm font-medium">
                                    Aluno
                                </label>
                                <div className="col-span-3">
                                    <Select 
                                        value={gradeForm.studentId} 
                                        onValueChange={(value) => setGradeForm(prev => ({...prev, studentId: value}))}
                                        disabled={!!editingGrade}
                                    >
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                            <SelectValue placeholder="Selecione um aluno" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classStudents.map(student => (
                                                <SelectItem key={student.id} value={student.id.toString()}>
                                                    {student.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm font-medium">
                                    Matéria
                                </label>
                                <div className="col-span-3">
                                    <Input
                                        value={gradeForm.subject}
                                        onChange={(e) => setGradeForm(prev => ({...prev, subject: e.target.value}))}
                                        className="bg-white/10 border-white/20 text-white"
                                        placeholder="Ex: Matemática"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm font-medium">
                                    Avaliação
                                </label>
                                <div className="col-span-3">
                                    <Input
                                        value={gradeForm.description}
                                        onChange={(e) => setGradeForm(prev => ({...prev, description: e.target.value}))}
                                        className="bg-white/10 border-white/20 text-white"
                                        placeholder="Ex: Prova, Trabalho, Exercício"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm font-medium">
                                    Nota
                                </label>
                                <div className="col-span-1">
                                    <Input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max={gradeForm.maxGrade}
                                        value={gradeForm.grade}
                                        onChange={(e) => setGradeForm(prev => ({...prev, grade: e.target.value}))}
                                        className="bg-white/10 border-white/20 text-white"
                                    />
                                </div>
                                <label className="text-center text-sm">/</label>
                                <div className="col-span-1">
                                    <Input
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        value={gradeForm.maxGrade}
                                        onChange={(e) => setGradeForm(prev => ({...prev, maxGrade: e.target.value}))}
                                        className="bg-white/10 border-white/20 text-white"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm font-medium">
                                    Peso
                                </label>
                                <div className="col-span-3">
                                    <Select 
                                        value={gradeForm.weight} 
                                        onValueChange={(value) => setGradeForm(prev => ({...prev, weight: value}))}
                                    >
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 (Normal)</SelectItem>
                                            <SelectItem value="2">2 (Importante)</SelectItem>
                                            <SelectItem value="3">3 (Muito Importante)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm font-medium">
                                    Data
                                </label>
                                <div className="col-span-3">
                                    <Input
                                        type="date"
                                        value={gradeForm.date}
                                        onChange={(e) => setGradeForm(prev => ({...prev, date: e.target.value}))}
                                        className="bg-white/10 border-white/20 text-white"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsDialogOpen(false)}
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                onClick={saveGrade}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={!gradeForm.studentId || !gradeForm.subject || !gradeForm.grade}
                            >
                                {editingGrade ? "Salvar" : "Adicionar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Grades;
