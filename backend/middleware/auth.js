import { verifyToken } from "../utils/jwt.js";
import prisma from "../utils/prisma.js";

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: "Token de acesso requerido" });
    }

    try {
        const decoded = verifyToken(token);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return res.status(401).json({ error: "Usuário não encontrado" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido" });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }

        if (!roles.includes(req.user.role)) {
            return res
                .status(403)
                .json({ error: "Acesso negado. Permissão insuficiente" });
        }

        next();
    };
};
