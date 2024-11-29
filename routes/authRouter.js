import { registerUser } from "../controllers/authController.js";
import mongoose from "mongoose";
import express from "express";

const authRouter = express.Router();

authRouter.post("/register", registerUser);

export default authRouter;
