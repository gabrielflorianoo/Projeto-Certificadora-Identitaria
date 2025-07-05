import express from "express";
import {
    getAllVolunteers,
    getVolunteerById,
    updateVolunteer,
    getVolunteerStats,
    getVolunteerWorkshops,
    getVolunteerAttendances,
    updateVolunteerValidation,
} from "../controllers/volunteerController.js";
import { authenticateToken } from "../middleware/auth.js";
import { 
    requireAdmin, 
    requireAdminOrTeacher, 
    requireOwnershipOrAdmin,
    requireOwnershipOrAdminTeacher,
    requireRole
} from "../middleware/roles.js";

const router = express.Router();

/**
 * @swagger
 * /api/volunteers:
 *   get:
 *     tags: [Volunteers]
 *     summary: Listar todos os voluntários
 *     description: Retorna uma lista paginada de todos os voluntários (acesso para ADMIN e TEACHER)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limite de itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca (nome ou email)
 *     responses:
 *       200:
 *         description: Lista de voluntários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 volunteers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Volunteer'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// Listar todos os voluntários (ADMIN e TEACHER)
router.get("/", authenticateToken, requireAdminOrTeacher, getAllVolunteers);

/**
 * @swagger
 * /api/volunteers/{id}:
 *   get:
 *     tags: [Volunteers]
 *     summary: Obter voluntário por ID
 *     description: Retorna informações detalhadas de um voluntário específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do voluntário
 *     responses:
 *       200:
 *         description: Dados do voluntário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volunteer'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Voluntário não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// Obter voluntário por ID (próprio ou admin/teacher)
router.get("/:id", authenticateToken, requireOwnershipOrAdminTeacher, getVolunteerById);

/**
 * @swagger
 * /api/volunteers/{id}:
 *   put:
 *     tags: [Volunteers]
 *     summary: Atualizar dados do voluntário
 *     description: Atualiza informações de um voluntário (próprio ou admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do voluntário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 description: Nome do voluntário
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do voluntário
 *     responses:
 *       200:
 *         description: Voluntário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 volunteer:
 *                   $ref: '#/components/schemas/Volunteer'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Voluntário não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// Atualizar dados do voluntário (próprio ou admin)
router.put(
    "/:id",
    authenticateToken,
    requireOwnershipOrAdminTeacher,
    updateVolunteerValidation,
    updateVolunteer
);

/**
 * @swagger
 * /api/volunteers/{id}/stats:
 *   get:
 *     tags: [Volunteers]
 *     summary: Obter estatísticas do voluntário
 *     description: Retorna estatísticas detalhadas de participação do voluntário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do voluntário
 *     responses:
 *       200:
 *         description: Estatísticas do voluntário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VolunteerStats'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Voluntário não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// Obter estatísticas do voluntário (próprio ou admin/teacher)
router.get("/:id/stats", authenticateToken, requireOwnershipOrAdminTeacher, getVolunteerStats);

/**
 * @swagger
 * /api/volunteers/{id}/workshops:
 *   get:
 *     tags: [Volunteers]
 *     summary: Listar workshops do voluntário
 *     description: Retorna lista de workshops em que o voluntário está matriculado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do voluntário
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACTIVE, COMPLETED, CANCELLED]
 *         description: Filtrar por status da matrícula
 *     responses:
 *       200:
 *         description: Lista de workshops do voluntário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   workshop:
 *                     $ref: '#/components/schemas/Workshop'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Voluntário não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// Listar workshops do voluntário (próprio ou admin/teacher)
router.get("/:id/workshops", authenticateToken, requireOwnershipOrAdminTeacher, getVolunteerWorkshops);

/**
 * @swagger
 * /api/volunteers/{id}/attendances:
 *   get:
 *     tags: [Volunteers]
 *     summary: Listar presenças do voluntário
 *     description: Retorna histórico de presenças do voluntário nas aulas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do voluntário
 *       - in: query
 *         name: workshopId
 *         schema:
 *           type: integer
 *         description: Filtrar por workshop específico
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início do período (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim do período (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de presenças do voluntário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   present:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   class:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       subject:
 *                         type: string
 *                       workshop:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Voluntário não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// Listar presenças do voluntário (próprio ou admin/teacher)
router.get("/:id/attendances", authenticateToken, requireOwnershipOrAdminTeacher, getVolunteerAttendances);

export default router;
