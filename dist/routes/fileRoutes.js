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
// view all artist
router.get('/artist', fileController_1.default.getAllArtist);
// View a file
router.get('/:id', authenticate_1.authenticate, fileController_1.default.getFile);
// View all files
router.get('/', authenticate_1.authenticate, fileController_1.default.getFiles);
// Update a file
router.put('/:id', fileUpload_1.upload.array('file', 1), authenticate_1.authenticate, fileController_1.default.updateFile);
// Delete a file
router.delete('/:id', authenticate_1.authenticate, fileController_1.default.deleteFile);
exports.default = router;
