import mongoose, { get } from "mongoose";
import {
  getCourseById,
  getCourses,
  createCourse,
  updateCourseById,
  deleteCourseById,
} from "../controllers/courseController.js";
import express from "express";
import advancedResults from "../middleware/advancedResults.js";
import Course from "../models/Course.js";
import { protect, authorize } from "../middleware/auth.js";

// here we add the mergeParams:true to enable cross API functionality
const courseRouter = express.Router({ mergeParams: true });

courseRouter.get(
  "/",
  advancedResults(Course, {
    path: "bootcamp",
    select: "name description",
  }),
  getCourses
);
courseRouter.get("/:id", getCourseById);
courseRouter.post("/", protect, authorize("admin", "publisher"), createCourse);
courseRouter.put(
  "/:id",
  protect,
  authorize("admin", "publisher"),
  updateCourseById
);
courseRouter.delete(
  "/:id",
  protect,
  authorize("admin", "publisher"),
  deleteCourseById
);

export { courseRouter as default };
