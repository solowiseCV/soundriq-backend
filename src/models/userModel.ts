import prisma, {User} from "../config/database";

export const createUser = async (
  data: Omit<User, "id" | "createdAt" | "updatedAt">
): Promise<User> => {
  return await prisma.user.create({ data });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { email } });
};

export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};
