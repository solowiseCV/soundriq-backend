import prisma from "../config/database";

class UserModel {
  static async createUser(data: { name: string; email: string }) {
    return prisma.user.create({ data });
  }

  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async getAllUsers() {
    return prisma.user.findMany();
  }
}

export default UserModel;
