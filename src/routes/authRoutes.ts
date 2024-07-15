import { Router } from "express";
import UserController from "../controllers/authController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.put("/update",authenticate, UserController.updateUser);
router.post("/logout", UserController.logout);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);
router.get("/find/:email", UserController.getUser);
router.get("/", UserController.getAllUsers);

export default router;
