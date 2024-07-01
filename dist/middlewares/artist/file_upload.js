"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configure multer storage
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        // Define the destination directory where uploaded files will be stored
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        // Define the filename for the uploaded file
        cb(null, Date.now() + "-" + file.originalname);
    },
});
// // Initialize multer with the configured storage
// const upload = multer({ storage: storage });
// // Middleware function to handle file uploads
// export const uploadFiles = (req: any, res: any, next: any) => {
//   console.log(req.body); // Logs the request body
//   console.log("Files", req.files); // Logs the uploaded files
//   // Use multer's upload.fields() middleware to handle file uploads
//   upload.fields([
//     { name: "profilePhoto" },
//     { name: "bannerImage" },
//     { name: "signatureSound" },
//   ])(req, res, (err: any) => {
//     if (err) {
//       // Handle any errors that occur during file upload
//       return res.status(400).json({ error: "File upload failed" });
//     }
//     // Call next() to pass control to the next middleware in the stack
//     next();
//   });
// };
// Initialize upload
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
    { name: 'signatureSound', maxCount: 1 }
]);
// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|mp3/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb('Error: Images Only!');
    }
}
exports.default = upload;
