import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { specs, swaggerUi } from "./swagger.js";

import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import volunteersRouter from "./routes/volunteers.js";
import workshopsRouter from "./routes/workshops.js";
import enrollmentsRouter from "./routes/enrollments.js";
import classesRouter from "./routes/classes.js";
import attendancesRouter from "./routes/attendances.js";
import gradesRouter from "./routes/grades.js";

const app = express();

// Middlewares
app.use(logger("dev"));
app.use(cors({
    origin: [
        "http://localhost:5173", // Vite dev server
        "http://localhost:3000", // React dev server
        "http://localhost:8080", // Outro possível dev server
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080"
    ],
    credentials: true
}));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rotas
app.use("/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/volunteers", volunteersRouter);
app.use("/api/workshops", workshopsRouter);
app.use("/api/enrollments", enrollmentsRouter);
app.use("/api/classes", classesRouter);
app.use("/api/attendances", attendancesRouter);
app.use("/api/grades", gradesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});
