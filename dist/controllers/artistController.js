"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const artistService_1 = __importDefault(require("../services/artistService"));
class ArtistController {
    static async register(req, res) {
        // upload(req, res, async (err: any) => {
        //   if (err) {
        //     return res.status(400).json({ error: err.message });
        //   }
        try {
            const { fullName, artistName, email, password, countryOfOrigin, bio, musicGenre, appleMusicAddress, spotifyAddress, soundCloudAddress, youtubeAddress, instagramAddress, tiktokAddress, manager, } = req.body;
            console.log("Logging req body from artistController", req.body);
            console.log("Logging req files from artistController", req.files);
            const files = req.files;
            const profilePhoto = (files === null || files === void 0 ? void 0 : files.profilePhoto)
                ? files.profilePhoto[0].path
                : "";
            const bannerImage = (files === null || files === void 0 ? void 0 : files.bannerImage) ? files.bannerImage[0].path : "";
            const signatureSound = (files === null || files === void 0 ? void 0 : files.signatureSound)
                ? files.signatureSound[0].path
                : "";
            const data = {
                fullName,
                artistName,
                email,
                password,
                profilePhoto,
                bannerImage,
                signatureSound,
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
            };
            const artist = await artistService_1.default.registerArtist(data);
            if (!artist) {
                res.status(400).json({ error: "Artist registration failed" });
            }
            res.status(201).json({ artist });
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error", message: error });
        }
        // });
    }
}
exports.default = ArtistController;
