"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileController_1 = __importDefault(require("../controllers/fileController"));
const fileUpload_1 = require("../middlewares/fileUpload");
const router = (0, express_1.Router)();
router.post("/upload", fileUpload_1.upload.single("file"), fileController_1.default.uploadFile);
exports.default = router;
