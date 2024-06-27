"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const artistModel_1 = require("../models/artistModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
class ArtistService {
    static async registerArtist(artistData) {
        const hashedPassword = await bcrypt_1.default.hash(artistData.password, 10);
        const artist = await (0, artistModel_1.createArtist)({
            ...artistData,
            password: hashedPassword,
        });
        if (artist) {
            return artist;
        }
        throw new Error("Artist not created");
    }
    //   static async loginArtist(email: string, password: string) {
    //     const artist = await findArtistByEmail(email);
    //     if (!artist) {
    //       throw new Error("artist not found");
    //     }
    //     const isPasswordValid = await bcrypt.compare(password, artist.password);
    //     if (!isPasswordValid) {
    //       throw new Error("Invalid credentials");
    //     }
    //     const token = generateToken(artist.id);
    //     return { token, artist };
    //   }
    //   static async getArtist(email: string) {
    //     const artist = await findArtistByEmail(email);
    //     return artist;
    //   }
    static async getAllArtists() {
        const artists = await (0, artistModel_1.getAllArtists)();
        return artists;
    }
}
exports.default = ArtistService;
