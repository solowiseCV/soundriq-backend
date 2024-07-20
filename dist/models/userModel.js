"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateResetToken = exports.resetPassword = exports.findUserByPasswordResetToken = exports.savePasswordResetToken = exports.logoutUser = exports.getAllArtists = exports.getAllUsers = exports.findUserByEmail = exports.findArtistByUserId = exports.updateUser = exports.createUser = void 0;
const database_1 = __importDefault(require("../config/database"));
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
const calculateProfileCompletion = (profile) => {
    const totalFields = profileFields.length;
    let filledFields = 0;
    profileFields.forEach((field) => {
        if (profile[field]) {
            filledFields++;
        }
    });
    const completed = Math.floor((filledFields / totalFields) * 85);
    console.log(completed);
    return completed + 15;
};
const createUser = async (data) => {
    const { artistProfile, ...userData } = data;
    const profileCompletion = 15;
    const user = await database_1.default.user.create({
        data: {
            ...userData,
            artistProfile: artistProfile
                ? {
                    create: artistProfile,
                }
                : undefined,
        },
        // include: { artistProfile: true },
    });
    return { user, profileCompletion };
};
exports.createUser = createUser;
const updateUser = async (data) => {
    const { artistProfile } = data;
    const profileCompletion = artistProfile
        ? calculateProfileCompletion(artistProfile)
        : 0;
    const updatedArtist = await database_1.default.user.update({
        where: { id: data.id },
        data: {
            artistProfile: artistProfile
                ? {
                    update: {
                        ...artistProfile,
                    },
                }
                : undefined,
        },
        include: { artistProfile: true },
    });
    return { user: updatedArtist, profileCompletion };
};
exports.updateUser = updateUser;
const findArtistByUserId = async (userId) => {
    return await database_1.default.artistProfile.findFirst({ where: { userId } });
};
exports.findArtistByUserId = findArtistByUserId;
const findUserByEmail = async (email) => {
    return await database_1.default.user.findUnique({ where: { email } });
};
exports.findUserByEmail = findUserByEmail;
const getAllUsers = async () => {
    return await database_1.default.user.findMany();
};
exports.getAllUsers = getAllUsers;
const getAllArtists = async () => {
    return await database_1.default.artistProfile.findMany();
};
exports.getAllArtists = getAllArtists;
const logoutUser = async (token) => {
    const blacklistedToken = await database_1.default.blacklistedToken.findFirst({
        where: { token },
    });
    if (blacklistedToken) {
        throw new Error("Logged out already!");
    }
    return await database_1.default.blacklistedToken.create({ data: { token } });
};
exports.logoutUser = logoutUser;
const savePasswordResetToken = async (userId, token) => {
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10); // Token expires in 10 minutes
    const user = await database_1.default.passwordResetToken.create({
        data: {
            userId,
            token,
            expiresAt: expirationTime,
        },
    });
};
exports.savePasswordResetToken = savePasswordResetToken;
const findUserByPasswordResetToken = async (token) => {
    const passwordResetToken = await database_1.default.passwordResetToken.findFirst({
        where: { token },
    });
    if (!passwordResetToken) {
        return null;
    }
    const user = await database_1.default.user.findUnique({
        where: { id: passwordResetToken.userId },
    });
    return user;
};
exports.findUserByPasswordResetToken = findUserByPasswordResetToken;
const resetPassword = async (userId, password) => {
    await database_1.default.user.update({
        where: { id: userId },
        data: { password: password },
    });
};
exports.resetPassword = resetPassword;
const invalidateResetToken = async (token) => {
    // fix this
    await database_1.default.passwordResetToken.deleteMany({
        where: { token: token },
    });
};
exports.invalidateResetToken = invalidateResetToken;
