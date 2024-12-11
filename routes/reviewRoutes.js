import express from "express";
import {
  getReviews,
  getReview,
  addReview,
  deleteReviewById,
  updateReviewById,
} from "../controllers/reviewController.js";
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

// reviewRouter.post("/", authorize('admin','user'), protect, addReview);
reviewRouter.post("/", protect, authorize("admin", "user"), addReview);

reviewRouter.delete(
  "/:id",
  protect,
  authorize("admin", "user"),
  deleteReviewById
);

reviewRouter.put("/:id", protect, authorize("admin", "user"), updateReviewById);

export default reviewRouter;
