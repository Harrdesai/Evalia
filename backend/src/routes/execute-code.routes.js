// src/routes/execute-code.routes.js

import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { executeCode, submitSolution } from "../controllers/executeCode.controllers.js";

const executionRoute = Router();

executionRoute.post("/", authMiddleware, executeCode);

executionRoute.post("/submit-solution", authMiddleware, submitSolution);

export default executionRoute;