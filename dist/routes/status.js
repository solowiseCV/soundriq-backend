"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { getStatus } = require("../controllers/statusController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/status", auth_1.authenticate, getStatus);
exports.default = router;
