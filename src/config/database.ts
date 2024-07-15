import { PrismaClient, User, BlacklistedToken } from "@prisma/client";

// Create an instance of PrismaClient
const prisma = new PrismaClient();

export type { User, BlacklistedToken };
export default prisma;
