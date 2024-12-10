import mongoose from "mongoose";
import Bootcamp from "./Bootcamp.js";
import colors from "colors";

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

courseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: {
        bootcamp: bootcampId,
      },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  try {
    await Bootcamp.findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.log(error);
  }
};

courseSchema.post("save", async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

courseSchema.pre("findOneAndDelete", async function () {
  await this.model.getAverageCost(this.bootcamp);
});

export default mongoose.model("Course", courseSchema);
