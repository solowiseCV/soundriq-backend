require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  dbUri: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET,
  fileUploadPath: process.env.FILE_UPLOAD_PATH || "uploads/",
};
