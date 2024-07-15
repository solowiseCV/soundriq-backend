import { Request, Response } from "express";
import UserService from "../services/authService";
import upload from "../middlewares/artist/file_upload";
import { MulterFile } from "../types/fileTypes";

class UserController {
  static async registerUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // check email format
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      // check password length
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const user = await UserService.registerUser(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token, userInfo } = await UserService.loginUser(email, password);
      res.json({ token, userInfo });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateUser(req: Request, res: Response) {
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
      // console.log("user Id", userId);
      const user = await UserService.updateUser(userId, data);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const user = await UserService.getUser(req.params.email);
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
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("No token provided");
      }
      const result = await UserService.logoutUser(token);

      res.json({ message: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await UserService.forgotPassword(email);

      res.json({ message: "Password reset link sent to email" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      const token = req.params.token;
      const result = await UserService.resetPassword(token, password);

      res.json({ message: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default UserController;
