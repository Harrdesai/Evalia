import express from "express";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemsSolvedByUser
  
} from "../controllers/problem.controllers.js";
import { authMiddleware, checkRole } from "../middleware/auth.middleware.js";

const problemRoutes = express.Router();


problemRoutes.post("/create-problem", authMiddleware, checkRole, createProblem);

problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);

problemRoutes.get("/get-problem-by-id/:id", authMiddleware, getProblemById);

problemRoutes.put("/update-problem/:id", authMiddleware, checkRole, updateProblem);

problemRoutes.delete("/delete-problem/:id", authMiddleware, checkRole, deleteProblem);

problemRoutes.get("/get-all-solved-problems", authMiddleware, getAllProblemsSolvedByUser);

export default problemRoutes;