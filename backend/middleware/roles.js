// Middleware para verificar roles/permissões específicas
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res
                .status(401)
                .json({ error: "Token de acesso necessário" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Acesso negado. Permissão insuficiente.",
                required: roles,
                current: req.user.role,
            });
        }

        next();
    };
};

// Middleware para verificar se o usuário pode acessar seus próprios dados ou é admin
export const requireOwnershipOrAdmin = (req, res, next) => {
    const userId = parseInt(req.params.id);

    if (!req.user) {
        return res.status(401).json({ error: "Token de acesso necessário" });
    }

    // Admin pode acessar qualquer coisa
    if (req.user.role === "ADMIN") {
        return next();
    }

    // Usuário só pode acessar seus próprios dados
    if (req.user.id === userId) {
        return next();
    }

    return res.status(403).json({
        error: "Acesso negado. Você só pode acessar seus próprios dados.",
    });
};

// Middleware para verificar se é admin ou professor
export const requireAdminOrTeacher = requireRole("ADMIN", "TEACHER");

// Middleware para verificar se é admin
export const requireAdmin = requireRole("ADMIN");
