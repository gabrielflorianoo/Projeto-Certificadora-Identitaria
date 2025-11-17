import express from "express";
import {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
    createClassValidation,
    updateClassValidation,
    getTotalStudentsByClass,
} from "../controllers/classController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Listar todas as aulas
router.get("/", authenticateToken, getAllClasses);

// Obter aula por ID
router.get("/:id", authenticateToken, getClassById);

// Criar aula (ADMIN ou TEACHER)
router.post(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN", "TEACHER"),
    createClassValidation,
    createClass,
);

// Atualizar aula (ADMIN ou TEACHER que leciona a aula)
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN", "TEACHER"),
    updateClassValidation,
    updateClass,
);

// Deletar aula (ADMIN ou TEACHER que leciona a aula)
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN", "TEACHER"),
    deleteClass,
);

// Pegar total de alunos por aula
router.get(
    "/:id/students/count",
    authenticateToken,
    getTotalStudentsByClass,
);

export default router;
