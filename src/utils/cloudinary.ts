import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CLOUD_NAME } from "../config/cloudinary";
import { CLOUDINARY_API_KEY } from "../config/cloudinary";
import { CLOUDINARY_API_SECRET } from "../config/cloudinary";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadToCloudinary = async (
  filename: string,
  folder: string
): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(filename, {
      tags: "basic_sample",
      folder: folder,
    });

    return result.secure_url;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to upload file");
  }
};

const uploadFilesToCloudinary = async (
  files: { path: string; folder: string }[]
) => {
  try {
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file.path, file.folder)
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to upload files");
  }
};

export { uploadFilesToCloudinary };
