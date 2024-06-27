import { Request, Response } from "express";
import ArtistService from "../services/artistService";
import upload from "../middlewares/artist/file_upload";
import { MulterFile } from "../types/fileTypes";

class ArtistController {
  static async register(req: Request, res: Response): Promise<void> {
    // upload(req, res, async (err: any) => {
    //   if (err) {
    //     return res.status(400).json({ error: err.message });
    //   }

    try {
      const {
        fullName,
        artistName,
        email,
        password,
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

      console.log("Logging req body from artistController", req.body);
      console.log("Logging req files from artistController", req.files);

      const files = req.files as { [fieldname: string]: MulterFile[] };

      const profilePhoto = files?.profilePhoto
        ? files.profilePhoto[0].path
        : "";
      const bannerImage = files?.bannerImage ? files.bannerImage[0].path : "";
      const signatureSound = files?.signatureSound
        ? files.signatureSound[0].path
        : "";

      const data = {
        fullName,
        artistName,
        email,
        password,
        profilePhoto,
        bannerImage,
        signatureSound,
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
      };

      const artist = await ArtistService.registerArtist(data);

      if (!artist) {
        res.status(400).json({ error: "Artist registration failed" });
      }

      res.status(201).json({ artist });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", message: error});
    }
    // });
  }
}

export default ArtistController;
