import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import FileController from "../controllers/fileController";
import { uploadFileMiddleware, upload } from "../middlewares/fileUpload";

const router = Router();

// upload a file/s
router.post("/upload", authenticate, upload.array('file', 2), FileController.uploadFile);

// View a file
router.get('/files/:id', FileController.getFile);

// View all files
router.get('/files', FileController.getFiles);

// Update a file
router.put('/files/:id',upload.array('file', 1), FileController.updateFile);

// Delete a file
router.delete('/files/:id', FileController.deleteFile);

export default router;
