import { body, validationResult } from "express-validator";
import prisma from "../utils/prisma.js";

// Validadores
export const createGradeValidation = [
    body("userId").isInt({ min: 1 }).withMessage("ID do usuário inválido"),
    body("grade")
        .isFloat({ min: 0, max: 10 })
        .withMessage("Nota deve estar entre 0 e 10"),
    body("classId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("ID da aula inválido"),
    body("workshopId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("ID do workshop inválido"),
    body("notes")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Observações devem ter no máximo 500 caracteres"),
];

export const updateGradeValidation = [
    body("grade")
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage("Nota deve estar entre 0 e 10"),
    body("notes")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Observações devem ter no máximo 500 caracteres"),
];

// Listar todas as notas
export const getAllGrades = async (req, res) => {
    try {
        const { page = 1, limit = 10, classId, workshopId, userId } = req.query;
        const skip = (page - 1) * limit;

        const where = {};
        if (classId) where.classId = parseInt(classId);
        if (workshopId) where.workshopId = parseInt(workshopId);
        if (userId) where.userId = parseInt(userId);

        const grades = await prisma.grade.findMany({
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
                workshop: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { createdAt: "desc" },
        });

        const total = await prisma.grade.count({ where });

        res.json({
            grades,
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

// Obter nota por ID
export const getGradeById = async (req, res) => {
    try {
        const { id } = req.params;

        const grade = await prisma.grade.findUnique({
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
                workshop: true,
            },
        });

        if (!grade) {
            return res.status(404).json({ error: "Nota não encontrada" });
        }

        res.json(grade);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Criar nota (TEACHER ou ADMIN)
export const createGrade = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, grade, classId, workshopId, notes } = req.body;

        // Deve ter pelo menos classId ou workshopId
        if (!classId && !workshopId) {
            return res
                .status(400)
                .json({ error: "Deve especificar classId ou workshopId" });
        }

        let targetClassId = classId ? parseInt(classId) : null;
        let targetWorkshopId = workshopId ? parseInt(workshopId) : null;

        // Se fornecido classId, verificar se a aula existe e obter workshopId
        if (targetClassId) {
            const classData = await prisma.class.findUnique({
                where: { id: targetClassId },
            });

            if (!classData) {
                return res.status(404).json({ error: "Aula não encontrada" });
            }

            // Verificar se o professor pode dar nota nesta aula
            if (
                req.user.role === "TEACHER" &&
                req.user.id !== classData.taughtById
            ) {
                return res
                    .status(403)
                    .json({
                        error: "Professores só podem dar notas em suas próprias aulas",
                    });
            }

            targetWorkshopId = classData.workshopId;
        } else {
            // Se apenas workshopId, verificar se o workshop existe
            const workshop = await prisma.workshop.findUnique({
                where: { id: targetWorkshopId },
            });

            if (!workshop) {
                return res
                    .status(404)
                    .json({ error: "Workshop não encontrado" });
            }
        }

        // Verificar se o usuário está matriculado no workshop
        const enrollment = await prisma.enrollment.findFirst({
            where: {
                userId: parseInt(userId),
                workshopId: targetWorkshopId,
                status: "APPROVED",
            },
        });

        if (!enrollment) {
            return res
                .status(400)
                .json({ error: "Usuário não está matriculado neste workshop" });
        }

        // Verificar se já existe nota para este usuário nesta aula/workshop
        const existingGrade = await prisma.grade.findFirst({
            where: {
                userId: parseInt(userId),
                ...(targetClassId && { classId: targetClassId }),
                ...(targetWorkshopId &&
                    !targetClassId && {
                        workshopId: targetWorkshopId,
                        classId: null,
                    }),
            },
        });

        if (existingGrade) {
            return res
                .status(400)
                .json({ error: "Nota já foi registrada para este aluno" });
        }

        const gradeData = await prisma.grade.create({
            data: {
                userId: parseInt(userId),
                grade: parseFloat(grade),
                classId: targetClassId,
                workshopId: targetWorkshopId,
                notes: notes || null,
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
                workshop: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        res.status(201).json({
            message: "Nota registrada com sucesso",
            grade: gradeData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Atualizar nota
export const updateGrade = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { grade, notes } = req.body;

        const existingGrade = await prisma.grade.findUnique({
            where: { id: parseInt(id) },
            include: {
                class: true,
            },
        });

        if (!existingGrade) {
            return res.status(404).json({ error: "Nota não encontrada" });
        }

        // Verificar permissões
        if (
            req.user.role === "TEACHER" &&
            existingGrade.class &&
            req.user.id !== existingGrade.class.taughtById
        ) {
            return res
                .status(403)
                .json({
                    error: "Professores só podem editar notas de suas próprias aulas",
                });
        }

        const updateData = {};
        if (grade !== undefined) updateData.grade = parseFloat(grade);
        if (notes !== undefined) updateData.notes = notes;

        const updatedGrade = await prisma.grade.update({
            where: { id: parseInt(id) },
            data: updateData,
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
                workshop: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        res.json({
            message: "Nota atualizada com sucesso",
            grade: updatedGrade,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Deletar nota
export const deleteGrade = async (req, res) => {
    try {
        const { id } = req.params;

        const grade = await prisma.grade.findUnique({
            where: { id: parseInt(id) },
            include: {
                class: true,
            },
        });

        if (!grade) {
            return res.status(404).json({ error: "Nota não encontrada" });
        }

        // Verificar permissões
        if (
            req.user.role === "TEACHER" &&
            grade.class &&
            req.user.id !== grade.class.taughtById
        ) {
            return res
                .status(403)
                .json({
                    error: "Professores só podem deletar notas de suas próprias aulas",
                });
        }

        await prisma.grade.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: "Nota deletada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Obter relatório de notas de um workshop
export const getWorkshopGradesReport = async (req, res) => {
    try {
        const { workshopId } = req.params;

        const workshop = await prisma.workshop.findUnique({
            where: { id: parseInt(workshopId) },
            include: {
                enrollments: {
                    where: { status: "APPROVED" },
                    include: {
                        user: {
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
                        class: {
                            select: {
                                id: true,
                                subject: true,
                                date: true,
                            },
                        },
                    },
                },
            },
        });

        if (!workshop) {
            return res.status(404).json({ error: "Workshop não encontrado" });
        }

        // Calcular média de notas por aluno
        const studentsWithGrades = workshop.enrollments.map((enrollment) => {
            const studentGrades = workshop.grades.filter(
                (grade) => grade.userId === enrollment.user.id,
            );
            const averageGrade =
                studentGrades.length > 0
                    ? studentGrades.reduce(
                          (sum, grade) => sum + grade.grade,
                          0,
                      ) / studentGrades.length
                    : null;

            return {
                student: enrollment.user,
                grades: studentGrades,
                averageGrade: averageGrade
                    ? parseFloat(averageGrade.toFixed(2))
                    : null,
            };
        });

        res.json({
            workshop: {
                id: workshop.id,
                title: workshop.title,
                description: workshop.description,
            },
            studentsWithGrades,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
