import {
  updateUser,
  findUserByEmail,
  getAllUsers,
  getAllArtists,
} from "../models/userModel";
import prisma from "../config/database";

class ArtistService {
  // function to update artist profile
  static async updateProfile(userId: String, userData: any) {
    try {
      const user = await updateUser({
        ...userData,
        artistProfile: {
          ...userData,
        },
        id: userId,
      });
      return user;
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  static async uploadSingle(
    artistId: string,
    singleFile: any,
    coverImage: any,
    metadata: any
  ) {
    try {
      // create a single file with the cover and metadata info to the artist
      const createdFiles = await prisma.single.create({
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
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  // function to upload album
  static async uploadAlbum(
    artistId: string,
    coverImage: any,
    albumFiles: any,
    metadata: any
  ) {
    try {
      // Check if artistId exists
      const artistProfile = await prisma.artistProfile.findUnique({
        where: { id: artistId },
      });

      if (!artistProfile) {
        throw new Error("Artist profile not found");
      }

      // Create album entry
      const album = await prisma.album.create({
        data: {
          title: metadata.title,
          coverImage: coverImage,
          metadata: metadata,
          artistId: artistId,
        },
      });

      const createdTracks = await Promise.all(
        albumFiles.map(async (file: any) => {
          return prisma.track.create({
            data: {
              title: file.filename,
              path: file.path,
              albumId: album.id,
            },
            // include: { artist: true },
          });
        })
      );

      // console.log("createdFiles", createdAlbums);

      return { album, createdTracks };
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  // function to get singles by artist
  static async getSinglesByArtist(artistId: string) {
    try {
      const files = await prisma.single.findMany({
        where: {
          artistId: artistId,
        },
        include: {
          artist: {
            select: {
              artistName: true,
              id: true,
            },
          },
        },
      });
      return files;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Unable to retrieve files");
    }
  }

  // function to get single by id
  static async getSingleById(singleId: string) {
    try {
      const file = await prisma.single.findUnique({
        where: {
          id: singleId,
        },
        include: {
          artist: {
            select: {
              artistName: true,
              id: true,
            },
          },
        },
      });
      return file;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Unable to retrieve file");
    }
  }

  // function to get all singles
  static async getSingles() {
    try {
      const files = await prisma.single.findMany({
        include: {
          artist: {
            select: {
              artistName: true,
              id: true,
            },
          },
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
          artist: {
            select: {
              artistName: true,
              id: true,
            },
          },
        },
      });
      return albums;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Unable to retrieve albums");
    }
  }

  // function to get album by id
  static async getAlbumById(albumId: string) {
    try {
      const album = await prisma.album.findUnique({
        where: {
          id: albumId,
        },
        include: {
          artist: {
            select: {
              artistName: true,
              id: true,
            },
          },
        },
      });
      return album;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Unable to retrieve album");
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
          artist: {
            select: {
              artistName: true,
              id: true,
            },
          },
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
