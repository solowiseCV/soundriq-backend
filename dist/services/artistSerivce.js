"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../models/userModel");
const database_1 = __importDefault(require("../config/database"));
class ArtistService {
    // function to update artist profile
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
    static async uploadSingle(artistId, singleFile, coverImage, metadata) {
        try {
            // create a single file with the cover and metadata info to the artist
            const createdFiles = await database_1.default.file.create({
                data: {
                    filename: singleFile.filename,
                    path: singleFile.path,
                    artistId: artistId,
                    coverImage: coverImage,
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
    // function to upload album
    static async uploadAlbum(artistId, coverImage, albumFiles, metadata) {
        try {
            console.log(artistId);
            // Check if artistId exists
            const artistProfile = await database_1.default.artistProfile.findUnique({
                where: { id: artistId },
            });
            if (!artistProfile) {
                throw new Error("Artist profile not found");
            }
            // Create album entry
            const album = await database_1.default.album.create({
                data: {
                    title: metadata.title,
                    coverImage: coverImage,
                    metadata: metadata,
                    artistId: artistId,
                },
            });
            const createdTracks = await Promise.all(albumFiles.map(async (file) => {
                return database_1.default.track.create({
                    data: {
                        title: file.filename,
                        path: file.path,
                        albumId: album.id,
                    },
                    // include: { artist: true },
                });
            }));
            // console.log("createdFiles", createdAlbums);
            return { album, createdTracks };
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Failed to upload file");
        }
    }
    // function to get singles by artist
    static async getSinglesByArtist(artistId) {
        try {
            const files = await database_1.default.file.findMany({
                where: {
                    artistId: artistId,
                },
                include: {
                    artist: true,
                },
            });
            return files;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Unable to retrieve files");
        }
    }
    // function to get all singles
    static async getSingles() {
        try {
            const files = await database_1.default.file.findMany({
                include: {
                    artist: true,
                },
            });
            return files;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Unable to retrieve files");
        }
    }
    // function to get all albums
    static async getAlbums() {
        try {
            const albums = await database_1.default.album.findMany({
                include: {
                    artist: {
                        select: {
                            artistName: true,
                            id: true,
                        },
                    }
                },
            });
            return albums;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Unable to retrieve albums");
        }
    }
    // function to get albums by artist
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
    // function to get all artists
    static async getArtists() {
        const artists = await (0, userModel_1.getAllArtists)();
        return artists;
    }
    // function to get artist by id
    static async getArtist(artistId) {
        const artist = await database_1.default.artistProfile.findUnique({
            where: { id: artistId },
        });
        return artist;
    }
    // function to get user by email
    static async getUser(email) {
        const user = await (0, userModel_1.findUserByEmail)(email);
        return user;
    }
    // function to get all users
    static async getAllUsers() {
        const users = await (0, userModel_1.getAllUsers)();
        return users;
    }
}
exports.default = ArtistService;
