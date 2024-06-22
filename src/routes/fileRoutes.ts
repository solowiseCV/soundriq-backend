import { Router } from "express";
import FileController from "../controllers/fileController";
import { upload } from "../middlewares/fileUpload";

const router = Router();

router.post("/upload", upload.single("file"), FileController.uploadFile);

export default router;
