import {
  getAllBootcamps,
  updateBootcampById,
  deleteBootcampById,
  createBootcamp,
  getBootcampById,
  getBootcampsByDistance,
  uploadPhotoForBootcamp,
} from "../controllers/bootcampController.js";

import courseRouter from "./courseRoutes.js";

import express from "express";

import advancedResults from "../middleware/advancedResults.js";

import Bootcamp from "../models/Bootcamp.js";

import { protect } from "../middleware/auth.js";

const bootcampRouter = express.Router();

// bootcampRouter.get("/", getAllBootcamps);
// bootcampRouter.get("/:id", getBootcampById);
// bootcampRouter.post("/", createBootcamp);
// bootcampRouter.put("/:id", updateBootcampById);
// bootcampRouter.delete("/:id", deleteBootcampById);

bootcampRouter.use("/:bootcampId/courses", courseRouter);
bootcampRouter.get("/radius/:zipcode/:distance", getBootcampsByDistance);
bootcampRouter
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getAllBootcamps)
  .post(protect, createBootcamp);
bootcampRouter
  .route("/:id")
  .get(getBootcampById)
  .put(protect, updateBootcampById)
  .delete(protect, deleteBootcampById);
bootcampRouter.put("/:id/photo", protect, uploadPhotoForBootcamp);

export { bootcampRouter as default };
