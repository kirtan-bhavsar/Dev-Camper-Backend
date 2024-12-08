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
import reviewRouter from "../routes/reviewRoutes.js";

import express from "express";

import advancedResults from "../middleware/advancedResults.js";

import Bootcamp from "../models/Bootcamp.js";

import { protect, authorize } from "../middleware/auth.js";

const bootcampRouter = express.Router();

// bootcampRouter.get("/", getAllBootcamps);
// bootcampRouter.get("/:id", getBootcampById);
// bootcampRouter.post("/", createBootcamp);
// bootcampRouter.put("/:id", updateBootcampById);
// bootcampRouter.delete("/:id", deleteBootcampById);

// for cross model querying like, getting courses/reviews of a specific bootcamp
bootcampRouter.use("/:bootcampId/courses", courseRouter);
bootcampRouter.use("/:bootcampId/reviews", reviewRouter);

bootcampRouter.get("/radius/:zipcode/:distance", getBootcampsByDistance);
bootcampRouter
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getAllBootcamps)
  .post(protect, authorize("admin", "publisher"), createBootcamp);
bootcampRouter
  .route("/:id")
  .get(getBootcampById)
  .put(protect, authorize("admin", "publisher"), updateBootcampById)
  .delete(protect, authorize("admin", "publisher"), deleteBootcampById);
bootcampRouter.put(
  "/:id/photo",
  protect,
  authorize("admin", "publisher"),
  uploadPhotoForBootcamp
);

export { bootcampRouter as default };
