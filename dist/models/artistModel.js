"use strict";
// import prisma, { Artist, BlacklistedToken } from "../config/database";
// export const createArtist = async (
//   data: Omit<Artist, "id" | "createdAt" | "updatedAt">
// ): Promise<Artist> => {
//   return await prisma.artist.create({ data });
// };
// export const updatedArtist = async (
//   data: Omit<Artist, "createdAt" | "updatedAt">
// ): Promise<Artist> => {
//   return await prisma.artist.update({ where: { id: data.id }, data });
// };
// export const findArtistByEmail = async (
//   email: string
// ): Promise<Artist | null> => {
//   return await prisma.artist.findUnique({ where: { email } });
// };
// export const getAllArtists = async (): Promise<Artist[]> => {
//   return await prisma.artist.findMany();
// };
// export const logoutUser = async (token: string): Promise<BlacklistedToken> => {
//   const blacklistedToken = await prisma.blacklistedToken.findFirst({
//     where: { token },
//   });
//   if (blacklistedToken) {
//     throw new Error("Logged out already!");
//   }
//   return await prisma.blacklistedToken.create({ data: { token } });
// };
// export const savePasswordResetToken = async (userId: string, token: string) => {
//   const expirationTime = new Date();
//   expirationTime.setMinutes(expirationTime.getMinutes() + 10); // Token expires in 10 minutes
//   await prisma.passwordResetToken.create({
//     data: {
//       userId,
//       token,
//       expiresAt: expirationTime,
//     },
//   });
// };
// export const findArtistByPasswordResetToken = async (
//   token: string
// ): Promise<Artist | null> => {
//   const passwordResetToken = await prisma.passwordResetToken.findFirst({
//     where: { token },
//   });
//   if (!passwordResetToken) {
//     return null;
//   }
//   const user = await prisma.artist.findUnique({
//     where: { id: passwordResetToken.userId },
//   });
//   return user;
// };
// export const resetPassword = async (userId: string, password: string) => {
//   await prisma.artist.update({
//     where: { id: userId },
//     data: { password: password },
//   });
// };
// export const invalidateResetToken = async (token: string) => {
//   // fix this
//   await prisma.passwordResetToken.deleteMany({
//     where: { token: token },
//   });
// };
