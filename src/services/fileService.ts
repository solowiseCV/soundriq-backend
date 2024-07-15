import prisma from "../config/database";
import mime from "mime-types";

class FileService {
  static async uploadFile(artistProfileId: string, files: any) {
    try {
      // Determine the file type
      const mimeType = files.map((file: any) => mime.lookup(file.filename));

      if (!mimeType) {
        throw new Error("Unable to determine file type");
      }

      // Using $transaction to handle multiple file creation
      const createdFiles = await prisma.$transaction(
        files.map((file: any) =>
          prisma.file.create({
            data: {
              filename: file.filename,
              path: file.path,
              artistId: artistProfileId,
            },
            include: { artist: true },
          })
        )
      );
      return createdFiles;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Failed to upload file");
    }
  }

  static async getFile(fileId: string) {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: { artist: true },
    });
    return file;
  }

  static async getFiles(artistId: string) {
    const files = await prisma.file.findMany({
      where: { artistId },
      include: { artist: true },
    });
    return files;
  }

  static async updateFile(fileId: string, files: any) {
    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: {
        filename: files[0].filename,
        path: files[0].path,
      },
    });
    return updatedFile;
  }

  static async deleteFile(fileId: string) {
    const file = await prisma.file.delete({
      where: { id: fileId },
    });
    return file;
  }
}

export default FileService;
