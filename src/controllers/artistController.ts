import { Request, Response } from "express";
import ArtistService from "../services/artistService";
import {Artist} from "../types/artistProfile";
import upload from "../middlewares/artist/file_upload";
import { MulterFile } from "../types/fileTypes";

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



const calculateProfileCompletion = (artist: Artist): number => {
  const totalFields = profileFields.length;
  let filledFields = 0;

  profileFields.forEach((field) => {
    if (artist[field as keyof Artist]) {
      filledFields++;
    }
  });

  console.log("filledFields", filledFields);
  console.log("totalFields", totalFields);

  return Math.floor((filledFields / totalFields) * 100);
};

class ArtistController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, email, password, dateOfBirth } = req.body;

      
      const data = {
        fullName,
        email,
        dateOfBirth,
        password,
      };

      const artist = await ArtistService.registerArtist(data);

      if (!artist) {
        res.status(400).json({ error: "Artist registration failed" });
      }

      res.status(201).json({ artist });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", message: error });
    }
  }

  static async completeProfile(req: Request, res: Response): Promise<void> {
    // upload(req, res, async (err: any) => {
    //   if (err) {
    //     return res.status(400).json({ error: err.message });
    //   }

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

      const files = req.files as { [fieldname: string]: MulterFile[] };

      const profilePhoto = files?.profilePhoto
        ? files.profilePhoto[0].path
        : "";
      const bannerImage = files?.bannerImage ? files.bannerImage[0].path : "";
      const signatureSound = files?.signatureSound
        ? files.signatureSound[0].path
        : "";

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

      const artistId = req.artistId as number;

      // console.log("Updating artist with data:", data);
      // console.log("Artist ID:", artistId);
      const updatedArtist = await ArtistService.completeProfile(artistId, data);

      // if (!updatedArtist) {
      //   res.status(400).json({ error: "Profile update failed" });
      // }

      // Calculate profile completion percentage
      const completionPercentage = calculateProfileCompletion(
        updatedArtist as Artist
      );
      res
        .status(201)
        .json({
          message: "Profile updated successfully",
          updatedArtist,
          completionPercentage,
        });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", message: error });
    }
    // });
  }
}

export default ArtistController;
