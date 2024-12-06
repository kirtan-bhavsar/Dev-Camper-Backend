import {
  forgotPassword,
  getMe,
  loginUser,
  registerUser,
  resetNewPassword,
} from "../controllers/authController.js";
import mongoose from "mongoose";
import express from "express";
import { protect } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", protect, getMe);
authRouter.post("/forgotpassword", forgotPassword);
authRouter.put("/resetpassword/:resetToken", resetNewPassword);

export default authRouter;
