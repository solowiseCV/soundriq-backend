"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const artistController_1 = __importDefault(require("../controllers/artistController"));
const file_upload_1 = __importDefault(require("../middlewares/artist/file_upload"));
const authenticate_1 = require("../middlewares/authenticate");
const router = (0, express_1.Router)();
router.post("/register", artistController_1.default.register);
router.post("/complete-profile/", authenticate_1.authenticate, file_upload_1.default, artistController_1.default.completeProfile);
exports.default = router;
