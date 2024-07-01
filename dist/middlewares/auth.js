"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Access denied, token missing!" });
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.artistId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Token is invalid or expired" });
    }
};
exports.authenticate = authenticate;
