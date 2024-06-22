"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../models/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
class UserService {
    static async registerUser(userData) {
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
        const user = await (0, userModel_1.createUser)({
            ...userData,
            password: hashedPassword,
        });
        return user;
    }
    static async loginUser(email, password) {
        const user = await (0, userModel_1.findUserByEmail)(email);
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const token = (0, jwt_1.generateToken)(user.id);
        return { token, user };
    }
    static async getUser(email) {
        const user = await (0, userModel_1.findUserByEmail)(email);
        return user;
    }
    static async getAllUsers() {
        const users = await (0, userModel_1.getAllUsers)();
        return users;
    }
}
exports.default = UserService;
