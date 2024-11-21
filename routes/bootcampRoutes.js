import {
  getAllBootcamps,
  updateBootcampById,
  deleteBootcampById,
  createBootcamp,
  getBootcampById,
  getBootcampsByDistance,
} from "../controllers/bootcampController.js";

import express from "express";

const bootcampRouter = express.Router();

// bootcampRouter.get("/", getAllBootcamps);
// bootcampRouter.get("/:id", getBootcampById);
// bootcampRouter.post("/", createBootcamp);
// bootcampRouter.put("/:id", updateBootcampById);
// bootcampRouter.delete("/:id", deleteBootcampById);

bootcampRouter.get("/radius/:zipcode/:distance", getBootcampsByDistance);
bootcampRouter.route("/").get(getAllBootcamps).post(createBootcamp);
bootcampRouter
  .route("/:id")
  .get(getBootcampById)
  .put(updateBootcampById)
  .delete(deleteBootcampById);

export { bootcampRouter as default };
