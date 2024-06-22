import { Request, Response } from "express";
import FileService from "../services/fileService";

class FileController {
  static async uploadFile(req: Request, res: Response) {
    // console.log("req body", req.body);
    // console.log("req file", req.file);
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { filename, path } = req.file;
     
      const fileId = await FileService.uploadFile(filename, path);

      return res.status(201).json({ fileId });
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default FileController;
