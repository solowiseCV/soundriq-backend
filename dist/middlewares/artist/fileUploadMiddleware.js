"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
// Multer storage configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "artists/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
// Multer upload instance
const upload = (0, multer_1.default)({ storage: storage });
// Middleware to handle file uploads
exports.uploadFileMiddleware = upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
    { name: "signatureSound", maxCount: 1 },
]);
