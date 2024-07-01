import { Router } from "express";
import ArtistController from "../controllers/artistController";
import upload from "../middlewares/artist/file_upload";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/register", ArtistController.register);
router.post(
  "/complete-profile/",
  authenticate,
  upload,
  ArtistController.completeProfile
);

export default router;
