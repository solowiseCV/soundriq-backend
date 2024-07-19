import {
  createUser,
  updateUser,
  findUserByEmail,
  getAllUsers,
  logoutUser,
  savePasswordResetToken,
  findUserByPasswordResetToken,
  resetPassword,
  invalidateResetToken,
} from "../models/userModel";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "../utils/email";
// import { findArtistByEmail } from "../models/artistModel";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

const FRONTEND_URL = require("../config/index").FRONTEND_URL;

class UserService {
  static async registerUser(userData: any) {
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      return { error: "User already exists" };
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await createUser({
      ...userData,
      password: hashedPassword,
      artistProfile: {
        
      },
    },
  );

    return user;
  }

  static async loginUser(email: string, password: string) {
    const user = await findUserByEmail(email);

    // find if a user is an artist
    // const artist = await findArtistByEmail(email);

    const userCredential = user;

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

  static async logoutUser(token: string) {
    // Add token to blacklist
    const res = await logoutUser(token);

    if (!res) {
      throw new Error("Token not found");
    }

    if (res) {
      return "User logged out successfully";
    }
  }

  static async forgotPassword(email: string) {
    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }
    // Generate reset link
    const resetToken = uuidv4();

    // Save reset token
    await savePasswordResetToken(user.id, resetToken);

    const resetLink = `${FRONTEND_URL}/auth/reset-password/?token=${resetToken}`;
    // Send reset link to user
    await sendPasswordResetEmail(email, resetLink);

    console.log("reset link", resetLink);

    return "Password reset link sent to email";
  }

  static async resetPassword(token: string, password: string) {
    const user = await findUserByPasswordResetToken(token);

    if (!user) {
      throw new Error("Invalid or expired token");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password

    await resetPassword(user.id, hashedPassword);

    // Invalidate reset token
    await invalidateResetToken(token);

    return "Password reset successfully";
  }
}

export default UserService;
