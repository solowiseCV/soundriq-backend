"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const mime_types_1 = __importDefault(require("mime-types"));
class FileService {
    static async uploadFile(artistProfileId, files) {
        try {
            // Determine the file type
            const mimeType = files.map((file) => mime_types_1.default.lookup(file.filename));
            if (!mimeType) {
                throw new Error("Unable to determine file type");
            }
            // Using $transaction to handle multiple file creation
            const createdFiles = await database_1.default.$transaction(files.map((file) => database_1.default.file.create({
                data: {
                    filename: file.filename,
                    path: file.path,
                    coverImage: file.coverImage,
                    metadata: file.metadata,
                    artistId: artistProfileId,
                },
                include: { artist: true },
            })));
            return createdFiles;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Failed to upload file");
        }
    }
    static async getAllArtist() {
        const artists = await database_1.default.artistProfile.findMany();
        return artists;
    }
    static async getFile(fileId) {
        const file = await database_1.default.file.findUnique({
            where: { id: fileId },
            include: { artist: true },
        });
        return file;
    }
    static async getFiles(artistId) {
        const files = await database_1.default.file.findMany({
            where: { artistId },
            include: { artist: true },
        });
        return files;
    }
    static async updateFile(fileId, files) {
        const updatedFile = await database_1.default.file.update({
            where: { id: fileId },
            data: {
                filename: files[0].filename,
                path: files[0].path,
            },
        });
        return updatedFile;
    }
    static async deleteFile(fileId) {
        const file = await database_1.default.file.delete({
            where: { id: fileId },
        });
        return file;
    }
}
exports.default = FileService;
