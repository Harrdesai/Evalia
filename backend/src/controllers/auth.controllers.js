import bcrypt from "bcryptjs";
import { DB_Connection } from "../db/DB_Connection.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { UserRole } from "../generated/prisma/index.js"
import { PrismaClient } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();


const registerUser = async (request, response) => {
  const { name, email, password, role } = request.body

  console.log(request.body)
  if (!name || !email || !password || !role) {
    throw new ApiError(400, "All fields are required")
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (existingUser) {
      throw new ApiError(400, "User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role:UserRole.USER
      }
    })

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    })

    response.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    response.status(201).json(
      new ApiResponse(201, "User created successfully", {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          image: newUser.image,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        }
      })
    )
  } catch (error) {

    console.error("Error registering user:", error);
    response.status(500).json(
      new ApiResponse(500, "Error registering user", {
        error: error.message
      })
    )
    
  }
}

const loginUser = async (request, response) => {
  
}

const logoutUser = async (request, response) => {
  
}

const getMe = async (request, response) => {
  
}

export {
  registerUser,
  loginUser,
  logoutUser,
  getMe
}