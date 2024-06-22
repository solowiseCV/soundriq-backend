import prisma from "../config/database";
// import mime from "mime-types";

class FileService {
  static async uploadFile(filename: string, path: string) {
    try {
      // const mimeType = mime.lookup(filename);
      let file;

      // if (!mimeType) {
      //   throw new Error("Unable to determine file type");
      // }

      file = await prisma.file.create({
        data: {
          filename: filename,
          path,
          // type: mimeType,
        },
      });

      return file;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to upload file");
    }
  }
}

export default FileService;
