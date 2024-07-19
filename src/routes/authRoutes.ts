import { Router } from "express";
import UserController from "../controllers/authController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.post("/logout", authenticate, UserController.logout);
router.post("/forgot-password", authenticate, UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);

export default router;
