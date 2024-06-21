import { Request, Response } from "express";

const getStatus = (req: Request, res: Response) => {
  res.json({ message: "It's working ..." });
};

module.exports = { getStatus };
