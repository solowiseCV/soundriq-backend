"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../models/userModel");
const artistModel_1 = require("../models/artistModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
class UserService {
    static async registerUser(userData) {
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
        const user = await (0, userModel_1.createUser)({
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
    static async loginUser(email, password) {
        const user = await (0, userModel_1.findUserByEmail)(email);
        // find if a user is an artist
        const artist = await (0, artistModel_1.findArtistByEmail)(email);
        const userCredential = user ? user : artist;
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
