"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../services/userService"));
class UserController {
    static async registerUser(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error("Email and password are required");
            }
            // check email format
            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(email)) {
                throw new Error("Invalid email format");
            }
            // check password length
            if (password.length < 8) {
                throw new Error("Password must be at least 8 characters long");
            }
            const user = await userService_1.default.registerUser(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const { token, userInfo } = await userService_1.default.loginUser(email, password);
            res.json({ token, userInfo });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getUser(req, res) {
        try {
            const user = await userService_1.default.getUser(req.params.email);
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({ error: "User not found" });
            }
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await userService_1.default.getAllUsers();
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.default = UserController;
