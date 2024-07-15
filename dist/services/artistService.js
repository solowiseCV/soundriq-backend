"use strict";
// import {
//   createArtist,
//   updatedArtist,
//   getAllArtists,
//   findArtistByEmail,
//   logoutUser,
//   savePasswordResetToken,
//   findArtistByPasswordResetToken,
//   resetPassword,
//   invalidateResetToken,
// } from "../models/artistModel";
// import { v4 as uuidv4 } from "uuid";
// import { sendPasswordResetEmail } from "../utils/email";
// import bcrypt from "bcrypt";
// const FRONTEND_URL = require("../config/index").FRONTEND_URL;
// class ArtistService {
//   static async registerArtist(artistData: any) {
//     // console.log(artistData)
//     const existingArtist = await findArtistByEmail(artistData.email);
//     if (existingArtist) {
//       return { error: "Artist already exists" };
//       // throw new Error("Artist already exists");
//     }
//     const hashedPassword = await bcrypt.hash(artistData.password, 10);
//     const artist = await createArtist({
//       ...artistData,
//       password: hashedPassword,
//     });
//     if (artist) {
//       const { fullName, email, id } = artist;
//       const artistInfo = {
//         fullName,
//         email,
//         id,
//       };
//       return artistInfo;
//     }
//     throw new Error("Artist not created");
//   }
//   //   static async loginArtist(email: string, password: string) {
//   //     const artist = await findArtistByEmail(email);
//   //     if (!artist) {
//   //       throw new Error("artist not found");
//   //     }
//   //     const isPasswordValid = await bcrypt.compare(password, artist.password);
//   //     if (!isPasswordValid) {
//   //       throw new Error("Invalid credentials");
//   //     }
//   //     const token = generateToken(artist.id);
//   //     return { token, artist };
//   //   }
//   //   static async getArtist(email: string) {
//   //     const artist = await findArtistByEmail(email);
//   //     return artist;
//   //   }
//   static async getAllArtists() {
//     const artists = await getAllArtists();
//     return artists;
//   }
//   static async completeProfile(artistId: Number, data: any) {
//     // const artist = await findArtistByEmail(email);
//     // if (!artist) {
//     //   throw new Error("Artist not found");
//     // }
//     try {
//       const updated = await updatedArtist({
//         ...data,
//         id: artistId,
//       });
//       if (updated) {
//         // console.log("updated from service", updated);
//         return updated;
//       }
//     } catch (error) {
//       throw new Error("Profile not updated");
//     }
//   }
//   static async logoutUser(token: string) {
//     // Add token to blacklist
//     const res = await logoutUser(token);
//     if (!res) {
//       throw new Error("Token not found");
//     }
//     if (res) {
//       return "User logged out successfully";
//     }
//   }
//   static async forgotPassword(email: string) {
//     const user = await findArtistByEmail(email);
//     if (!user) {
//       throw new Error("User not found");
//     }
//     // Generate reset link
//     const resetToken = uuidv4();
//     // Save reset token
//     await savePasswordResetToken(user.id, resetToken);
//     const resetLink = `${FRONTEND_URL}/auth/reset-password/?token=${resetToken}`;
//     // Send reset link to user
//     await sendPasswordResetEmail(email, resetLink);
//     return;
//   }
//   static async resetPassword(token: string, password: string) {
//     const user = await findArtistByPasswordResetToken(token);
//     if (!user) {
//       throw new Error("Invalid or expired token");
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     // Update user password
//     await resetPassword(user.id, hashedPassword);
//     // Invalidate reset token
//     await invalidateResetToken(token);
//     return "Password reset successfully";
//   }
//   static async getUser(email: string) {
//     const user = await findArtistByEmail(email);
//     return user;
//   }
// }
// export default ArtistService;
