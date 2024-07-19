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
const uploadToCloudinary = async (filename, folder) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(filename, {
            tags: "basic_sample",
            folder: folder,
        });
        return result.secure_url;
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to upload file");
    }
};
const uploadFilesToCloudinary = async (files) => {
    try {
        const uploadPromises = files.map((file) => uploadToCloudinary(file.path, file.folder));
        const results = await Promise.all(uploadPromises);
        return results;
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to upload files");
    }
};
exports.uploadFilesToCloudinary = uploadFilesToCloudinary;
