import getAllDemos from "../controllers/demoController.js";
import express from "express";

const demoRouter = express.Router();

demoRouter.get("/", getAllDemos);

export default demoRouter;
