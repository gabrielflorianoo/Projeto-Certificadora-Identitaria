import { body, validationResult } from "express-validator";
import prisma from "../utils/prisma.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Volunteer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do voluntário
 *         name:
 *           type: string
 *           description: Nome do voluntário
 *         email:
 *           type: string
 *           description: Email do voluntário
 *         role:
 *           type: string
 *           enum: [VOLUNTEER]
 *           description: Role do usuário (sempre VOLUNTEER)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 *         enrollments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Enrollment'
 *           description: Matrículas do voluntário
 *     VolunteerStats:
 *       type: object
 *       properties:
 *         totalWorkshops:
 *           type: integer
 *           description: Total de workshops participados
 *         completedWorkshops:
 *           type: integer
 *           description: Workshops concluídos
 *         hoursVolunteered:
 *           type: number
 *           description: Horas de voluntariado
 *         averageAttendance:
 *           type: number
 *           description: Taxa média de presença
 */

// Validações
export const updateVolunteerValidation = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Nome deve ter pelo menos 2 caracteres"),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Email inválido"),
];

// Listar todos os voluntários (ADMIN e TEACHER)
export const getAllVolunteers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const offset = (page - 1) * limit;

        const where = {
            role: "VOLUNTEER",
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            }),
        };

        const [volunteers, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    enrollments: {
                        include: {
                            workshop: {
                                select: {
                                    id: true,
                                    title: true,
                                    startDate: true,
                                    endDate: true,
                                },
                            },
                        },
                    },
                    attendances: {
                        include: {
                            class: {
                                include: {
                                    workshop: {
                                        select: {
                                            title: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                skip: offset,
                take: parseInt(limit),
                orderBy: { createdAt: "desc" },
            }),
            prisma.user.count({ where }),
        ]);

        res.json({
            volunteers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Obter voluntário por ID
export const getVolunteerById = async (req, res) => {
    try {
        const { id } = req.params;

        const volunteer = await prisma.user.findUnique({
            where: { 
                id: parseInt(id),
                role: "VOLUNTEER"
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                enrollments: {
                    include: {
                        workshop: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                startDate: true,
                                endDate: true,
                                maxParticipants: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
                attendances: {
                    include: {
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
                    orderBy: { createdAt: "desc" },
                },
                grades: {
                    include: {
                        workshop: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                        class: {
                            select: {
                                id: true,
                                subject: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!volunteer) {
            return res.status(404).json({ error: "Voluntário não encontrado" });
        }

        res.json(volunteer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Atualizar dados do voluntário
export const updateVolunteer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, email } = req.body;

        // Verificar se o voluntário existe
        const existingVolunteer = await prisma.user.findUnique({
            where: { 
                id: parseInt(id),
                role: "VOLUNTEER"
            },
        });

        if (!existingVolunteer) {
            return res.status(404).json({ error: "Voluntário não encontrado" });
        }

        // Verificar se o email já está em uso por outro usuário
        if (email && email !== existingVolunteer.email) {
            const emailInUse = await prisma.user.findUnique({
                where: { email },
            });

            if (emailInUse) {
                return res.status(400).json({ error: "Email já está em uso" });
            }
        }

        const updatedVolunteer = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(email && { email }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json({
            message: "Voluntário atualizado com sucesso",
            volunteer: updatedVolunteer,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Obter estatísticas do voluntário
export const getVolunteerStats = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se o voluntário existe
        const volunteer = await prisma.user.findUnique({
            where: { 
                id: parseInt(id),
                role: "VOLUNTEER"
            },
        });

        if (!volunteer) {
            return res.status(404).json({ error: "Voluntário não encontrado" });
        }

        // Buscar estatísticas
        const [enrollments, attendances, grades] = await Promise.all([
            prisma.enrollment.findMany({
                where: { userId: parseInt(id) },
                include: {
                    workshop: {
                        select: {
                            startDate: true,
                            endDate: true,
                        },
                    },
                },
            }),
            prisma.attendance.findMany({
                where: { userId: parseInt(id) },
                include: {
                    class: {
                        include: {
                            workshop: true,
                        },
                    },
                },
            }),
            prisma.grade.findMany({
                where: { userId: parseInt(id) },
                include: {
                    workshop: {
                        select: {
                            title: true,
                        },
                    },
                },
            }),
        ]);

        // Calcular estatísticas
        const totalWorkshops = enrollments.length;
        const completedWorkshops = enrollments.filter(
            (enrollment) => enrollment.status === "COMPLETED"
        ).length;

        const totalAttendances = attendances.length;
        const presentAttendances = attendances.filter(
            (attendance) => attendance.present
        ).length;
        const averageAttendance = totalAttendances > 0 
            ? (presentAttendances / totalAttendances) * 100 
            : 0;

        // Calcular horas de voluntariado (estimativa baseada nas presenças)
        const hoursVolunteered = presentAttendances * 2; // Assumindo 2 horas por aula

        const averageGrade = grades.length > 0
            ? grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length
            : 0;

        const stats = {
            totalWorkshops,
            completedWorkshops,
            hoursVolunteered,
            averageAttendance: Math.round(averageAttendance * 100) / 100,
            averageGrade: Math.round(averageGrade * 100) / 100,
            totalAttendances,
            presentAttendances,
            totalGrades: grades.length,
        };

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Listar workshops do voluntário
export const getVolunteerWorkshops = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.query;

        // Verificar se o voluntário existe
        const volunteer = await prisma.user.findUnique({
            where: { 
                id: parseInt(id),
                role: "VOLUNTEER"
            },
        });

        if (!volunteer) {
            return res.status(404).json({ error: "Voluntário não encontrado" });
        }

        const where = {
            userId: parseInt(id),
            ...(status && { status }),
        };

        const enrollments = await prisma.enrollment.findMany({
            where,
            include: {
                workshop: {
                    include: {
                        classes: {
                            select: {
                                id: true,
                                date: true,
                                subject: true,
                            },
                            orderBy: { date: "asc" },
                        },
                        _count: {
                            select: {
                                enrollments: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        res.json(enrollments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Listar presenças do voluntário
export const getVolunteerAttendances = async (req, res) => {
    try {
        const { id } = req.params;
        const { workshopId, startDate, endDate } = req.query;

        // Verificar se o voluntário existe
        const volunteer = await prisma.user.findUnique({
            where: { 
                id: parseInt(id),
                role: "VOLUNTEER"
            },
        });

        if (!volunteer) {
            return res.status(404).json({ error: "Voluntário não encontrado" });
        }

        const where = {
            userId: parseInt(id),
            ...(workshopId && {
                class: {
                    workshopId: parseInt(workshopId),
                },
            }),
            ...(startDate && endDate && {
                class: {
                    date: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
            }),
        };

        const attendances = await prisma.attendance.findMany({
            where,
            include: {
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
            orderBy: { createdAt: "desc" },
        });

        res.json(attendances);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
