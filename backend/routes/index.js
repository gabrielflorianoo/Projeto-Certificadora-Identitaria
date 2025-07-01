import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.json({
        message: "API do Sistema de Certificação Identitária",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            users: "/api/users",
            workshops: "/api/workshops",
            enrollments: "/api/enrollments",
            classes: "/api/classes",
            attendances: "/api/attendances",
            grades: "/api/grades",
        },
    });
});

export default router;
