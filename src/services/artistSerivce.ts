import {
  updateUser,
  findUserByEmail,
  getAllUsers,
  getAllArtists,
} from "../models/userModel";
import prisma from "../config/database";
import mime from "mime-types";

class ArtistService {
  static async updateProfile(userId: String, userData: any) {
    const user = await updateUser({
      ...userData,
      artistProfile: {
        ...userData,
      },
      id: userId,
    });
    return user;
  }

  static async uploadSingle(
    artistProfileId: string,
    singleFile: any,
    coverImage: any,
    metadata: any
  ) {
    try {
      // Determine the file type
      const singleType = singleFile && mime.lookup(singleFile.filename);
      const coverImageType = coverImage && mime.lookup(coverImage.filename);

      if (!singleType || !coverImageType) {
        throw new Error("Unable to determine file type");
      }

      // create a single file with the cover and metadata info to the artist
      const createdFiles = await prisma.file.create({
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
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Failed to upload file");
    }
  }

  static async uploadAlbum(
    artistProfileId: string,
    coverImage: any,
    albumFiles: any,
    metadata: any
  ) {
    try {
      const coverImageType = coverImage && mime.lookup(coverImage.filename);

      if (!coverImageType) {
        throw new Error("Unable to determine file type");
      }

      const createdAlbums = await Promise.all(
        albumFiles.map(async (file: any) => {
          return prisma.album.create({
            data: {
              title: file.filename,
              path: file.path,
              artistId: artistProfileId,
              coverImage: coverImage.path,
              metadata: metadata,
            },
            // include: { artist: true },
          });
        })
      );

      console.log("createdFiles", createdAlbums);

      return createdAlbums;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Failed to upload file");
    }
  }

  static async getAlbumsByArtist(artistId: string) {
    try {
      const albums = await prisma.album.findMany({
        where: {
          artistId: artistId,
        },
        include: {
          artist: true,
        },
      });
      return albums;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Unable to retrieve albums");
    }
  }

  static async getArtists() {
    const artists = await getAllArtists();
    return artists;
  }

  static async getArtist(artistId: string) {
    const artist = await prisma.artistProfile.findUnique({
      where: { id: artistId },
    });
    return artist;
  }

  static async getUser(email: string) {
    const user = await findUserByEmail(email);
    return user;
  }

  static async getAllUsers() {
    const users = await getAllUsers();
    return users;
  }
}

export default ArtistService;
