"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../models/userModel");
const uuid_1 = require("uuid");
const email_1 = require("../utils/email");
// import { findArtistByEmail } from "../models/artistModel";
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const FRONTEND_URL = require("../config/index").FRONTEND_URL;
class UserService {
    static async registerUser(userData) {
        const existingUser = await (0, userModel_1.findUserByEmail)(userData.email);
        if (existingUser) {
            return { error: "User already exists" };
        }
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
        const user = await (0, userModel_1.createUser)({
            ...userData,
            password: hashedPassword,
            artistProfile: {
                bio: "",
            },
        });
        const userInfo = {
            id: user.id,
            email: user.email,
        };
        return userInfo;
    }
    static async loginUser(email, password) {
        const user = await (0, userModel_1.findUserByEmail)(email);
        // find if a user is an artist
        // const artist = await findArtistByEmail(email);
        const userCredential = user;
        if (!userCredential) {
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, userCredential.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const token = (0, jwt_1.generateToken)(userCredential.id);
        const userInfo = {
            id: userCredential.id,
            email: userCredential.email,
        };
        return { token, userInfo };
    }
    static async updateUser(userId, userData) {
        const user = await (0, userModel_1.updateUser)({
            ...userData,
            artistProfile: {
                ...userData
            },
            id: userId,
        });
        return user;
    }
    static async getUser(email) {
        const user = await (0, userModel_1.findUserByEmail)(email);
        return user;
    }
    static async getAllUsers() {
        const users = await (0, userModel_1.getAllUsers)();
        return users;
    }
    static async logoutUser(token) {
        // Add token to blacklist
        const res = await (0, userModel_1.logoutUser)(token);
        if (!res) {
            throw new Error("Token not found");
        }
        if (res) {
            return "User logged out successfully";
        }
    }
    static async forgotPassword(email) {
        const user = await (0, userModel_1.findUserByEmail)(email);
        // find if a user is an artist
        // const artist = await findArtistByEmail(email);
        const userCredential = user;
        if (!userCredential) {
            throw new Error("User not found");
        }
        // Generate reset link
        const resetToken = (0, uuid_1.v4)();
        // Save reset token
        await (0, userModel_1.savePasswordResetToken)(userCredential.id, resetToken);
        const resetLink = `${FRONTEND_URL}/auth/reset-password/?token=${resetToken}`;
        // Send reset link to user
        await (0, email_1.sendPasswordResetEmail)(email, resetLink);
        return;
    }
    static async resetPassword(token, password) {
        const user = await (0, userModel_1.findUserByPasswordResetToken)(token);
        if (!user) {
            throw new Error("Invalid or expired token");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Update user password
        await (0, userModel_1.resetPassword)(user.id, hashedPassword);
        // Invalidate reset token
        await (0, userModel_1.invalidateResetToken)(token);
        return "Password reset successfully";
    }
}
exports.default = UserService;
