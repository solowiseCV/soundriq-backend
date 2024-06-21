import { Router } from "express";
const { getStatus } = require("../controllers/statusController");

const router = Router();

router.get("/status", getStatus);

export default router;
