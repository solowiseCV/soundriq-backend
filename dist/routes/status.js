"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { getStatus } = require("../controllers/statusController");
const router = (0, express_1.Router)();
router.get("/status", getStatus);
exports.default = router;
