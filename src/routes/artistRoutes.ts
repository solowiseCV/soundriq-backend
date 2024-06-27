import { Router } from "express";
import ArtistController from "../controllers/artistController";
import upload from "../middlewares/artist/file_upload";

const router = Router();

router.post("/register", upload, ArtistController.register);

export default router;
