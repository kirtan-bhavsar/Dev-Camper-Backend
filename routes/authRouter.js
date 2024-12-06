import {
  forgotPassword,
  getMe,
  loginUser,
  registerUser,
  resetPassword,
  updateUserDetails,
  updateUserPassword,
} from "../controllers/authController.js";
import mongoose from "mongoose";
import express from "express";
import { protect } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", protect, getMe);
authRouter.post("/forgotpassword", forgotPassword);
authRouter.put("/resetpassword/:resetToken", resetPassword);
authRouter.put("/updatedetails", protect, updateUserDetails);
authRouter.put("/updatepassword", protect, updateUserPassword);

export default authRouter;
