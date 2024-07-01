import { createUser, findUserByEmail, getAllUsers } from "../models/userModel";
import { findArtistByEmail } from "../models/artistModel";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

class UserService {
  static async registerUser(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await createUser({
      ...userData,
      password: hashedPassword,
    });

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    return userInfo;
  }

  static async loginUser(email: string, password: string) {
    const user = await findUserByEmail(email);

    // find if a user is an artist
    const artist = await findArtistByEmail(email);

    const userCredential = user ? user : artist;

    if (!userCredential) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userCredential.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(userCredential.id);

    const userInfo = {
      id: userCredential.id,
      email: userCredential.email,
    };

    return { token, userInfo };
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
