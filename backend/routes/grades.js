import express from "express";
import {
    getAllGrades,
    getGradeById,
    createGrade,
    updateGrade,
    deleteGrade,
    getWorkshopGradesReport,
    createGradeValidation,
    updateGradeValidation,
} from "../controllers/gradeController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Listar todas as notas
router.get("/", authenticateToken, getAllGrades);

// Obter nota por ID
router.get("/:id", authenticateToken, getGradeById);

// Obter relatório de notas de um workshop
router.get(
    "/workshop/:workshopId/report",
    authenticateToken,
    authorizeRoles("ADMIN", "TEACHER"),
    getWorkshopGradesReport,
);

// Criar nota (TEACHER ou ADMIN)
router.post(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN", "TEACHER"),
    createGradeValidation,
    createGrade,
);

// Atualizar nota (TEACHER da aula ou ADMIN)
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN", "TEACHER"),
    updateGradeValidation,
    updateGrade,
);

// Deletar nota (TEACHER da aula ou ADMIN)
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN", "TEACHER"),
    deleteGrade,
);

export default router;
