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

reviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: {
          $avg: "$rating",
        },
      },
    },
  ]);

  try {
    await Bootcamp.findByIdAndUpdate(
      bootcampId,
      {
        averageRating: obj[0].averageRating,
      },
      {
        new: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.getAverageRating(this.bootcamp);
  console.log("save review getAverageRating middleware called");
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await this.model.getAverageRating(doc.bootcamp);
    console.log("delete review getAverageRating middleware called");
  }
});

export default mongoose.model("Review", reviewSchema);

// -----demo----

// reviewSchema.statics.getAverageRating = async function (bootcampId) {
//   const obj = await this.aggregate([
//     {
//       $match: {
//         bootcamp: bootcampId,
//       },
//     },
//     {
//       $group: {
//         _id: "$bootcamp",
//         averageRating: { $avg: "$rating" },
//       },
//     },
//   ]);

//   try {
//     await Bootcamp.findByIdAndUpdate(bootcampId, {
//       averageRating: obj[0].averageRating,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// reviewSchema.pre("save", async function () {
//   await this.constructor.getAverageRating(this.bootcamp);
// });

// reviewSchema.post("findOneAndDelete", async function () {
//   await this.model.getAverageRating(this.bootcamp);
// });
