import { body, validationResult } from "express-validator";
import prisma from "../utils/prisma.js";

// Validadores
export const createClassValidation = [
    body("workshopId").isInt({ min: 1 }).withMessage("ID do workshop inválido"),
    body("date").isISO8601().withMessage("Data inválida"),
    body("subject")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Assunto deve ter pelo menos 3 caracteres"),
    body("taughtById")
        .isInt({ min: 1 })
        .withMessage("ID do professor inválido"),
    body("enrolledStudents")
        .isInt({ min: 0 })
        .withMessage("Número de alunos matriculados inválido"),
];

export const updateClassValidation = [
    body("date").optional().isISO8601().withMessage("Data inválida"),
    body("subject")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("Assunto deve ter pelo menos 3 caracteres"),
    body("taughtById")
        .optional()
        .isInt({ min: 1 })
        .withMessage("ID do professor inválido"),
    body("enrolledStudents")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Número de alunos matriculados inválido"),
];

// Listar todas as aulas
export const getAllClasses = async (req, res) => {
    try {
        const { page = 1, limit = 10, workshopId, taughtById } = req.query;
        const skip = (page - 1) * limit;

        const where = {};
        if (workshopId) where.workshopId = parseInt(workshopId);
        if (taughtById) where.taughtById = parseInt(taughtById);

        const classes = await prisma.class.findMany({
            where,
            include: {
                workshop: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        attendances: true,
                        grades: true,
                    },
                },
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { date: "desc" },
        });

        const total = await prisma.class.count({ where });

        res.json({
            classes,
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

// Obter aula por ID
export const getClassById = async (req, res) => {
    try {
        const { id } = req.params;

        const classData = await prisma.class.findUnique({
            where: { id: parseInt(id) },
            include: {
                workshop: true,
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                attendances: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                grades: {
                    include: {
                        student: {
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

        if (!classData) {
            return res.status(404).json({ error: "Aula não encontrada" });
        }

        res.json(classData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Criar aula (ADMIN ou TEACHER)
export const createClass = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { workshopId, date, subject, taughtById, enrolledStudents } =
            req.body;

        // Verificar se o workshop existe
        const workshop = await prisma.workshop.findUnique({
            where: { id: parseInt(workshopId) },
        });

        if (!workshop) {
            return res.status(404).json({ error: "Workshop não encontrado" });
        }

        // Verificar se o professor existe e tem role TEACHER
        const teacher = await prisma.user.findUnique({
            where: { id: parseInt(taughtById) },
        });

        if (
            !teacher ||
            (teacher.role !== "TEACHER" && teacher.role !== "ADMIN")
        ) {
            return res.status(400).json({ error: "Professor inválido" });
        }

        // Verificar se não é professor tentando criar aula para outro professor
        if (
            req.user.role === "TEACHER" &&
            req.user.id !== parseInt(taughtById)
        ) {
            return res
                .status(403)
                .json({
                    error: "Professores só podem criar suas próprias aulas",
                });
        }

        const classData = await prisma.class.create({
            data: {
                workshopId: parseInt(workshopId),
                date: new Date(date),
                subject,
                taughtById: parseInt(taughtById),
                enrolledStudents,
            },
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
        });

        res.status(201).json({
            message: "Aula criada com sucesso",
            class: classData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Atualizar aula
export const updateClass = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { date, subject, taughtById, enrolledStudents } = req.body;

        const existingClass = await prisma.class.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingClass) {
            return res.status(404).json({ error: "Aula não encontrada" });
        }

        // Verificar permissões
        if (
            req.user.role === "TEACHER" &&
            req.user.id !== existingClass.taughtById
        ) {
            return res
                .status(403)
                .json({
                    error: "Professores só podem editar suas próprias aulas",
                });
        }

        const updateData = {};
        if (date) updateData.date = new Date(date);
        if (subject) updateData.subject = subject;
        if (enrolledStudents !== undefined)
            updateData.enrolledStudents = enrolledStudents;

        // Verificar se o novo professor é válido (se fornecido)
        if (taughtById) {
            const teacher = await prisma.user.findUnique({
                where: { id: parseInt(taughtById) },
            });

            if (
                !teacher ||
                (teacher.role !== "TEACHER" && teacher.role !== "ADMIN")
            ) {
                return res.status(400).json({ error: "Professor inválido" });
            }

            updateData.taughtById = parseInt(taughtById);
        }

        const updatedClass = await prisma.class.update({
            where: { id: parseInt(id) },
            data: updateData,
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
        });

        res.json({
            message: "Aula atualizada com sucesso",
            class: updatedClass,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Deletar aula
export const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        const classData = await prisma.class.findUnique({
            where: { id: parseInt(id) },
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
                    error: "Professores só podem deletar suas próprias aulas",
                });
        }

        await prisma.class.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: "Aula deletada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const getTotalStudentsByClass = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar se o ID é válido
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: "ID de turma inválido" });
        }

        const classId = parseInt(id);

        // Verificar se a turma existe
        const classExists = await prisma.class.findUnique({
            where: { id: classId },
        });

        if (!classExists) {
            return res.status(404).json({ error: "Turma não encontrada" });
        }

        // Contar o número de alunos únicos que têm presença registrada nesta turma
        const uniqueStudents = await prisma.attendance.findMany({
            where: { classId: classId },
            distinct: ['userId'],
            select: { userId: true },
        });

        const totalStudents = uniqueStudents.length;

        res.json({ total: totalStudents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}