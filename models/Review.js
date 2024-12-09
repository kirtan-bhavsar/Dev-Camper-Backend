import mongoose from "mongoose";
import Bootcamp from "./Bootcamp.js";
import colors from "colors";

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title for the review"],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: [true, "Please add a description for the review"],
  },
  rating: {
    type: Number,
    required: [true, "Please add a rating from 1 to 10"],
    min: 1,
    max: 10,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
