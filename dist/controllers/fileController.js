"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileService_1 = __importDefault(require("../services/fileService"));
class FileController {
    // upload a file
    static async uploadFile(req, res) {
        // console.log("req body", req.body);
        try {
            if (!req.files || !Array.isArray(req.files)) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            const userId = req.userId;
            // const { filename, path } = req.file;
            const files = req.files.map((file) => ({
                filename: file.filename,
                path: file.path,
            }));
            const fileId = await fileService_1.default.uploadFile(userId, files);
            console.log("fileId", fileId);
            return res.status(201).json(fileId);
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    // get all artist
    static async getAllArtist(req, res) {
        try {
            console.log("get all artist");
            const artists = await fileService_1.default.getAllArtist();
            if (!artists || artists.length === 0) {
                return res.status(404).json({ error: "Artists not found" });
            }
            return res.status(200).json(artists);
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    // get a single file
    static async getFile(req, res) {
        try {
            const fileId = req.params.id;
            const file = await fileService_1.default.getFile(fileId);
            if (!file) {
                return res.status(404).json({ error: "File not found" });
            }
            return res.status(200).json(file);
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    // get all files related to a user
    static async getFiles(req, res) {
        try {
            const userId = req.userId;
            const files = await fileService_1.default.getFiles(userId);
            if (!files || files.length === 0) {
                return res.status(404).json({ error: "Files not found" });
            }
            const info = files.map((file) => ({
                id: file.id,
                filename: file.filename,
                artistName: file.artist.artistName,
            }));
            return res.status(200).json(info);
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    // update a file
    static async updateFile(req, res) {
        try {
            if (!req.files) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            const fileId = req.params.id;
            const file = req.files;
            const updatedFile = await fileService_1.default.updateFile(fileId, file);
            return res.status(200).json(updatedFile);
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    // delete a file
    static async deleteFile(req, res) {
        try {
            const fileId = req.params.id;
            await fileService_1.default.deleteFile(fileId);
            return res.status(204).json({ message: "File deleted successfully" });
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
exports.default = FileController;
