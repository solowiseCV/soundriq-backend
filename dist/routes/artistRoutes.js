"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const artistController_1 = __importDefault(require("../controllers/artistController"));
const authenticate_1 = require("../middlewares/authenticate");
const fileUpload_1 = require("../middlewares/fileUpload");
const router = (0, express_1.Router)();
router.get("/", authenticate_1.authenticate, artistController_1.default.getAllUsers);
router.patch("/profile", authenticate_1.authenticate, fileUpload_1.upload.fields([
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
]), artistController_1.default.updateProfile);
router.get("/profile", authenticate_1.authenticate, artistController_1.default.getArtists);
// check artist profile completion
router.get("/profile/check", authenticate_1.authenticate, artistController_1.default.checkProfileCompletion);
// get trending hits
router.get("/trending", authenticate_1.authenticate, artistController_1.default.getTrendingHits);
router.get("/profile/:id", authenticate_1.authenticate, artistController_1.default.getArtist);
router.post("/single", authenticate_1.authenticate, fileUpload_1.upload.fields([
    { name: "single", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
]), artistController_1.default.uploadSingle);
router.get("/singles", authenticate_1.authenticate, artistController_1.default.getSingles);
router.get("/single/:id", authenticate_1.authenticate, artistController_1.default.getSingleById);
router.get("/singles/:id", authenticate_1.authenticate, artistController_1.default.getSinglesByArtist);
router.get("/albums", authenticate_1.authenticate, artistController_1.default.getAlbums);
router.get("/album/:id", authenticate_1.authenticate, artistController_1.default.getAlbumById);
router.get("/albums/:id", authenticate_1.authenticate, artistController_1.default.getAlbumsByArtist);
router.post("/album", authenticate_1.authenticate, fileUpload_1.upload.fields([
    { name: "albumFiles", maxCount: 10 },
    { name: "albumCover", maxCount: 1 },
]), artistController_1.default.uploadAlbum);
exports.default = router;
