import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import prisma from "../utils/prisma.js";
import { generateToken } from "../utils/jwt.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         role:
 *           type: string
 *           enum: [ADMIN, STUDENT, VOLUNTEER, TEACHER]
 *           description: Role do usuário
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Validadores
export const registerValidation = [
    body("name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Nome deve ter pelo menos 2 caracteres"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Senha deve ter pelo menos 6 caracteres"),
    body("role")
        .isIn(["ADMIN", "STUDENT", "VOLUNTEER", "TEACHER"])
        .withMessage("Role inválido"),
];

export const loginValidation = [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Senha é obrigatória"),
];

// Registrar usuário
export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role } = req.body;

        // Verificar se o usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res
                .status(400)
                .json({ error: "Usuário já existe com este email" });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        // Gerar token
        const token = generateToken({ userId: user.id, role: user.role });

        res.status(201).json({
            message: "Usuário criado com sucesso",
            user,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Buscar usuário
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        // Gerar token
        const token = generateToken({ userId: user.id, role: user.role });

        res.json({
            message: "Login realizado com sucesso",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Obter perfil do usuário autenticado
export const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};