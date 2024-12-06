import express from "express";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  demoUserAPI,
} from "../controllers/userController.js";

import { authorize, protect } from "../middleware/auth.js";

import getAdvancedResults from "../middleware/advancedResults.js";
import User from "../models/User.js";

const userRouter = express.Router({ mergeParams: true });

userRouter.use(protect);
userRouter.use(authorize("admin"));

userRouter.get("/", getAdvancedResults(User), getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
userRouter.put("/:id", updateUserById);
userRouter.delete("/:id", deleteUserById);
userRouter.get("/demo/1", demoUserAPI);
export default userRouter;
