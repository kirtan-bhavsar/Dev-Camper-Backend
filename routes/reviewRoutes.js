import express from "express";
import { getReviews, getReview } from "../controllers/reviewController.js";
import { authorize, protect } from "../middleware/auth.js";
import getAdvancedResults from "../middleware/advancedResults.js";
import advancedResults from "../middleware/advancedResults.js";
import Review from "../models/Review.js";

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.get(
  "/",
  advancedResults(Review, {
    path: "bootcamp",
    select: "name description",
  }),
  getReviews
);

reviewRouter.get("/:id", getReview);

export default reviewRouter;
