"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const fileController_1 = __importDefault(require("../controllers/fileController"));
const fileUpload_1 = require("../middlewares/fileUpload");
const router = (0, express_1.Router)();
// upload a file/s
router.post("/upload", authenticate_1.authenticate, fileUpload_1.upload.array('file', 2), fileController_1.default.uploadFile);
// View a file
router.get('/files/:id', fileController_1.default.getFile);
// View all files
router.get('/files', fileController_1.default.getFiles);
// Update a file
router.put('/files/:id', fileUpload_1.upload.array('file', 1), fileController_1.default.updateFile);
// Delete a file
router.delete('/files/:id', fileController_1.default.deleteFile);
exports.default = router;
