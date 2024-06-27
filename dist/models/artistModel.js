"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllArtists = exports.findArtistByEmail = exports.createArtist = void 0;
const database_1 = __importDefault(require("../config/database"));
const createArtist = async (data) => {
    return await database_1.default.artist.create({ data });
};
exports.createArtist = createArtist;
const findArtistByEmail = async (email) => {
    return await database_1.default.artist.findUnique({ where: { email } });
};
exports.findArtistByEmail = findArtistByEmail;
const getAllArtists = async () => {
    return await database_1.default.artist.findMany();
};
exports.getAllArtists = getAllArtists;
