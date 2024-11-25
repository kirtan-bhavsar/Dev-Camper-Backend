import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a name for the bootcamp"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description for the course"],
  },
  weeks: {
    type: String,
    required: true,
  },
  tuition: {
    type: Number,
    required: true,
  },
  minimumSkill: {
    type: String,
    required: true,
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Course", courseSchema);
