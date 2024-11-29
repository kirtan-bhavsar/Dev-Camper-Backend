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
courseRouter.post("/", createCourse);
courseRouter.put("/:id", updateCourseById);
courseRouter.delete("/:id", deleteCourseById);

export { courseRouter as default };
