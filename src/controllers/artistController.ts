import e, { Request, Response } from "express";
import ArtistService from "../services/artistSerivce";
import { findArtistByUserId } from "../models/userModel";
import { MulterFile } from "../types/fileTypes";
import { uploadFilesToCloudinary } from "../utils/cloudinary";
import mime from "mime-types";

class ArtistController {
  static async updateProfile(req: Request, res: Response) {
    try {
      const {
        artistName,
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

      // determine the file type
      const profilePhotoType =
        profilePhoto && mime.lookup(profilePhoto.filename);
      const bannerImageType = bannerImage && mime.lookup(bannerImage.filename);
      const signatureSoundType =
        signatureSound && mime.lookup(signatureSound.filename);

      if (
        signatureSound &&
        signatureSoundType !== "audio/mpeg" &&
        signatureSoundType !== "audio/mp3"
      ) {
        throw new Error("Invalid file type");
      }

      if (
        profilePhoto &&
        profilePhotoType !== "image/jpeg" &&
        profilePhotoType !== "image/png"
      ) {
        throw new Error("Invalid file type");
      }

      if (
        bannerImage &&
        bannerImageType !== "image/jpeg" &&
        bannerImageType !== "image/png"
      ) {
        throw new Error("Invalid file type");
      }

      const filesToUpload = [
        profilePhoto?.path
          ? {
              path: profilePhoto.path,
              folder: "profile/",
              type: profilePhotoType,
            }
          : null,
        signatureSound?.path
          ? {
              path: signatureSound.path,
              folder: "signature/",
              type: signatureSoundType,
            }
          : null,
        bannerImage?.path
          ? { path: bannerImage.path, folder: "banner/", type: bannerImageType }
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
      const updatedArtist = await ArtistService.updateProfile(userId, data);
      // const result = await findArtistByUserId(userId);
      // const artistId = result?.id;
      // req.session.artistId = artistId; // Store artistId in session
      return res.json(updatedArtist);
    } catch (error: any) {
      console.error(error.message);
      res.status(400).json({ error: error.message });
    }
  }

  static async uploadSingle(req: Request, res: Response) {
    try {
      if (!req.files || !req.body.metadata) {
        return res.status(400).json({ error: "No file or metadata uploaded" });
      }

      let singleFile: any;
      let coverImage: any;
      let singleFileUrl: any;

      if (Array.isArray(req.files)) {
        singleFile = req.files.find((file) => file.fieldname === "single");
        coverImage = req.files.find((file) => file.fieldname === "coverImage");
      } else {
        singleFile = req.files["single"] ? req.files["single"][0] : undefined;
        coverImage = req.files["coverImage"]
          ? req.files["coverImage"][0]
          : undefined;
      }

      // Determine the file type
      const singleType = singleFile && mime.lookup(singleFile.filename);
      const coverImageType = coverImage && mime.lookup(coverImage.filename);

      if (!singleType || !coverImageType) {
        throw new Error("Unable to determine file type");
      }

      if (singleType !== "audio/mpeg" && singleType !== "audio/mp3") {
        throw new Error("Invalid file type");
      }

      if (coverImageType !== "image/jpeg" && coverImageType !== "image/png") {
        throw new Error("Invalid file type");
      }

      const result = await findArtistByUserId(req.userId as string) as any;
      const artistId = result?.id;
      // console.log("artist Id from artistController:", artistId);

      // const artistId = req.session.artistId as string;

      const metadata = JSON.parse(req.body.metadata);

      if (!singleFile || !coverImage) {
        return res
          .status(400)
          .json({ error: "Single file or cover image missing" });
      }

      // save to cloudinary
      const filesToUpload = [
        { path: singleFile.path, folder: "singles/", type: singleType },
        { path: coverImage.path, folder: "cover/", type: coverImageType },
      ];

      // console.log("filesToUpload", filesToUpload);

      await uploadFilesToCloudinary(filesToUpload)
        .then((urls) => {
          const [singleUrl, coverUrl] = urls;
          singleFileUrl = singleUrl;
          coverImage = coverUrl;
        })
        .catch((err) => {
          console.error(`File upload error: ${err.message}`);
        });

      singleFile = {
        filename: singleFile.filename,
        path: singleFileUrl,
      };

      const fileId = await ArtistService.uploadSingle(
        artistId,
        singleFile,
        coverImage,
        metadata
      );

      return res.status(201).json(fileId);
    } catch (error: any) {
      // console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  static async uploadAlbum(req: Request, res: Response) {
    try {
      if (!req.files || !req.body.metadata) {
        return res.status(400).json({ error: "No file or metadata uploaded" });
      }

      let albumCover: any;
      let albumFiles: any[] = [];
      let albumFilesUrl: any[] = [];

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

      const result = (await findArtistByUserId(req.userId as string)) as any;
      const artistId = result?.id;
      // console.log("artist Id:", artistId);

      // const artistId = req.session.artistId as string;
      const metadata = JSON.parse(req.body.metadata);

      if (!albumCover || albumFiles.length === 0) {
        return res.status(400).json({ error: "Album cover or files missing" });
      }

      const albumCoverType = albumCover && mime.lookup(albumCover.filename);
      const albumFilesType = albumFiles.map((file) =>
        mime.lookup(file.filename)
      );

      if (!albumCoverType) {
        throw new Error("Unable to determine file type");
      }

      albumFilesType.forEach((type) => {
        if (
          type !== "audio/mpeg" &&
          type !== "audio/mp3" &&
          type !== "audio/wav" &&
          type !== "audio/m4a"
        ) {
          throw new Error("Invalid file type");
        }
      });

      if (
        albumCoverType !== "image/jpeg" &&
        albumCoverType !== "image/png" &&
        albumCoverType !== "image/jpg"
      ) {
        throw new Error("Invalid file type");
      }

      // save to cloudinary
      const filesToUpload = [
        { path: albumCover.path, folder: "cover/", type: albumCoverType },
        ...albumFiles.map((file) => ({
          path: file.path,
          folder: "albums/",
          type: mime.lookup(file.filename),
        })),
      ];

      await uploadFilesToCloudinary(filesToUpload)
        .then((urls) => {
          albumCover = urls[0];
          albumFilesUrl = urls.slice(1);
        })
        .catch((err) => {
          console.error(`File upload error: ${err.message}`);
        });

      albumFiles = albumFiles.map((file, index) => ({
        filename: file.filename,
        path: albumFilesUrl[index],
      }));

      const fileId = await ArtistService.uploadAlbum(
        artistId,
        albumCover,
        albumFiles,
        metadata
      );

      return res.status(201).json(fileId);
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
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

  static async getSingleById(req: Request, res: Response) {
    try {
      const single = await ArtistService.getSingleById(req.params.id);
      if (single) {
        res.json(single);
      } else {
        res.status(404).json({ error: "Single not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSinglesByArtist(req: Request, res: Response) {
    try {
      const artistId = req.params.id;
      const singles = await ArtistService.getSinglesByArtist(artistId);

      if (singles) {
        res.json(singles);
      } else {
        res.status(404).json({ error: "Singles not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAlbums(req: Request, res: Response) {
    try {
      const albums = await ArtistService.getAlbums();

      if (albums) {
        res.json(albums);
      } else {
        res.status(404).json({ error: "Albums not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAlbumById(req: Request, res: Response) {
    try {
      const album = await ArtistService.getAlbumById(req.params.id);
      if (album) {
        res.json(album);
      } else {
        res.status(404).json({ error: "Album not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAlbumsByArtist(req: Request, res: Response) {
    try {
      const artistId = req.params.id;
      const albums = await ArtistService.getAlbumsByArtist(artistId);

      if (albums) {
        res.json(albums);
      } else {
        res.status(404).json({ error: "Albums not found" });
      }
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
