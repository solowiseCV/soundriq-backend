import { Request, Response } from "express";
import UserService from "../services/userService";

class UserController {
  static async registerUser(req: Request, res: Response) {
    try {
      const user = await UserService.registerUser(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const user = await UserService.getUser(req.params.email);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;
