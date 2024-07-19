import {
  updateUser,
  findUserByEmail,
  getAllUsers,
  getAllArtists,
} from "../models/userModel";
import prisma from "../config/database";
import mime from "mime-types";

class ArtistService {
  // function to update artist profile
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

  // function to upload album
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

      // console.log("createdFiles", createdAlbums);

      return createdAlbums;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Failed to upload file");
    }
  }

  // function to get singles by artist
  static async getSinglesByArtist(artistId: string) {
    try {
      const files = await prisma.file.findMany({
        where: {
          artistId: artistId,
        },
        include: {
          artist: true,
        },
      });
      return files;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Unable to retrieve files");
    }
  }

  // function to get all singles
  static async getSingles() {
    try {
      const files = await prisma.file.findMany({
        include: {
          artist: true,
        },
      });
      return files;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Unable to retrieve files");
    }
  }

  // function to get all albums
  static async getAlbums() {
    try {
      const albums = await prisma.album.findMany({
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

  // function to get albums by artist
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

  // function to get all artists
  static async getArtists() {
    const artists = await getAllArtists();
    return artists;
  }

  // function to get artist by id
  static async getArtist(artistId: string) {
    const artist = await prisma.artistProfile.findUnique({
      where: { id: artistId },
    });
    return artist;
  }

  // function to get user by email
  static async getUser(email: string) {
    const user = await findUserByEmail(email);
    return user;
  }

  // function to get all users
  static async getAllUsers() {
    const users = await getAllUsers();
    return users;
  }
}

export default ArtistService;
