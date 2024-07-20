import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.get("/status", (req: Request, res: Response) => {
  res.json({ status: "🚀 Up and running..." });
});

export default router;
