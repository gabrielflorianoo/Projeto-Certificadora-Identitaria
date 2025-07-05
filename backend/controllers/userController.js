import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma.js";

// Validadores
export const updateUserValidation = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Nome deve ter pelo menos 2 caracteres"),
    body("email").optional().isEmail().withMessage("Email inválido"),
    body("role")
        .optional()
        .isIn(["ADMIN", "STUDENT", "VOLUNTEER", "TEACHER"])
        .withMessage("Role inválido"),
];

// Listar todos os usuários (apenas ADMIN)
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role } = req.query;
        const skip = (page - 1) * limit;

        const where = role ? { role } : {};

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                dateOfBirth: true,
                age: true,
                createdAt: true,
                updatedAt: true,
                enrollments: {
                    include: {
                        workshop: true,
                    },
                },
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { createdAt: "desc" },
        });

        const total = await prisma.user.count({ where });

        res.json({
            users,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const getAllUsersByRole = async (req, res) => {
    try {
        const role = req.params.role;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const users = await prisma.user.findMany({
            where: { role: role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                dateOfBirth: true,
                age: true,
                createdAt: true,
                updatedAt: true,
                enrollments: {
                    include: {
                        workshop: true,
                    },
                },
            },

            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { createdAt: "desc" },
        });

        const total = await prisma.user.count({ where: { role: role } });

        res.json({
            users,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Listar apenas estudantes (ADMIN, TEACHER, VOLUNTEER)
export const getStudents = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;

        const students = await prisma.user.findMany({
            where: { role: "STUDENT" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                dateOfBirth: true,
                age: true,
                createdAt: true,
                updatedAt: true,
                enrollments: {
                    include: {
                        workshop: true,
                    },
                },
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { name: "asc" },
        });

        const total = await prisma.user.count({ where: { role: "STUDENT" } });

        res.json({
            users: students,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Obter usuário por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar se o ID é válido
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: "ID de usuário inválido" });
        }

        const userId = parseInt(id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                dateOfBirth: true,
                age: true,
                createdAt: true,
                updatedAt: true,
                enrollments: {
                    include: {
                        workshop: true,
                    },
                },
                taughtClasses: {
                    include: {
                        workshop: true,
                    },
                },
                attendances: {
                    include: {
                        class: {
                            include: {
                                workshop: true,
                            },
                        },
                    },
                },
                grades: {
                    include: {
                        class: true,
                        workshop: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Atualizar usuário
export const updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, email, role, password } = req.body;

        // Validar se o ID é válido
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: "ID de usuário inválido" });
        }

        const userId = parseInt(id);

        // Verificar se o usuário existe
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Verificar se apenas o próprio usuário ou admin pode atualizar
        if (req.user.role !== "ADMIN" && req.user.id !== userId) {
            return res.status(403).json({ error: "Acesso negado" });
        }

        // Se não for admin, não pode alterar role
        if (req.user.role !== "ADMIN" && role && role !== existingUser.role) {
            return res
                .status(403)
                .json({ error: "Apenas administradores podem alterar roles" });
        }

        // Verificar se email já existe (se estiver sendo alterado)
        if (email && email !== existingUser.email) {
            const emailExists = await prisma.user.findUnique({
                where: { email },
            });
            if (emailExists) {
                return res.status(400).json({ error: "Email já está em uso" });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role && req.user.role === "ADMIN") updateData.role = role;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                dateOfBirth: true,
                age: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json({
            message: "Usuário atualizado com sucesso",
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Deletar usuário (apenas ADMIN)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar se o ID é válido
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: "ID de usuário inválido" });
        }

        const userId = parseInt(id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        res.json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
