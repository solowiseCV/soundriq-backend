"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../models/userModel");
const database_1 = __importDefault(require("../config/database"));
const mime_types_1 = __importDefault(require("mime-types"));
class ArtistService {
    static async updateProfile(userId, userData) {
        const user = await (0, userModel_1.updateUser)({
            ...userData,
            artistProfile: {
                ...userData,
            },
            id: userId,
        });
        return user;
    }
    static async uploadSingle(artistProfileId, singleFile, coverImage, metadata) {
        try {
            // Determine the file type
            const singleType = singleFile && mime_types_1.default.lookup(singleFile.filename);
            const coverImageType = coverImage && mime_types_1.default.lookup(coverImage.filename);
            if (!singleType || !coverImageType) {
                throw new Error("Unable to determine file type");
            }
            // create a single file with the cover and metadata info to the artist
            const createdFiles = await database_1.default.file.create({
                data: {
                    filename: singleFile.filename,
                    path: singleFile.path,
                    artistId: artistProfileId,
                    coverImage: coverImage.path,
                    metadata: metadata,
                },
                // include: { artist: true },
            });
            return createdFiles;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Failed to upload file");
        }
    }
    static async uploadAlbum(artistProfileId, coverImage, albumFiles, metadata) {
        try {
            const coverImageType = coverImage && mime_types_1.default.lookup(coverImage.filename);
            if (!coverImageType) {
                throw new Error("Unable to determine file type");
            }
            const createdAlbums = await Promise.all(albumFiles.map(async (file) => {
                return database_1.default.album.create({
                    data: {
                        title: file.filename,
                        path: file.path,
                        artistId: artistProfileId,
                        coverImage: coverImage.path,
                        metadata: metadata,
                    },
                    // include: { artist: true },
                });
            }));
            console.log("createdFiles", createdAlbums);
            return createdAlbums;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Failed to upload file");
        }
    }
    static async getAlbumsByArtist(artistId) {
        try {
            const albums = await database_1.default.album.findMany({
                where: {
                    artistId: artistId,
                },
                include: {
                    artist: true,
                },
            });
            return albums;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Unable to retrieve albums");
        }
    }
    static async getArtists() {
        const artists = await (0, userModel_1.getAllArtists)();
        return artists;
    }
    static async getArtist(artistId) {
        const artist = await database_1.default.artistProfile.findUnique({
            where: { id: artistId },
        });
        return artist;
    }
    static async getUser(email) {
        const user = await (0, userModel_1.findUserByEmail)(email);
        return user;
    }
    static async getAllUsers() {
        const users = await (0, userModel_1.getAllUsers)();
        return users;
    }
}
exports.default = ArtistService;
