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
            // determine the file type
            const profilePhotoType = profilePhoto && mime_types_1.default.lookup(profilePhoto.filename);
            const bannerImageType = bannerImage && mime_types_1.default.lookup(bannerImage.filename);
            const signatureSoundType = signatureSound && mime_types_1.default.lookup(signatureSound.filename);
            if (signatureSound &&
                signatureSoundType !== "audio/mpeg" &&
                signatureSoundType !== "audio/mp3") {
                throw new Error("Invalid file type");
            }
            if (profilePhoto &&
                profilePhotoType !== "image/jpeg" &&
                profilePhotoType !== "image/png") {
                throw new Error("Invalid file type");
            }
            if (bannerImage &&
                bannerImageType !== "image/jpeg" &&
                bannerImageType !== "image/png") {
                throw new Error("Invalid file type");
            }
            const filesToUpload = [
                (profilePhoto === null || profilePhoto === void 0 ? void 0 : profilePhoto.path)
                    ? {
                        path: profilePhoto.path,
                        folder: "profile/",
                        type: profilePhotoType,
                    }
                    : null,
                (signatureSound === null || signatureSound === void 0 ? void 0 : signatureSound.path)
                    ? {
                        path: signatureSound.path,
                        folder: "signature/",
                        type: signatureSoundType,
                    }
                    : null,
                (bannerImage === null || bannerImage === void 0 ? void 0 : bannerImage.path)
                    ? { path: bannerImage.path, folder: "banner/", type: bannerImageType }
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
            // const result = await findArtistByUserId(userId);
            // const artistId = result?.id;
            // req.session.artistId = artistId; // Store artistId in session
            return res.json(updatedArtist);
        }
        catch (error) {
            console.error(error.message);
            res.status(400).json({ error: error.message });
        }
    }
    static async checkProfileCompletion(req, res) {
        try {
            const userId = req.userId;
            const result = await (0, userModel_1.findArtistByUserId)(userId);
            const artistId = result === null || result === void 0 ? void 0 : result.id;
            const profileCompletion = await artistSerivce_1.default.checkProfileCompletion(artistId);
            res.json(profileCompletion);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
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
            if (singleType !== "audio/mpeg" && singleType !== "audio/mp3") {
                throw new Error("Invalid file type");
            }
            if (coverImageType !== "image/jpeg" && coverImageType !== "image/png") {
                throw new Error("Invalid file type");
            }
            const result = await (0, userModel_1.findArtistByUserId)(req.userId);
            const artistId = result === null || result === void 0 ? void 0 : result.id;
            // console.log("artist Id from artistController:", artistId);
            // const artistId = req.session.artistId as string;
            const metadata = JSON.parse(req.body.metadata);
            if (!singleFile || !coverImage) {
                return res
                    .status(400)
                    .json({ error: "Single file or cover image missing" });
            }
            // save to cloudinary
            const filesToUpload = [
                { path: singleFile.path, folder: "singles/", type: singleType },
                { path: coverImage.path, folder: "cover/", type: coverImageType },
            ];
            // console.log("filesToUpload", filesToUpload);
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
            // console.error(error.message);
            return res.status(500).json({ error: error.message });
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
            const result = (await (0, userModel_1.findArtistByUserId)(req.userId));
            const artistId = result === null || result === void 0 ? void 0 : result.id;
            // console.log("artist Id:", artistId);
            // const artistId = req.session.artistId as string;
            const metadata = JSON.parse(req.body.metadata);
            if (!albumCover || albumFiles.length === 0) {
                return res.status(400).json({ error: "Album cover or files missing" });
            }
            const albumCoverType = albumCover && mime_types_1.default.lookup(albumCover.filename);
            const albumFilesType = albumFiles.map((file) => mime_types_1.default.lookup(file.filename));
            if (!albumCoverType) {
                throw new Error("Unable to determine file type");
            }
            albumFilesType.forEach((type) => {
                if (type !== "audio/mpeg" &&
                    type !== "audio/mp3" &&
                    type !== "audio/wav" &&
                    type !== "audio/m4a") {
                    throw new Error("Invalid file type");
                }
            });
            if (albumCoverType !== "image/jpeg" &&
                albumCoverType !== "image/png" &&
                albumCoverType !== "image/jpg") {
                throw new Error("Invalid file type");
            }
            // save to cloudinary
            const filesToUpload = [
                { path: albumCover.path, folder: "cover/", type: albumCoverType },
                ...albumFiles.map((file) => ({
                    path: file.path,
                    folder: "albums/",
                    type: mime_types_1.default.lookup(file.filename),
                })),
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
            return res.status(500).json({ error: error.message });
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
    static async getSingleById(req, res) {
        try {
            const single = await artistSerivce_1.default.getSingleById(req.params.id);
            if (single) {
                res.json(single);
            }
            else {
                res.status(404).json({ error: "Single not found" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getSinglesByArtist(req, res) {
        try {
            const artistId = req.params.id;
            const singles = await artistSerivce_1.default.getSinglesByArtist(artistId);
            if (singles) {
                res.json(singles);
            }
            else {
                res.status(404).json({ error: "Singles not found" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getAlbums(req, res) {
        try {
            const albums = await artistSerivce_1.default.getAlbums();
            if (albums) {
                res.json(albums);
            }
            else {
                res.status(404).json({ error: "Albums not found" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getAlbumById(req, res) {
        try {
            const album = await artistSerivce_1.default.getAlbumById(req.params.id);
            if (album) {
                res.json(album);
            }
            else {
                res.status(404).json({ error: "Album not found" });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getAlbumsByArtist(req, res) {
        try {
            const artistId = req.params.id;
            const albums = await artistSerivce_1.default.getAlbumsByArtist(artistId);
            if (albums) {
                res.json(albums);
            }
            else {
                res.status(404).json({ error: "Albums not found" });
            }
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
    static async getTrendingHits(req, res) {
        try {
            const artists = await artistSerivce_1.default.getTrendingHits();
            res.json(artists);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
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
