"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const artistService_1 = __importDefault(require("../services/artistService"));
const profileFields = [
    "artistName",
    "profilePhoto",
    "bannerImage",
    "signatureSound",
    "countryOfOrigin",
    "bio",
    "musicGenre",
    "appleMusicAddress",
    "spotifyAddress",
    "soundCloudAddress",
    "youtubeAddress",
    "instagramAddress",
    "tiktokAddress",
    "manager",
];
const calculateProfileCompletion = (artist) => {
    const totalFields = profileFields.length;
    let filledFields = 0;
    profileFields.forEach((field) => {
        if (artist[field]) {
            filledFields++;
        }
    });
    console.log("filledFields", filledFields);
    console.log("totalFields", totalFields);
    return Math.floor((filledFields / totalFields) * 100);
};
class ArtistController {
    static async register(req, res) {
        try {
            const { fullName, email, password, dateOfBirth } = req.body;
            const data = {
                fullName,
                email,
                dateOfBirth,
                password,
            };
            console.log("data:", data);
            const artist = await artistService_1.default.registerArtist(data);
            if (!artist) {
                res.status(400).json({ error: "Artist registration failed" });
            }
            res.status(201).json({ artist });
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error", message: error });
        }
    }
    static async completeProfile(req, res) {
        // upload(req, res, async (err: any) => {
        //   if (err) {
        //     return res.status(400).json({ error: err.message });
        //   }
        try {
            const { artistName, countryOfOrigin, bio, musicGenre, appleMusicAddress, spotifyAddress, soundCloudAddress, youtubeAddress, instagramAddress, tiktokAddress, manager, } = req.body;
            const files = req.files;
            const profilePhoto = (files === null || files === void 0 ? void 0 : files.profilePhoto)
                ? files.profilePhoto[0].path
                : "";
            const bannerImage = (files === null || files === void 0 ? void 0 : files.bannerImage) ? files.bannerImage[0].path : "";
            const signatureSound = (files === null || files === void 0 ? void 0 : files.signatureSound)
                ? files.signatureSound[0].path
                : "";
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
            const artistId = req.artistId;
            console.log("Updating artist with data:", data);
            console.log("Artist ID:", artistId);
            const updatedArtist = await artistService_1.default.completeProfile(artistId, data);
            // if (!updatedArtist) {
            //   res.status(400).json({ error: "Profile update failed" });
            // }
            // Calculate profile completion percentage
            const completionPercentage = calculateProfileCompletion(updatedArtist);
            res
                .status(201)
                .json({
                message: "Profile updated successfully",
                updatedArtist,
                completionPercentage,
            });
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error", message: error });
        }
        // });
    }
}
exports.default = ArtistController;
