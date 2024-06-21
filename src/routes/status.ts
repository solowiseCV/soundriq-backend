import { Router } from "express";
const { getStatus } = require("../controllers/statusController");

const router = Router();

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

export default router;
