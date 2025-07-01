import express from "express";
import {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollmentStatus,
    deleteEnrollment,
    createEnrollmentValidation,
} from "../controllers/enrollmentController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Listar todas as matrículas
router.get("/", authenticateToken, getAllEnrollments);

// Obter matrícula por ID
router.get("/:id", authenticateToken, getEnrollmentById);

// Criar matrícula
router.post(
    "/",
    authenticateToken,
    createEnrollmentValidation,
    createEnrollment,
);

// Atualizar status da matrícula (apenas ADMIN)
router.patch(
    "/:id/status",
    authenticateToken,
    authorizeRoles("ADMIN"),
    updateEnrollmentStatus,
);

// Deletar matrícula
router.delete("/:id", authenticateToken, deleteEnrollment);

export default router;
