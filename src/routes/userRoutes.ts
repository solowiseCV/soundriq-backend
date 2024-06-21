import { Router } from "express";
import UserController from "../controllers/userController";

const router = Router();

router.post("/register", UserController.registerUser);
router.get("/find/:email", UserController.getUser);
router.get("/", UserController.getAllUsers);

export default router;
