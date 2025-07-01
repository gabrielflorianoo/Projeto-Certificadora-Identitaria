import { body, validationResult } from "express-validator";
import prisma from "../utils/prisma.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Workshop:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do workshop
 *         title:
 *           type: string
 *           description: Título do workshop
 *         description:
 *           type: string
 *           description: Descrição do workshop
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Data de início
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Data de fim
 *         maxParticipants:
 *           type: integer
 *           description: Número máximo de participantes
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 *         classes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Class'
 *           description: Aulas do workshop
 *         enrollments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Enrollment'
 *           description: Matrículas do workshop
 */

// Validadores
export const createWorkshopValidation = [
    body("title")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Título deve ter pelo menos 3 caracteres"),
    body("description")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Descrição deve ter pelo menos 10 caracteres"),
    body("startDate").isISO8601().withMessage("Data de início inválida"),
    body("endDate").isISO8601().withMessage("Data de fim inválida"),
    body("maxParticipants")
        .isInt({ min: 1 })
        .withMessage("Número máximo de participantes deve ser maior que 0"),
];

export const updateWorkshopValidation = [
    body("title")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("Título deve ter pelo menos 3 caracteres"),
    body("description")
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage("Descrição deve ter pelo menos 10 caracteres"),
    body("startDate")
        .optional()
        .isISO8601()
        .withMessage("Data de início inválida"),
    body("endDate").optional().isISO8601().withMessage("Data de fim inválida"),
    body("maxParticipants")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Número máximo de participantes deve ser maior que 0"),
];

// Listar todos os workshops
export const getAllWorkshops = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const workshops = await prisma.workshop.findMany({
            include: {
                _count: {
                    select: {
                        enrollments: true,
                        classes: true,
                    },
                },
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { createdAt: "desc" },
        });

        const total = await prisma.workshop.count();

        res.json({
            workshops,
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

// Obter workshop por ID
export const getWorkshopById = async (req, res) => {
    try {
        const { id } = req.params;

        const workshop = await prisma.workshop.findUnique({
            where: { id: parseInt(id) },
            include: {
                classes: {
                    include: {
                        teacher: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                enrollments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
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

        if (!workshop) {
            return res.status(404).json({ error: "Workshop não encontrado" });
        }

        res.json(workshop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Criar workshop (ADMIN ou TEACHER)
export const createWorkshop = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, startDate, endDate, maxParticipants } =
            req.body;

        // Validar se a data de fim é posterior à data de início
        if (new Date(endDate) <= new Date(startDate)) {
            return res
                .status(400)
                .json({
                    error: "Data de fim deve ser posterior à data de início",
                });
        }

        const workshop = await prisma.workshop.create({
            data: {
                title,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                maxParticipants,
            },
        });

        res.status(201).json({
            message: "Workshop criado com sucesso",
            workshop,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Atualizar workshop (ADMIN ou TEACHER)
export const updateWorkshop = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { title, description, startDate, endDate, maxParticipants } =
            req.body;

        const existingWorkshop = await prisma.workshop.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingWorkshop) {
            return res.status(404).json({ error: "Workshop não encontrado" });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (startDate) updateData.startDate = new Date(startDate);
        if (endDate) updateData.endDate = new Date(endDate);
        if (maxParticipants) updateData.maxParticipants = maxParticipants;

        // Validar datas se ambas forem fornecidas
        if (updateData.startDate && updateData.endDate) {
            if (updateData.endDate <= updateData.startDate) {
                return res
                    .status(400)
                    .json({
                        error: "Data de fim deve ser posterior à data de início",
                    });
            }
        }

        const updatedWorkshop = await prisma.workshop.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        res.json({
            message: "Workshop atualizado com sucesso",
            workshop: updatedWorkshop,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Deletar workshop (apenas ADMIN)
export const deleteWorkshop = async (req, res) => {
    try {
        const { id } = req.params;

        const workshop = await prisma.workshop.findUnique({
            where: { id: parseInt(id) },
        });

        if (!workshop) {
            return res.status(404).json({ error: "Workshop não encontrado" });
        }

        await prisma.workshop.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: "Workshop deletado com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};
