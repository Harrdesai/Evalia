// src/routes/execute-code.routes.js

import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controllers.js";

const executionRoute = Router();

executionRoute.post("/", authMiddleware, executeCode);

export default executionRoute;