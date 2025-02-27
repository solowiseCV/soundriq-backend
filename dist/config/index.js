"use strict";
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const dbUri = process.env.DB_URI;
const jwtSecret = process.env.JWT_SECRET;
const fileUploadPath = process.env.FILE_UPLOAD_PATH || "uploads/";
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASS = process.env.EMAIL_PASS;
const FRONTEND_URL = process.env.FRONTEND_URL;
const HOST = process.env.HOST || "localhost";
module.exports = {
    PORT,
    HOST,
    dbUri,
    jwtSecret,
    fileUploadPath,
    EMAIL_ADDRESS,
    EMAIL_PASS,
    FRONTEND_URL,
};
