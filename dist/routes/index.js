"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { getStatus } = require("../controllers/statusController");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const router = (0, express_1.Router)();
router.get("/status", getStatus);
router.use("/users", userRoutes_1.default);
exports.default = router;
