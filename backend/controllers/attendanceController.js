import { body, validationResult } from "express-validator";
import prisma from "../utils/prisma.js";

// Validadores
export const createAttendanceValidation = [
    body("userId").isInt({ min: 1 }).withMessage("ID do usuário inválido"),
    body("classId").isInt({ min: 1 }).withMessage("ID da aula inválido"),
    body("present").isBoolean().withMessage("Presença deve ser true ou false"),
];

export const updateAttendanceValidation = [
    body("present").isBoolean().withMessage("Presença deve ser true ou false"),
];

// Listar todas as presenças
export const getAllAttendances = async (req, res) => {
    try {
        const { page = 1, limit = 10, classId, userId, present } = req.query;
        const skip = (page - 1) * limit;

        const where = {};
        if (classId) where.classId = parseInt(classId);
        if (userId) where.userId = parseInt(userId);
        if (present !== undefined) where.present = present === "true";

        const attendances = await prisma.attendance.findMany({
            where,
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                class: {
                    include: {
                        workshop: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { createdAt: "desc" },
        });

        const total = await prisma.attendance.count({ where });

        res.json({
            attendances,
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

// Obter presença por ID
export const getAttendanceById = async (req, res) => {
    try {
        const { id } = req.params;

        const attendance = await prisma.attendance.findUnique({
            where: { id: parseInt(id) },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                class: {
                    include: {
                        workshop: true,
                        teacher: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        if (!attendance) {
            return res.status(404).json({ error: "Presença não encontrada" });
        }

        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Criar presença (TEACHER ou ADMIN)
export const createAttendance = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, classId, present } = req.body;

        // Verificar se a aula existe
        const classData = await prisma.class.findUnique({
            where: { id: parseInt(classId) },
            include: {
                workshop: true,
            },
        });

        if (!classData) {
            return res.status(404).json({ error: "Aula não encontrada" });
        }

        // Verificar se o professor pode marcar presença nesta aula
        if (
            req.user.role === "TEACHER" &&
            req.user.id !== classData.taughtById
        ) {
            return res
                .status(403)
                .json({
                    error: "Professores só podem marcar presença em suas próprias aulas",
                });
        }

        // Verificar se o usuário está matriculado no workshop
        const enrollment = await prisma.enrollment.findFirst({
            where: {
                userId: parseInt(userId),
                workshopId: classData.workshopId,
                status: "APPROVED",
            },
        });

        if (!enrollment) {
            return res
                .status(400)
                .json({ error: "Usuário não está matriculado neste workshop" });
        }

        // Verificar se a presença já foi registrada
        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                userId: parseInt(userId),
                classId: parseInt(classId),
            },
        });

        if (existingAttendance) {
            return res
                .status(400)
                .json({
                    error: "Presença já foi registrada para este aluno nesta aula",
                });
        }

        const attendance = await prisma.attendance.create({
            data: {
                userId: parseInt(userId),
                classId: parseInt(classId),
                present,
            },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                class: {
                    include: {
                        workshop: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
            },
        });

        res.status(201).json({
            message: "Presença registrada com sucesso",
            attendance,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Atualizar presença
export const updateAttendance = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { present } = req.body;

        const existingAttendance = await prisma.attendance.findUnique({
            where: { id: parseInt(id) },
            include: {
                class: true,
            },
        });

        if (!existingAttendance) {
            return res.status(404).json({ error: "Presença não encontrada" });
        }

        // Verificar permissões
        if (
            req.user.role === "TEACHER" &&
            req.user.id !== existingAttendance.class.taughtById
        ) {
            return res
                .status(403)
                .json({
                    error: "Professores só podem editar presenças de suas próprias aulas",
                });
        }

        const updatedAttendance = await prisma.attendance.update({
            where: { id: parseInt(id) },
            data: { present },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                class: {
                    include: {
                        workshop: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
            },
        });

        res.json({
            message: "Presença atualizada com sucesso",
            attendance: updatedAttendance,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Deletar presença
export const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;

        const attendance = await prisma.attendance.findUnique({
            where: { id: parseInt(id) },
            include: {
                class: true,
            },
        });

        if (!attendance) {
            return res.status(404).json({ error: "Presença não encontrada" });
        }

        // Verificar permissões
        if (
            req.user.role === "TEACHER" &&
            req.user.id !== attendance.class.taughtById
        ) {
            return res
                .status(403)
                .json({
                    error: "Professores só podem deletar presenças de suas próprias aulas",
                });
        }

        await prisma.attendance.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: "Presença deletada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Marcar presença em lote para uma aula
export const bulkCreateAttendance = async (req, res) => {
    try {
        const { classId, attendances } = req.body;

        if (!Array.isArray(attendances) || attendances.length === 0) {
            return res
                .status(400)
                .json({ error: "Lista de presenças inválida" });
        }

        // Verificar se a aula existe
        const classData = await prisma.class.findUnique({
            where: { id: parseInt(classId) },
        });

        if (!classData) {
            return res.status(404).json({ error: "Aula não encontrada" });
        }

        // Verificar permissões
        if (
            req.user.role === "TEACHER" &&
            req.user.id !== classData.taughtById
        ) {
            return res
                .status(403)
                .json({
                    error: "Professores só podem marcar presença em suas próprias aulas",
                });
        }

        const attendanceData = attendances.map((attendance) => ({
            userId: parseInt(attendance.userId),
            classId: parseInt(classId),
            present: attendance.present,
        }));

        const createdAttendances = await prisma.attendance.createMany({
            data: attendanceData,
            skipDuplicates: true,
        });

        res.status(201).json({
            message: "Presenças registradas com sucesso",
            count: createdAttendances.count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
