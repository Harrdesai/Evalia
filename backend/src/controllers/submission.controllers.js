// src/controllers/submission.controllers.js
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const getAllSubmissions = async (request, response) => {
  try {

    const userId = request.user.id;

    const submissions = await prisma.submission.findMany({
      where: {
        userId
      }
    })

    response.status(200).json(
      new ApiResponse(200, submissions, "Submissions fetched successfully")
    )
    
  } catch (error) {
    
    response.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, "Failed to fetch submissions", {
        error: error.message
      })
    )

  }
}

const getSubmissionsForProblem = async (request, response) => {

  try {
    
    const userId = request.user.id;
    const problemId = request.params.problemId;

    const submissions = await prisma.submission.findMany({
      where: {
        userId,
        problemId
      }
    })

    response.status(200).json(
      new ApiResponse(200, submissions, "Submissions fetched successfully")
    )

  } catch (error) {
    
    response.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, "Failed to fetch submissions", {
        error: error.message
      })
    )

  }
}

const getAllTheSubmissionsForProblem = async (request, response) => {

  try {
    
    const problemId = request.params.problemId;
    
    const submissions = await prisma.submission.findMany({
      where: {
        problemId
      }
    })

    response.status(200).json(
      new ApiResponse(200, submissions, "Submissions fetched successfully")
    )

  } catch (error) {
    
    response.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, "Failed to fetch submissions", {
        error: error.message
      })
    )

  }
}

export { getAllSubmissions, getSubmissionsForProblem, getAllTheSubmissionsForProblem }