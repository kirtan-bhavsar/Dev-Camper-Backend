import {
  getAllBootcamps,
  updateBootcampById,
  deleteBootcampById,
  createBootcamp,
  getBootcampById,
} from "../controllers/bootcampController.js";

import express from "express";

const bootcampRouter = express.Router();

bootcampRouter.get("/", getAllBootcamps);
bootcampRouter.get("/:id", getBootcampById);
bootcampRouter.post("/", createBootcamp);
bootcampRouter.put("/", updateBootcampById);
bootcampRouter.delete("/", deleteBootcampById);

export { bootcampRouter };
