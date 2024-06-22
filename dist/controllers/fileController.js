"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileService_1 = __importDefault(require("../services/fileService"));
class FileController {
    static async uploadFile(req, res) {
        // console.log("req body", req.body);
        // console.log("req file", req.file);
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            const { filename, path } = req.file;
            const fileId = await fileService_1.default.uploadFile(filename, path);
            return res.status(201).json({ fileId });
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
exports.default = FileController;
