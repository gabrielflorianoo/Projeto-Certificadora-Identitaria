import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import GlassCard from "../components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Users,
    Search,
    Eye,
    Edit,
    BarChart3,
    Calendar,
    Trophy,
    Clock,
} from "lucide-react";
import { 
    listVolunteers, 
    getVolunteerById, 
    getVolunteerStats,
    updateVolunteer 
} from "../lib/server";

const Volunteers = () => {
    const { user } = useAuth();
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [volunteerStats, setVolunteerStats] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });

    useEffect(() => {
        fetchVolunteers();
    }, [pagination.page, searchTerm]);

    const fetchVolunteers = async () => {
        try {
            setLoading(true);
            const response = await listVolunteers({
                page: pagination.page,
                limit: pagination.limit,
                search: searchTerm,
            });
            setVolunteers(response.volunteers);
            setPagination(response.pagination);
        } catch (error) {
            console.error("Erro ao buscar voluntários:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewVolunteer = async (volunteerId) => {
        try {
            const [volunteerData, statsData] = await Promise.all([
                getVolunteerById(volunteerId),
                getVolunteerStats(volunteerId),
            ]);
            setSelectedVolunteer(volunteerData);
            setVolunteerStats(statsData);
        } catch (error) {
            console.error("Erro ao buscar dados do voluntário:", error);
        }
    };

    const handleUpdateVolunteer = async (volunteerId, data) => {
        try {
            await updateVolunteer(volunteerId, data);
            fetchVolunteers();
            setIsEditDialogOpen(false);
            setSelectedVolunteer(null);
        } catch (error) {
            console.error("Erro ao atualizar voluntário:", error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("pt-BR");
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { label: "Pendente", variant: "secondary" },
            ACTIVE: { label: "Ativo", variant: "default" },
            COMPLETED: { label: "Concluído", variant: "outline" },
            CANCELLED: { label: "Cancelado", variant: "destructive" },
        };
        const statusInfo = statusMap[status] || { label: status, variant: "secondary" };
        return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
    };

    if (loading && volunteers.length === 0) {
        return (
            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-white text-lg">Carregando voluntários...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-300" />
                        <h1 className="text-3xl font-bold text-white">
                            Voluntários
                        </h1>
                    </div>
                </div>

                {/* Filtros */}
                <GlassCard className="p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por nome ou email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Estatísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <GlassCard className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">
                                {pagination.total}
                            </div>
                            <div className="text-blue-200 text-sm">
                                Total de Voluntários
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-300">
                                {volunteers.filter(v => v.enrollments?.length > 0).length}
                            </div>
                            <div className="text-blue-200 text-sm">
                                Voluntários Ativos
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-300">
                                {volunteers.reduce((acc, v) => acc + (v.enrollments?.length || 0), 0)}
                            </div>
                            <div className="text-blue-200 text-sm">
                                Total de Matrículas
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Tabela de voluntários */}
                <GlassCard className="p-6">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-blue-200">Nome</TableHead>
                                    <TableHead className="text-blue-200">Email</TableHead>
                                    <TableHead className="text-blue-200">Matérias</TableHead>
                                    <TableHead className="text-blue-200">Cadastrado em</TableHead>
                                    <TableHead className="text-blue-200">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {volunteers.map((volunteer) => (
                                    <TableRow key={volunteer.id}>
                                        <TableCell className="text-white">
                                            {volunteer.name}
                                        </TableCell>
                                        <TableCell className="text-gray-300">
                                            {volunteer.email}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Badge variant="outline">
                                                    {volunteer.enrollments?.length || 0} matéria{volunteer.enrollments?.length === 1 ? '' : 's'}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-300">
                                            {formatDate(volunteer.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleViewVolunteer(volunteer.id)}
                                                            className="border-white/20 text-white hover:bg-white/10"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black/90 border-white/20">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-white">
                                                                Detalhes do Voluntário
                                                            </DialogTitle>
                                                            <DialogDescription className="text-gray-300">
                                                                Informações completas e estatísticas do voluntário
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        {selectedVolunteer && volunteerStats && (
                                                            <div className="space-y-6">
                                                                {/* Informações básicas */}
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h3 className="text-lg font-semibold text-white mb-2">
                                                                            Informações Pessoais
                                                                        </h3>
                                                                        <div className="space-y-2 text-gray-300">
                                                                            <p><strong>Nome:</strong> {selectedVolunteer.name}</p>
                                                                            <p><strong>Email:</strong> {selectedVolunteer.email}</p>
                                                                            <p><strong>Cadastrado em:</strong> {formatDate(selectedVolunteer.createdAt)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-lg font-semibold text-white mb-2">
                                                                            Estatísticas
                                                                        </h3>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div className="bg-white/5 p-2 rounded text-center">
                                                                                <div className="text-lg font-bold text-blue-300">
                                                                                    {volunteerStats.totalWorkshops}
                                                                                </div>
                                                                                <div className="text-xs text-gray-400">Workshops</div>
                                                                            </div>
                                                                            <div className="bg-white/5 p-2 rounded text-center">
                                                                                <div className="text-lg font-bold text-green-300">
                                                                                    {volunteerStats.completedWorkshops}
                                                                                </div>
                                                                                <div className="text-xs text-gray-400">Concluídos</div>
                                                                            </div>
                                                                            <div className="bg-white/5 p-2 rounded text-center">
                                                                                <div className="text-lg font-bold text-purple-300">
                                                                                    {volunteerStats.hoursVolunteered}h
                                                                                </div>
                                                                                <div className="text-xs text-gray-400">Horas</div>
                                                                            </div>
                                                                            <div className="bg-white/5 p-2 rounded text-center">
                                                                                <div className="text-lg font-bold text-yellow-300">
                                                                                    {volunteerStats.averageAttendance}%
                                                                                </div>
                                                                                <div className="text-xs text-gray-400">Presença</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Workshops matriculados */}
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-white mb-2">
                                                                        Workshops Matriculados
                                                                    </h3>
                                                                    <div className="space-y-2">
                                                                        {selectedVolunteer.enrollments?.map((enrollment) => (
                                                                            <div key={enrollment.id} className="bg-white/5 p-3 rounded flex justify-between items-center">
                                                                                <div>
                                                                                    <div className="text-white font-medium">
                                                                                        {enrollment.workshop.title}
                                                                                    </div>
                                                                                    <div className="text-gray-400 text-sm">
                                                                                        {formatDate(enrollment.workshop.startDate)} - {formatDate(enrollment.workshop.endDate)}
                                                                                    </div>
                                                                                </div>
                                                                                {getStatusBadge(enrollment.status)}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                                {(user?.role === "ADMIN" || user?.id === volunteer.id) && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedVolunteer(volunteer);
                                                            setIsEditDialogOpen(true);
                                                        }}
                                                        className="border-white/20 text-white hover:bg-white/10"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Paginação */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center mt-6 gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                Anterior
                            </Button>
                            <span className="text-white flex items-center px-4">
                                Página {pagination.page} de {pagination.pages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === pagination.pages}
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                Próxima
                            </Button>
                        </div>
                    )}
                </GlassCard>

                {/* Dialog de edição */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="bg-black/90 border-white/20">
                        <DialogHeader>
                            <DialogTitle className="text-white">Editar Voluntário</DialogTitle>
                            <DialogDescription className="text-gray-300">
                                Altere as informações do voluntário
                            </DialogDescription>
                        </DialogHeader>
                        {selectedVolunteer && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    handleUpdateVolunteer(selectedVolunteer.id, {
                                        name: formData.get("name"),
                                        email: formData.get("email"),
                                    });
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="text-white text-sm font-medium">Nome</label>
                                    <Input
                                        name="name"
                                        defaultValue={selectedVolunteer.name}
                                        required
                                        className="bg-white/10 border-white/20 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-white text-sm font-medium">Email</label>
                                    <Input
                                        name="email"
                                        type="email"
                                        defaultValue={selectedVolunteer.email}
                                        required
                                        className="bg-white/10 border-white/20 text-white"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditDialogOpen(false)}
                                        className="border-white/20 text-white hover:bg-white/10"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Salvar
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Volunteers;
