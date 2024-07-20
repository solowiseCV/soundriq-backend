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

type FileType = "image" | "audio";

interface File {
  path: string;
  folder: string;
  type: FileType;
}

const uploadFilesToCloudinary = async (
  files: { path: string; folder: string, type: string }[]
) => {
  try {
   
    // check file type from path
    // const uploadPromises = files.map((file) => {
    //   if (file.path.endsWith(".mp3") || file.path.endsWith(".wav") || file.path.endsWith(".m4a")) {
    //     return uploadAudioToCloudinary(file.path, file.folder);
    //   } else {
    //     return uploadImageToCloudinary(file.path, file.folder);
    //   }
    // }
    // );

    const uploadPromises = files.map((file) => {
      if (file.type.startsWith("audio")) {
        return uploadAudioToCloudinary(file.path, file.folder);
      } else {
        return uploadImageToCloudinary(file.path, file.folder);
      }
    }
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to upload files");
  }
};

const uploadImageToCloudinary = async (path: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      folder: folder,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload image: ${error}`);
    throw error;
  }
};

const uploadAudioToCloudinary = async (path: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      folder: folder,
      resource_type: "video",
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload audio: ${error}`);
    throw error;
  }
};

export { uploadFilesToCloudinary };
