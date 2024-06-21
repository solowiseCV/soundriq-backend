"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { getStatus } = require("../controllers/statusController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Status
 *   description: API status
 */
/**
 * @swagger
 * /status:
 *   get:
 *     summary: Check API status
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: API is working
 */
router.get("/status", getStatus);
exports.default = router;
