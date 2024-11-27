import mongoose, { get } from "mongoose";
import {
  getCourseById,
  getCourses,
  createCourse,
  updateCourseById,
} from "../controllers/courseController.js";
import express from "express";

// here we add the mergeParams:true to enable cross API functionality
const courseRouter = express.Router({ mergeParams: true });

courseRouter.get("/", getCourses);
courseRouter.get("/:id", getCourseById);
courseRouter.post("/", createCourse);
courseRouter.put("/:id", updateCourseById);

export { courseRouter as default };
