import mongoose, { get } from "mongoose";
import { getCourses } from "../controllers/courseController.js";
import express from "express";

// here we add the mergeParams:true to enable cross API functionality
const courseRouter = express.Router({ mergeParams: true });

courseRouter.get("/", getCourses);

export { courseRouter as default };
