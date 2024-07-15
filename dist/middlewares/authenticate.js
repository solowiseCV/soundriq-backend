"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const database_1 = __importDefault(require("../config/database"));
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const authenticate = async (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Access denied, token missing!" });
    }
    try {
        const blacklistedToken = await database_1.default.blacklistedToken.findFirst({
            where: { token: token },
        });
        if (blacklistedToken) {
            return res.status(401).json({ error: "Token is blacklisted" });
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Token is invalid or expired" });
    }
};
exports.authenticate = authenticate;
