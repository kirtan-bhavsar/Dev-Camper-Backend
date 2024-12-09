import Bootcamp from "./models/Bootcamp.js";
import Course from "./models/Course.js";
import User from "./models/User.js";
import Review from "./models/Review.js";
import mongoose from "mongoose";
import colors from "colors";
import fs from "fs";
import url from "url";
import path from "path";

// making the __dirname and __filename
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Loading the environment variables
import dotenv from "dotenv";
dotenv.config();
const mongoUri = process.env.MONGO_URI;

// Connecting to DB
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log(
      `Server connected successfully for ${mongoose.connection.host} with ${mongoose.connection.name}`
    );
  })
  .catch((err) => {
    console.log(err);
  });

//   Reading the JSON file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

// Performing import data
const importData = async () => {
  try {
    // await Bootcamp.create(bootcamps);

    // bootcamps.forEach(async (singleBootcamp) => {
    //   const bootcamp = new Bootcamp(singleBootcamp);
    //   console.log(bootcamp, "bootcamp printed");
    //   await bootcamp.save();
    // });

    for (const singleBootcamp of bootcamps) {
      const bootcamp = new Bootcamp(singleBootcamp);
      console.log(bootcamp, "bootcamp printed");
      await bootcamp.save();
    }

    for (const singleCourse of courses) {
      const course = new Course(singleCourse);
      await course.save();
    }

    for (const singleUser of users) {
      const user = new User(singleUser);
      await user.save();
    }

    for (const singleReview of reviews) {
      const review = await Review.create(singleReview);
      review.save();
    }

    // const bootcamp = new Bootcamp(bootcamps);

    // await bootcamp.save();

    console.log("Data imported...".green.inverse);
  } catch (error) {
    console.log(error);
  }
};

// Performing data destroy
const destroyData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data destroyed...".red.inverse);
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
