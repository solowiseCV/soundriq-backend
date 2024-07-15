"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const authenticate_1 = require("../middlewares/authenticate");
const router = (0, express_1.Router)();
router.post("/register", authController_1.default.registerUser);
router.post("/login", authController_1.default.loginUser);
router.put("/update", authenticate_1.authenticate, authController_1.default.updateUser);
router.post("/logout", authController_1.default.logout);
router.post("/forgot-password", authController_1.default.forgotPassword);
router.post("/reset-password", authController_1.default.resetPassword);
router.get("/find/:email", authController_1.default.getUser);
router.get("/", authController_1.default.getAllUsers);
exports.default = router;
