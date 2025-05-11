// src/routes/submission.routes.js

import { Router} from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmissions, getSubmissionsForProblem, getAllTheSubmissionsForProblem } from "../controllers/submission.controllers.js";

const submissionRoute = Router();

submissionRoute.get("/get-all-submissions", authMiddleware, getAllSubmissions);

submissionRoute.get("/get-submissions/:problemId", authMiddleware, getSubmissionsForProblem);

submissionRoute.get("/get-submissions-count/:problemId", authMiddleware, getAllTheSubmissionsForProblem);


export default submissionRoute;