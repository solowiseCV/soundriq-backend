"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
// import mime from "mime-types";
class FileService {
    static async uploadFile(filename, path) {
        try {
            // const mimeType = mime.lookup(filename);
            let file;
            // if (!mimeType) {
            //   throw new Error("Unable to determine file type");
            // }
            file = await database_1.default.file.create({
                data: {
                    filename: filename,
                    path,
                    // type: mimeType,
                },
            });
            return file;
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to upload file");
        }
    }
}
exports.default = FileService;
