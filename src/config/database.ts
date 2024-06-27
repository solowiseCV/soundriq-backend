import { PrismaClient, User, Artist  } from "@prisma/client";

// Create an instance of PrismaClient
const prisma = new PrismaClient();

export type { User, Artist };
export default prisma;
