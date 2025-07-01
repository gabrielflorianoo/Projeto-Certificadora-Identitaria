import express from "express";
import {
    getAllWorkshops,
    getWorkshopById,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    createWorkshopValidation,
    updateWorkshopValidation,
} from "../controllers/workshopController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireAdmin, requireAdminOrTeacher } from "../middleware/roles.js";

const router = express.Router();

/**
 * @swagger
 * /api/workshops:
 *   get:
 *     tags: [Workshops]
 *     summary: Listar todos os workshops
 *     description: Retorna uma lista de todos os workshops disponíveis
 *     responses:
 *       200:
 *         description: Lista de workshops
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workshop'
 *       500:
 *         description: Erro interno do servidor
 */
// Listar todos os workshops
router.get("/", getAllWorkshops);

/**
 * @swagger
 * /api/workshops/{id}:
 *   get:
 *     tags: [Workshops]
 *     summary: Obter workshop por ID
 *     description: Retorna um workshop específico com suas aulas e matrículas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do workshop
 *     responses:
 *       200:
 *         description: Workshop encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workshop'
 *       404:
 *         description: Workshop não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 */
// Obter workshop por ID
router.get("/:id", getWorkshopById);

/**
 * @swagger
 * /api/workshops:
 *   post:
 *     tags: [Workshops]
 *     summary: Criar novo workshop
 *     description: Cria um novo workshop (requer permissão de ADMIN ou TEACHER)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - startDate
 *               - endDate
 *               - maxParticipants
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título do workshop
 *                 example: "React Avançado"
 *               description:
 *                 type: string
 *                 description: Descrição do workshop
 *                 example: "Aprenda conceitos avançados do React"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Data de início
 *                 example: "2024-06-01T00:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Data de fim
 *                 example: "2024-08-31T00:00:00.000Z"
 *               maxParticipants:
 *                 type: integer
 *                 description: Número máximo de participantes
 *                 example: 25
 *     responses:
 *       201:
 *         description: Workshop criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workshop'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
// Criar workshop (ADMIN ou TEACHER)
router.post(
    "/",
    authenticateToken,
    requireAdminOrTeacher,
    createWorkshopValidation,
    createWorkshop,
);

/**
 * @swagger
 * /api/workshops/{id}:
 *   put:
 *     tags: [Workshops]
 *     summary: Atualizar workshop
 *     description: Atualiza um workshop existente (requer permissão de ADMIN ou TEACHER)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do workshop
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               maxParticipants:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Workshop atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workshop'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Workshop não encontrado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     tags: [Workshops]
 *     summary: Deletar workshop
 *     description: Deleta um workshop (requer permissão de ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do workshop
 *     responses:
 *       200:
 *         description: Workshop deletado com sucesso
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Workshop não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
// Atualizar workshop (ADMIN ou TEACHER)
router.put(
    "/:id",
    authenticateToken,
    requireAdminOrTeacher,
    updateWorkshopValidation,
    updateWorkshop,
);

// Deletar workshop (apenas ADMIN)
router.delete("/:id", authenticateToken, requireAdmin, deleteWorkshop);

export default router;
