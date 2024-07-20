"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFilesToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const cloudinary_2 = require("../config/cloudinary");
const cloudinary_3 = require("../config/cloudinary");
const cloudinary_4 = require("../config/cloudinary");
cloudinary_1.v2.config({
    cloud_name: cloudinary_2.CLOUDINARY_CLOUD_NAME,
    api_key: cloudinary_3.CLOUDINARY_API_KEY,
    api_secret: cloudinary_4.CLOUDINARY_API_SECRET,
    secure: true,
});
const uploadFilesToCloudinary = async (files) => {
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
            }
            else {
                return uploadImageToCloudinary(file.path, file.folder);
            }
        });
        const results = await Promise.all(uploadPromises);
        return results;
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to upload files");
    }
};
exports.uploadFilesToCloudinary = uploadFilesToCloudinary;
const uploadImageToCloudinary = async (path, folder) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(path, {
            folder: folder,
            resource_type: "image",
        });
        return result.secure_url;
    }
    catch (error) {
        console.error(`Failed to upload image: ${error}`);
        throw error;
    }
};
const uploadAudioToCloudinary = async (path, folder) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(path, {
            folder: folder,
            resource_type: "video",
        });
        return result.secure_url;
    }
    catch (error) {
        console.error(`Failed to upload audio: ${error}`);
        throw error;
    }
};
