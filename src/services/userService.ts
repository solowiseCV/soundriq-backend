import { createUser, findUserByEmail, getAllUsers } from "../models/userModel";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/jwt";

class UserService {
  static async registerUser(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await createUser({
      ...userData,
      password: hashedPassword,
    });
    return user;
  }

  static async loginUser(email: string, password: string) {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user.id);

    return { token, user };
  }

  static async getUser(email: string) {
    const user = await findUserByEmail(email);
    return user;
  }

  static async getAllUsers() {
    const users = await getAllUsers();
    return users;
  }
}

export default UserService;
