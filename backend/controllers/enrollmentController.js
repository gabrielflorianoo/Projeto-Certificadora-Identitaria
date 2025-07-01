import { body, validationResult } from "express-validator";
import prisma from "../utils/prisma.js";

// Validadores
export const createEnrollmentValidation = [
    body("workshopId").isInt({ min: 1 }).withMessage("ID do workshop inválido"),
    body("status")
        .optional()
        .isIn(["PENDING", "APPROVED", "REJECTED"])
        .withMessage("Status inválido"),
];

// Listar todas as matrículas
export const getAllEnrollments = async (req, res) => {
    try {
        const { page = 1, limit = 10, workshopId, userId, status } = req.query;
        const skip = (page - 1) * limit;

        const where = {};
        if (workshopId) where.workshopId = parseInt(workshopId);
        if (userId) where.userId = parseInt(userId);
        if (status) where.status = status;

        const enrollments = await prisma.enrollment.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                workshop: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        startDate: true,
                        endDate: true,
                    },
                },
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { createdAt: "desc" },
        });

        const total = await prisma.enrollment.count({ where });

        res.json({
            enrollments,
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

// Obter matrícula por ID
export const getEnrollmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const enrollment = await prisma.enrollment.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                workshop: true,
            },
        });

        if (!enrollment) {
            return res.status(404).json({ error: "Matrícula não encontrada" });
        }

        res.json(enrollment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Criar matrícula (estudante se matricula ou admin matricula alguém)
export const createEnrollment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { workshopId, userId } = req.body;
        const targetUserId = userId || req.user.id; // Se não especificar userId, usa o próprio usuário

        // Verificar se não é admin tentando matricular outro usuário
        if (userId && req.user.role !== "ADMIN" && userId !== req.user.id) {
            return res
                .status(403)
                .json({
                    error: "Apenas administradores podem matricular outros usuários",
                });
        }

        // Verificar se o workshop existe
        const workshop = await prisma.workshop.findUnique({
            where: { id: parseInt(workshopId) },
            include: {
                _count: {
                    select: {
                        enrollments: {
                            where: {
                                status: "APPROVED",
                            },
                        },
                    },
                },
            },
        });

        if (!workshop) {
            return res.status(404).json({ error: "Workshop não encontrado" });
        }

        // Verificar se há vagas disponíveis
        if (workshop._count.enrollments >= workshop.maxParticipants) {
            return res.status(400).json({ error: "Workshop lotado" });
        }

        // Verificar se o usuário já está matriculado
        const existingEnrollment = await prisma.enrollment.findFirst({
            where: {
                userId: targetUserId,
                workshopId: parseInt(workshopId),
            },
        });

        if (existingEnrollment) {
            return res
                .status(400)
                .json({ error: "Usuário já está matriculado neste workshop" });
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                userId: targetUserId,
                workshopId: parseInt(workshopId),
                status: req.user.role === "ADMIN" ? "APPROVED" : "PENDING",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                workshop: true,
            },
        });

        res.status(201).json({
            message: "Matrícula criada com sucesso",
            enrollment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Atualizar status da matrícula (apenas ADMIN)
export const updateEnrollmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({ error: "Status inválido" });
        }

        const enrollment = await prisma.enrollment.findUnique({
            where: { id: parseInt(id) },
        });

        if (!enrollment) {
            return res.status(404).json({ error: "Matrícula não encontrada" });
        }

        const updatedEnrollment = await prisma.enrollment.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                workshop: true,
            },
        });

        res.json({
            message: "Status da matrícula atualizado com sucesso",
            enrollment: updatedEnrollment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Deletar matrícula
export const deleteEnrollment = async (req, res) => {
    try {
        const { id } = req.params;

        const enrollment = await prisma.enrollment.findUnique({
            where: { id: parseInt(id) },
        });

        if (!enrollment) {
            return res.status(404).json({ error: "Matrícula não encontrada" });
        }

        // Verificar se o usuário pode deletar a matrícula
        if (req.user.role !== "ADMIN" && enrollment.userId !== req.user.id) {
            return res.status(403).json({ error: "Acesso negado" });
        }

        await prisma.enrollment.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: "Matrícula deletada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
