"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadFileMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Ensure the uploads directory exists
const uploadDir = "uploads/";
if (!fs_1.default.existsSync(uploadDir)) {
    try {
        fs_1.default.mkdirSync(uploadDir);
    }
    catch (err) {
        console.error("Error creating upload folder:", err);
    }
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path_1.default.join(__dirname, "../../", uploadDir);
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
exports.uploadFileMiddleware = (0, multer_1.default)({ storage: storage }).array("files", 10);
exports.upload = (0, multer_1.default)({ storage: storage });
