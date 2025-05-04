import { request, response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiError } from "../utils/api-error.js";
import { PrismaClient } from "@prisma/client"

dotenv.config({
  path: "./.env",
});

const authMiddleware = async (request, response, next) => {
  
  try {
    
    const token = request.cookies.jwt;

    if (!token) {
      throw new Error(401, "token not found");
    }

    let decoded;

    try {
      
      decoded = jwt.verify(token, process.env.JWT_SECRET);

    } catch (error) {
      
      throw new Error(401, "Not authenticated");

    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id
      },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    if (!user) {
      throw new Error(401, "User not found");
    }

    request.user = user;

    next();

  } catch (error) {
    
    console.error("Error authenticating user:", error);
    response.status(error.statusCode).json(
      new ApiError(error.statusCode, {
        error: error.message
      }, "Error authenticating user")
    )
  }
}

export { authMiddleware };