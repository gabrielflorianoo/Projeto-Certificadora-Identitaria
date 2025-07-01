import express from "express";
import {
    getAllAttendances,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    bulkCreateAttendance,
    createAttendanceValidation,
    updateAttendanceValidation,
} from "../controllers/attendanceController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Listar todas as presenças
router.get("/", authenticateToken, getAllAttendances);

// Obter presença por ID
router.get("/:id", authenticateToken, getAttendanceById);

// Criar presença (TEACHER ou ADMIN)
router.post(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN", "TEACHER"),
    createAttendanceValidation,
    createAttendance,
);

// Criar presenças em lote para uma aula (TEACHER ou ADMIN)
router.post(
    "/bulk",
    authenticateToken,
    authorizeRoles("ADMIN", "TEACHER"),
    bulkCreateAttendance,
);

// Atualizar presença (TEACHER da aula ou ADMIN)
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN", "TEACHER"),
    updateAttendanceValidation,
    updateAttendance,
);

// Deletar presença (TEACHER da aula ou ADMIN)
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN", "TEACHER"),
    deleteAttendance,
);

export default router;
