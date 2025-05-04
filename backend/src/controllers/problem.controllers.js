import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const createProblem = async (request, response) => {
  response.status(200).json(new ApiResponse(200, "Problem created successfully"));
}

const getAllProblems = async (request, response) => {
  
}

const getProblemById = async (request, response) => {
  
}

const updateProblem = async (request, response) => {
  
}

const deleteProblem = async (request, response) => {
  
}

const getAllProblemsSolvedByUser = async (request, response) => {
  
}

export {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemsSolvedByUser
}