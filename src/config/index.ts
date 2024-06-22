require("dotenv").config();

const port = process.env.PORT || 3000;
const dbUri = process.env.DB_URI;
const jwtSecret = process.env.JWT_SECRET as string;
const fileUploadPath = process.env.FILE_UPLOAD_PATH || "uploads/";

module.exports = {
  port,
  dbUri,
  jwtSecret,
  fileUploadPath,
};
