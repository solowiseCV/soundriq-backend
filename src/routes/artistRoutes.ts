import { Router } from "express";
import ArtistController from "../controllers/artistController";
import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/fileUpload";

const router = Router();

router.get("/", authenticate, ArtistController.getAllUsers);
router.put(
  "/profile",
  authenticate,
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1,
    },
    {
      name: "bannerImage",
      maxCount: 1,
    },
    {
      name: "signatureSound",
      maxCount: 1,
    },
  ]),
  ArtistController.updateProfile
);
router.get("/profile", authenticate, ArtistController.getArtists);
router.get("/profile/:id", authenticate, ArtistController.getArtist);
router.post(
  "/single",
  authenticate,
  upload.fields([
    { name: "single", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  ArtistController.uploadSingle
);
router.get("/singles", authenticate, ArtistController.getSingles);
router.get("/single/:id", authenticate, ArtistController.getSingleById);
router.get("/singles/:id", authenticate, ArtistController.getSinglesByArtist);
router.get("/albums", authenticate, ArtistController.getAlbums);
router.get("/album/:id", authenticate, ArtistController.getAlbumById);
router.get("/albums/:id", authenticate, ArtistController.getAlbumsByArtist);
router.post(
  "/album",
  authenticate,
  upload.fields([
    { name: "albumFiles", maxCount: 10 },
    { name: "albumCover", maxCount: 1 },
  ]),
  ArtistController.uploadAlbum
);

export default router;
