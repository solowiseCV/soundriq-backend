"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = __importDefault(require("../services/authService"));
const userModel_1 = require("../models/userModel");
class UserController {
    static async registerUser(req, res) {
        try {
            const { name, email, password, dateOfBirth } = req.body;
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
            const user = await authService_1.default.registerUser(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const { token, userInfo } = await authService_1.default.loginUser(email, password);
            const userId = userInfo.id;
            const result = await (0, userModel_1.findArtistByUserId)(userId);
            const artistId = result === null || result === void 0 ? void 0 : result.id;
            req.session.artistId = artistId; // Store artistId in session
            res.json({ token, userInfo });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async logout(req, res) {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                throw new Error("No token provided");
            }
            const result = await authService_1.default.logoutUser(token);
            res.json({ message: result });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const result = await authService_1.default.forgotPassword(email);
            res.json({ message: "Password reset link sent to email" });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async resetPassword(req, res) {
        try {
            const { password, confirmPassword } = req.body;
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }
            const token = req.params.token;
            const result = await authService_1.default.resetPassword(token, password);
            res.json({ message: result });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.default = UserController;
