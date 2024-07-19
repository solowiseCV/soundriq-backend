import { Request, Response } from "express";
import FileService from "../services/fileService";

class FileController {
  // upload a file
  static async uploadFile(req: Request, res: Response) {
    // console.log("req body", req.body);
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userId = req.userId as string;

      // const { filename, path } = req.file;

      const files = req.files.map((file: Express.Multer.File) => ({
        filename: file.filename,
        path: file.path,
      }));

      const fileId = await FileService.uploadFile(userId, files);
      console.log("fileId", fileId);

      return res.status(201).json(fileId);
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // get all artist
  static async getAllArtist(req: Request, res: Response) {
    try {
      console.log("get all artist");
      const artists = await FileService.getAllArtist();

      if (!artists || artists.length === 0) {
        return res.status(404).json({ error: "Artists not found" });
      }

      return res.status(200).json(artists);
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // get a single file
  static async getFile(req: Request, res: Response) {
    try {
      const fileId = req.params.id;
      const file = await FileService.getFile(fileId);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      return res.status(200).json(file);
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // get all files related to a user
  static async getFiles(req: Request, res: Response) {
    try {
      const userId = req.userId as string;
      const files = await FileService.getFiles(userId);

      if (!files || files.length === 0) {
        return res.status(404).json({ error: "Files not found" });
      }

      const info = files.map((file) => ({
        id: file.id,
        filename: file.filename,
        artistName: file.artist.artistName,
      }));

      return res.status(200).json(info);
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // update a file
  static async updateFile(req: Request, res: Response) {
    try {
      if (!req.files) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileId = req.params.id;

      const file = req.files as { [fieldname: string]: Express.Multer.File[] };

      const updatedFile = await FileService.updateFile(fileId, file);

      return res.status(200).json(updatedFile);
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // delete a file
  static async deleteFile(req: Request, res: Response) {
    try {
      const fileId = req.params.id;
      await FileService.deleteFile(fileId);

      return res.status(204).json({ message: "File deleted successfully" });
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default FileController;
