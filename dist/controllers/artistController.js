"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const artistSerivce_1 = __importDefault(require("../services/artistSerivce"));
const userModel_1 = require("../models/userModel");
const cloudinary_1 = require("../utils/cloudinary");
const mime_types_1 = __importDefault(require("mime-types"));
class ArtistController {
    static async updateProfile(req, res) {
        try {
            const { artistName, countryOfOrigin, bio, musicGenre, appleMusicAddress, spotifyAddress, soundCloudAddress, youtubeAddress, instagramAddress, tiktokAddress, manager, } = req.body;
            let profilePhoto;
            let bannerImage;
            let signatureSound;
            const files = req.files;
            if (Array.isArray(files)) {
                profilePhoto = files.find((file) => file.fieldname === "profilePhoto");
                bannerImage = files.find((file) => file.fieldname === "bannerImage");
                signatureSound = files.find((file) => file.fieldname === "signatureSound");
            }
            else {
                profilePhoto = files["profilePhoto"]
                    ? files["profilePhoto"][0]
                    : undefined;
                bannerImage = files["bannerImage"]
                    ? files["bannerImage"][0]
                    : undefined;
                signatureSound = files["signatureSound"]
                    ? files["signatureSound"][0]
                    : undefined;
            }
            const filesToUpload = [
                (profilePhoto === null || profilePhoto === void 0 ? void 0 : profilePhoto.path)
                    ? { path: profilePhoto.path, folder: "profile/" }
                    : null,
                (signatureSound === null || signatureSound === void 0 ? void 0 : signatureSound.path)
                    ? { path: signatureSound.path, folder: "signature/" }
                    : null,
                (bannerImage === null || bannerImage === void 0 ? void 0 : bannerImage.path)
                    ? { path: bannerImage.path, folder: "banner/" }
                    : null,
            ].filter((file) => file !== null);
            await (0, cloudinary_1.uploadFilesToCloudinary)(filesToUpload)
                .then((urls) => {
                const [profilePhotoUrl, signatureSoundUrl, bannerImageUrl] = urls;
                profilePhoto = profilePhotoUrl;
                bannerImage = bannerImageUrl;
                signatureSound = signatureSoundUrl;
            })
                .catch((err) => {
                console.error(`File upload error: ${err.message}`);
            });
            const data = {
                artistName,
                countryOfOrigin,
                bio,
                musicGenre,
                appleMusicAddress,
                spotifyAddress,
                soundCloudAddress,
                youtubeAddress,
                instagramAddress,
                tiktokAddress,
                manager,
                profilePhoto,
                bannerImage,
                signatureSound,
            };
            const userId = req.userId;
            const updatedArtist = await artistSerivce_1.default.updateProfile(userId, data);
            const result = await (0, userModel_1.findArtistByUserId)(userId);
            const artistId = result === null || result === void 0 ? void 0 : result.id;
            req.session.artistId = artistId; // Store artistId in session
            return res.json(updatedArtist);
        }
        catch (error) {
            console.error(error.message);
            res.status(400).json({ error: error.message });
        }
    }
    static async uploadSingle(req, res) {
        try {
            if (!req.files || !req.body.metadata) {
                return res.status(400).json({ error: "No file or metadata uploaded" });
            }
            let singleFile;
            let coverImage;
            let singleFileUrl;
            if (Array.isArray(req.files)) {
                singleFile = req.files.find((file) => file.fieldname === "single");
                coverImage = req.files.find((file) => file.fieldname === "coverImage");
            }
            else {
                singleFile = req.files["single"] ? req.files["single"][0] : undefined;
                coverImage = req.files["coverImage"]
                    ? req.files["coverImage"][0]
                    : undefined;
            }
            // Determine the file type
            const singleType = singleFile && mime_types_1.default.lookup(singleFile.filename);
            const coverImageType = coverImage && mime_types_1.default.lookup(coverImage.filename);
            if (!singleType || !coverImageType) {
                throw new Error("Unable to determine file type");
            }
            const artistId = req.session.artistId;
            // const userId = req.userId as string;
            const metadata = JSON.parse(req.body.metadata);
            if (!singleFile || !coverImage) {
                return res
                    .status(400)
                    .json({ error: "Single file or cover image missing" });
            }
            // save to cloudinary
            const filesToUpload = [
                { path: singleFile.path, folder: "singles/" },
                { path: coverImage.path, folder: "cover/" },
            ];
            await (0, cloudinary_1.uploadFilesToCloudinary)(filesToUpload)
                .then((urls) => {
                const [singleUrl, coverUrl] = urls;
                singleFileUrl = singleUrl;
                coverImage = coverUrl;
            })
                .catch((err) => {
                console.error(`File upload error: ${err.message}`);
            });
            singleFile = {
                filename: singleFile.filename,
                path: singleFileUrl,
            };
            const fileId = await artistSerivce_1.default.uploadSingle(artistId, singleFile, coverImage, metadata);
            return res.status(201).json(fileId);
        }
        catch (error) {
            console.error(error.message);
            return res
                .status(500)
                .json({ error: error.message });
        }
    }
    static async uploadAlbum(req, res) {
        try {
            if (!req.files || !req.body.metadata) {
                return res.status(400).json({ error: "No file or metadata uploaded" });
            }
            let albumCover;
            let albumFiles = [];
            let albumFilesUrl = [];
            if (Array.isArray(req.files)) {
                albumCover = req.files.find((file) => file.fieldname === "albumCover");
                albumFiles = req.files.filter((file) => file.fieldname === "albumFiles");
            }
            else {
                albumCover = req.files["albumCover"]
                    ? req.files["albumCover"][0]
                    : undefined;
                albumFiles = req.files["albumFiles"] ? req.files["albumFiles"] : [];
            }
            const artistId = req.session.artistId;
            const metadata = JSON.parse(req.body.metadata);
            if (!albumCover || albumFiles.length === 0) {
                return res.status(400).json({ error: "Album cover or files missing" });
            }
            const albumCoverType = albumCover && mime_types_1.default.lookup(albumCover.filename);
            if (!albumCoverType) {
                throw new Error("Unable to determine file type");
            }
            // save to cloudinary
            const filesToUpload = [
                { path: albumCover.path, folder: "cover/" },
                ...albumFiles.map((file) => ({ path: file.path, folder: "albums/" })),
            ];
            await (0, cloudinary_1.uploadFilesToCloudinary)(filesToUpload)
                .then((urls) => {
                albumCover = urls[0];
                albumFilesUrl = urls.slice(1);
            })
                .catch((err) => {
                console.error(`File upload error: ${err.message}`);
            });
            albumFiles = albumFiles.map((file, index) => ({
                filename: file.filename,
                path: albumFilesUrl[index],
            }));
            const fileId = await artistSerivce_1.default.uploadAlbum(artistId, albumCover, albumFiles, metadata);
            return res.status(201).json(fileId);
        }
        catch (error) {
            console.error(error.message);
            return res
                .status(500)
                .json({ error: error.message });
        }
    }
    static async getSingles(req, res) {
        try {
            const singles = await artistSerivce_1.default.getSingles();
            res.json(singles);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getSinglesByArtist(req, res) {
        try {
            const artistId = req.params.id;
            const singles = await artistSerivce_1.default.getSinglesByArtist(artistId);
            res.json(singles);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getAlbums(req, res) {
        try {
            const albums = await artistSerivce_1.default.getAlbums();
            res.json(albums);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getAlbumsByArtist(req, res) {
        try {
            const artistId = req.params.id;
            const albums = await artistSerivce_1.default.getAlbumsByArtist(artistId);
            res.json(albums);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getArtists(req, res) {
        try {
            const artist = await artistSerivce_1.default.getArtists();
            if (artist) {
                res.json(artist);
            }
            else {
                res.status(404).json({ error: "Artist not found" });
            }
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getArtist(req, res) {
        try {
            const artist = await artistSerivce_1.default.getArtist(req.params.id);
            if (artist) {
                res.json(artist);
            }
            else {
                res.status(404).json({ error: "Artist not found" });
            }
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getUser(req, res) {
        try {
            const user = await artistSerivce_1.default.getUser(req.params.email);
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({ error: "User not found" });
            }
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await artistSerivce_1.default.getAllUsers();
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.default = ArtistController;
