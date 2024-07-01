import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
require("dotenv").config();

const secret = process.env.JWT_SECRET as string;

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing!" });
  }

  try {
    const decoded = verifyToken(token);
    req.artistId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is invalid or expired" });
  }
};

// Extend the Express Request type to include artistId
declare global {
  namespace Express {
    interface Request {
      artistId?: number;
    }
  }
}
