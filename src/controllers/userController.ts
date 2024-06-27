import { Request, Response } from "express";
import UserService from "../services/userService";

class UserController {
  static async registerUser(req: Request, res: Response) {
    try {

      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // check email format
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      // check password length
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const user = await UserService.registerUser(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token, userInfo} = await UserService.loginUser(email, password);
      res.json({ token, userInfo });
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
