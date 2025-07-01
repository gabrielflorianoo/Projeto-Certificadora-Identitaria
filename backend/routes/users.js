import express from "express";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserValidation,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireAdmin, requireOwnershipOrAdmin } from "../middleware/roles.js";

const router = express.Router();

// Listar todos os usuários (apenas ADMIN)
router.get("/", authenticateToken, requireAdmin, getAllUsers);

// Obter usuário por ID (próprio ou admin)
router.get("/:id", authenticateToken, requireOwnershipOrAdmin, getUserById);

// Atualizar usuário (próprio ou admin)
router.put(
    "/:id",
    authenticateToken,
    requireOwnershipOrAdmin,
    updateUserValidation,
    updateUser,
);

// Deletar usuário (apenas ADMIN)
router.delete("/:id", authenticateToken, requireAdmin, deleteUser);

export default router;
