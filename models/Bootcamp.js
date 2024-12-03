import mongoose from "mongoose";
import slugify from "slugify";
import geocoder from "../utils/getcoder.js";
import Course from "../models/Course.js";

const bootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description can not be more than 500 characters"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        index: "2dsphere",
        default: [0, 0],
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be atleast 1"],
      max: [10, "Rating can be maximum 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

// A document middleware to make a slug based on the name of the bootcamp
bootcampSchema.pre("save", function (next) {
  console.log(this.model, "this being printed");
  this.slug = slugify(this.name);
  next();
});

// Cascade delete i.e automatically delete all courses associated with a bootcamp when it is deleted.
bootcampSchema.pre("findOneAndDelete", async function (next) {
  const bootcampId = this.getQuery()._id;
  console.log(`All courses deleted associated with id : ${bootcampId}`);
  // await this.model("Course").deleteMany({ bootcamp: bootcampId });
  await Course.deleteMany({ bootcamp: bootcampId });
  next();
});

// A geocoder middleware to convert a given address to geocode
bootcampSchema.pre("save", async function (next) {
  console.log("waiting".red.inverse);
  const loc = await geocoder.geocode(this.address);
  console.log("waiting very long".red.inverse);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].state,
    zipcode: loc[0].zipcode,
    country: loc[0].country,
  };
  console.log(this.address);
  console.log("geocoder middleware running");
  console.log(loc);
  next();
});

// bootcampSchema.index({ location: "2dsphere" });

export default mongoose.model("Bootcamp", bootcampSchema);
