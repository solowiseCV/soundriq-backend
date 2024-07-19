import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import FileController from "../controllers/fileController";
import { uploadFileMiddleware, upload } from "../middlewares/fileUpload";

const router = Router();

// upload a file/s
router.post("/upload", authenticate, upload.array('file', 2), FileController.uploadFile);

// view all artist
router.get('/artist', FileController.getAllArtist);

// View a file
router.get('/:id', authenticate, FileController.getFile);

// View all files
router.get('/', authenticate, FileController.getFiles);

// Update a file
router.put('/:id',upload.array('file', 1), authenticate, FileController.updateFile);

// Delete a file
router.delete('/:id',authenticate, FileController.deleteFile);

export default router;
