"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const authenticate_1 = require("../middlewares/authenticate");
const router = (0, express_1.Router)();
router.post("/register", userController_1.default.registerUser);
router.post("/login", userController_1.default.loginUser);
router.put("/update", authenticate_1.authenticate, userController_1.default.updateUser);
router.post("/logout", userController_1.default.logout);
router.post("/forgot-password", userController_1.default.forgotPassword);
router.post("/reset-password", userController_1.default.resetPassword);
router.get("/find/:email", userController_1.default.getUser);
router.get("/", userController_1.default.getAllUsers);
exports.default = router;
