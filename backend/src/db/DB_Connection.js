import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

export const DB_Connection = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = DB_Connection;