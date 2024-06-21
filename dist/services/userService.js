"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
class UserService {
    static async registerUser(userData) {
        const user = await userModel_1.default.createUser(userData);
        return user;
    }
    static async getUser(email) {
        const user = await userModel_1.default.getUserByEmail(email);
        return user;
    }
    static async getAllUsers() {
        const users = await userModel_1.default.getAllUsers();
        return users;
    }
}
exports.default = UserService;
