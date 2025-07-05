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
import { Users as UsersIcon, Settings } from "lucide-react";
import { listUsers } from "../lib/server";

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await listUsers();
                if (usersData && usersData.length > 0) {
                    setUsers(usersData);
                } else {
                    // Placeholder data
                    setUsers([
                        {
                            id: "1",
                            name: "Nenhum Usuário",
                            email: "nenhum@email.com",
                            role: "volunteer",
                            status: "inativo",
                            createdAt: new Date().toISOString(),
                        },
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
                // Placeholder data in case of error
                setUsers([
                    {
                        id: "1",
                        name: "Erro ao Carregar",
                        email: "erro@email.com",
                        role: "volunteer",
                        status: "inativo",
                        createdAt: new Date().toISOString(),
                    },
                ]);
            }
        };

        fetchUsers();
    }, []);

    const getRoleDisplayName = (role) => {
        const roleNames = {
            admin: "Administrador",
            volunteer: "Voluntário",
            coordinator: "Coordenador",
            parent: "Responsável",
        };
        return roleNames[role] || role;
    };

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

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <UsersIcon className="w-8 h-8 text-blue-300" />
                        <h1 className="text-3xl font-bold text-white">
                            Gerenciar Usuários
                        </h1>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Novo Usuário
                    </Button>
                </div>

                <GlassCard className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10">
                                <TableHead className="text-blue-200">
                                    Nome
                                </TableHead>
                                <TableHead className="text-blue-200">
                                    Email
                                </TableHead>
                                <TableHead className="text-blue-200">
                                    Função
                                </TableHead>
                                <TableHead className="text-blue-200">
                                    Status
                                </TableHead>
                                <TableHead className="text-blue-200">
                                    Data de Criação
                                </TableHead>
                                <TableHead className="text-blue-200">
                                    Ações
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="border-white/10 hover:bg-white/5"
                                >
                                    <TableCell className="text-white font-medium">
                                        {user.name}
                                    </TableCell>
                                    <TableCell className="text-blue-200">
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="text-blue-200">
                                        {getRoleDisplayName(user.role)}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(user.status)}
                                    </TableCell>
                                    <TableCell className="text-blue-200">
                                        {new Date(user.createdAt).toLocaleDateString(
                                            "pt-BR",
                                        )}
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

export default Users;
