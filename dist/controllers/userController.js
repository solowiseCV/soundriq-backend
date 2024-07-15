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
    static async updateUser(req, res) {
        try {
            const { artistName, countryOfOrigin, bio, dateOfBirth, musicGenre, appleMusicAddress, spotifyAddress, soundCloudAddress, youtubeAddress, instagramAddress, tiktokAddress, manager, } = req.body;
            const files = req.files;
            const profilePhoto = (files === null || files === void 0 ? void 0 : files.profilePhoto)
                ? files.profilePhoto[0].path
                : "";
            const bannerImage = (files === null || files === void 0 ? void 0 : files.bannerImage) ? files.bannerImage[0].path : "";
            const signatureSound = (files === null || files === void 0 ? void 0 : files.signatureSound)
                ? files.signatureSound[0].path
                : "";
            const data = {
                artistName,
                countryOfOrigin,
                bio,
                dateOfBirth,
                musicGenre,
                appleMusicAddress,
                spotifyAddress,
                soundCloudAddress,
                youtubeAddress,
                instagramAddress,
                tiktokAddress,
                manager,
                profilePhoto,
                bannerImage,
                signatureSound,
            };
            const userId = req.userId;
            // console.log("user Id", userId);
            const user = await userService_1.default.updateUser(userId, data);
            res.json(user);
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
    static async logout(req, res) {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                throw new Error("No token provided");
            }
            const result = await userService_1.default.logoutUser(token);
            res.json({ message: result });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const result = await userService_1.default.forgotPassword(email);
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
            const result = await userService_1.default.resetPassword(token, password);
            res.json({ message: result });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.default = UserController;
