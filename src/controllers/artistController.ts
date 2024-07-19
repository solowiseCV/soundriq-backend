import { Request, Response } from "express";
import ArtistService from "../services/artistSerivce";
import { MulterFile } from "../types/fileTypes";
import { uploadFilesToCloudinary } from "../utils/cloudinary";

class ArtistController {
  static async updateProfile(req: Request, res: Response) {
    try {
      const {
        artistName,
        countryOfOrigin,
        bio,
        dateOfBirth,
        musicGenre,
        appleMusicAddress,
        spotifyAddress,
        soundCloudAddress,
        youtubeAddress,
        instagramAddress,
        tiktokAddress,
        manager,
      } = req.body;

      let profilePhoto: any;
      let bannerImage: any;
      let signatureSound: any;

      const files = req.files as MulterFile[];

      if (Array.isArray(files)) {
        profilePhoto = files.find((file) => file.fieldname === "profilePhoto");
        bannerImage = files.find((file) => file.fieldname === "bannerImage");
        signatureSound = files.find(
          (file) => file.fieldname === "signatureSound"
        );
      } else {
        profilePhoto = files["profilePhoto"]
          ? files["profilePhoto"][0]
          : undefined;
        bannerImage = files["bannerImage"]
          ? files["bannerImage"][0]
          : undefined;
        signatureSound = files["signatureSound"]
          ? files["signatureSound"][0]
          : undefined;
      }

      const filesToUpload = [
        profilePhoto?.path
          ? { path: profilePhoto.path, folder: "profile/" }
          : null,
        signatureSound?.path
          ? { path: signatureSound.path, folder: "signature/" }
          : null,
        bannerImage?.path
          ? { path: bannerImage.path, folder: "banner/" }
          : null,
      ].filter((file) => file !== null);

      await uploadFilesToCloudinary(filesToUpload)
        .then((urls) => {
          const [profilePhotoUrl, signatureSoundUrl, bannerImageUrl] = urls;
          profilePhoto = profilePhotoUrl;
          bannerImage = bannerImageUrl;
          signatureSound = signatureSoundUrl;
        })
        .catch((err) => {
          console.error(`File upload error: ${err.message}`);
        });
        
      const data = {
        artistName,
        countryOfOrigin,
        bio,
        dateOfBirth,
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

      const userId = req.userId as string;
      const user = await ArtistService.updateProfile(userId, data);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async uploadSingle(req: Request, res: Response) {
    try {
      console.log(req.files, req.body.metadata);
      if (!req.files || !req.body.metadata) {
        return res.status(400).json({ error: "No file or metadata uploaded" });
      }

      let singleFile: any;
      let coverImage: any;

      if (Array.isArray(req.files)) {
        singleFile = req.files.find((file) => file.fieldname === "single");
        coverImage = req.files.find((file) => file.fieldname === "coverImage");
      } else {
        singleFile = req.files["single"] ? req.files["single"][0] : undefined;
        coverImage = req.files["coverImage"]
          ? req.files["coverImage"][0]
          : undefined;
      }

      const userId = req.userId as string;
      const metadata = JSON.parse(req.body.metadata);

      if (!singleFile || !coverImage) {
        return res
          .status(400)
          .json({ error: "Single file or cover image missing" });
      }

      const fileId = await ArtistService.uploadSingle(
        userId,
        singleFile,
        coverImage,
        metadata
      );

      return res.status(201).json(fileId);

      // console.log("fileId", fileId);
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async uploadAlbum(req: Request, res: Response) {
    try {
      if (!req.files || !req.body.metadata) {
        return res.status(400).json({ error: "No file or metadata uploaded" });
      }

      let albumCover: any;
      let albumFiles: any[] = [];

      if (Array.isArray(req.files)) {
        albumCover = req.files.find((file) => file.fieldname === "albumCover");
        albumFiles = req.files.filter(
          (file) => file.fieldname === "albumFiles"
        );
      } else {
        albumCover = req.files["albumCover"]
          ? req.files["albumCover"][0]
          : undefined;
        albumFiles = req.files["albumFiles"] ? req.files["albumFiles"] : [];
      }

      const userId = req.userId as string;
      const metadata = JSON.parse(req.body.metadata);

      if (!albumCover || albumFiles.length === 0) {
        return res.status(400).json({ error: "Album cover or files missing" });
      }

      const fileId = await ArtistService.uploadAlbum(
        userId,
        albumCover,
        albumFiles,
        metadata
      );

      return res.status(201).json(fileId);
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }


  static async getSingles(req: Request, res: Response) {
    try {
      const singles = await ArtistService.getSingles();
      res.json(singles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSinglesByArtist(req: Request, res: Response) {
    try {
      const artistId = req.params.id;
      const singles = await ArtistService.getSinglesByArtist(artistId);
      res.json(singles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAlbums(req: Request, res: Response) {
    try {
      const albums = await ArtistService.getAlbums();
      res.json(albums);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAlbumsByArtist(req: Request, res: Response) {
    try {
      const artistId = req.params.id;
      const albums = await ArtistService.getAlbumsByArtist(artistId);
      res.json(albums);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getArtists(req: Request, res: Response) {
    try {
      const artist = await ArtistService.getArtists();
      if (artist) {
        res.json(artist);
      } else {
        res.status(404).json({ error: "Artist not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getArtist(req: Request, res: Response) {
    try {
      const artist = await ArtistService.getArtist(req.params.id);
      if (artist) {
        res.json(artist);
      } else {
        res.status(404).json({ error: "Artist not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const user = await ArtistService.getUser(req.params.email);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await ArtistService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ArtistController;
