import {
  getMe,
  loginUser,
  registerUser,
} from "../controllers/authController.js";
import mongoose from "mongoose";
import express from "express";
import { protect } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", protect, getMe);

export default authRouter;
