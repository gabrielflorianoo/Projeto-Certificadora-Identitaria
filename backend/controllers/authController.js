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
 *         phone:
 *           type: string
 *           description: Telefone do usuário
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *           description: Data de nascimento
 *         age:
 *           type: integer
 *           description: Idade do usuário
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
    body("phone")
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage("Telefone deve ter entre 10 e 15 caracteres"),
    body("dateOfBirth")
        .isISO8601()
        .withMessage("Data de nascimento deve estar no formato válido (YYYY-MM-DD)"),
    body("age")
        .isInt({ min: 1, max: 120 })
        .withMessage("Idade deve ser um número entre 1 e 120"),
];

export const loginValidation = [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Senha é obrigatória"),
];

// Validador para solicitação de redefinição de senha
export const forgotPasswordValidation = [
    body("email").isEmail().withMessage("Email inválido"),
];

// Validador para redefinição de senha
export const resetPasswordValidation = [
    body("token").notEmpty().withMessage("Token é obrigatório"),
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("Nova senha deve ter pelo menos 6 caracteres"),
];

// Registrar usuário
export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role, phone, dateOfBirth, age } = req.body;

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
                phone,
                dateOfBirth: new Date(dateOfBirth),
                age: parseInt(age),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                dateOfBirth: true,
                age: true,
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
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                age: user.age,
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
                phone: true,
                dateOfBirth: true,
                age: true,
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

// Solicitar redefinição de senha
export const forgotPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        // Verificar se o usuário existe
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Por segurança, não revelamos se o email existe ou não
            return res.json({
                message: "Se o email existir em nossa base, você receberá um código de redefinição.",
            });
        }

        // TODO: Implementar geração e envio de token por email
        // Por enquanto, vamos simular com um token fixo para desenvolvimento
        const resetToken = "123456";
        
        // TODO: Armazenar o token no banco de dados com expiração
        // await prisma.passwordReset.create({
        //     data: {
        //         email,
        //         token: resetToken,
        //         expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
        //     },
        // });

        // TODO: Enviar email com o token
        console.log(`Token de redefinição para ${email}: ${resetToken}`);

        res.json({
            message: "Código de redefinição enviado para seu email.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Redefinir senha
export const resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, token, newPassword } = req.body;

        // TODO: Verificar se o token é válido e não expirou
        // const passwordReset = await prisma.passwordReset.findFirst({
        //     where: {
        //         email,
        //         token,
        //         expiresAt: { gt: new Date() },
        //     },
        // });

        // if (!passwordReset) {
        //     return res.status(400).json({ error: "Token inválido ou expirado" });
        // }

        // Por enquanto, aceitar apenas o token fixo para desenvolvimento
        if (token !== "123456") {
            return res.status(400).json({ error: "Token inválido ou expirado" });
        }

        // Verificar se o usuário existe
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }

        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atualizar a senha do usuário
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        // TODO: Remover o token usado
        // await prisma.passwordReset.delete({
        //     where: { id: passwordReset.id },
        // });

        res.json({
            message: "Senha redefinida com sucesso",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};