"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const artistSerivce_1 = __importDefault(require("../services/artistSerivce"));
class ArtistController {
    static async updateProfile(req, res) {
        try {
            const { artistName, countryOfOrigin, bio, dateOfBirth, musicGenre, appleMusicAddress, spotifyAddress, soundCloudAddress, youtubeAddress, instagramAddress, tiktokAddress, manager, } = req.body;
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
                bannerImage = files["bannerImage"] ? files["bannerImage"][0] : undefined;
                signatureSound = files["signatureSound"]
                    ? files["signatureSound"][0]
                    : undefined;
            }
            profilePhoto = profilePhoto ? profilePhoto.filename : undefined;
            bannerImage = bannerImage ? bannerImage.filename : undefined;
            signatureSound = signatureSound ? signatureSound.filename : undefined;
            console.log("profilePhoto", `/uploads/${profilePhoto}`);
            console.log("bannerImage", `/uploads/${bannerImage}`);
            console.log("signatureSound", `/uploads/${signatureSound}`);
            const data = {
                artistName,
                countryOfOrigin,
                bio,
                dateOfBirth,
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
            // console.log("user Id", userId);
            const user = await artistSerivce_1.default.updateProfile(userId, data);
            res.json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async uploadSingle(req, res) {
        // console.log("req body", req.body);
        // console.log("req files", req.files);
        try {
            if (!req.files || !req.body.metadata) {
                return res.status(400).json({ error: "No file or metadata uploaded" });
            }
            let singleFile;
            let coverImage;
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
            const userId = req.userId;
            const metadata = JSON.parse(req.body.metadata);
            if (!singleFile || !coverImage) {
                return res
                    .status(400)
                    .json({ error: "Single file or cover image missing" });
            }
            const fileId = await artistSerivce_1.default.uploadSingle(userId, singleFile, coverImage, metadata);
            return res.status(201).json(fileId);
            // console.log("fileId", fileId);
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    static async uploadAlbum(req, res) {
        try {
            if (!req.files || !req.body.metadata) {
                return res.status(400).json({ error: "No file or metadata uploaded" });
            }
            let albumCover;
            let albumFiles = [];
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
            const userId = req.userId;
            const metadata = JSON.parse(req.body.metadata);
            if (!albumCover || albumFiles.length === 0) {
                return res.status(400).json({ error: "Album cover or files missing" });
            }
            const fileId = await artistSerivce_1.default.uploadAlbum(userId, albumCover, albumFiles, metadata);
            return res.status(201).json(fileId);
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Internal server error" });
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
