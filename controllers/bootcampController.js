// Model Imports
import Bootcamp from "../models/Bootcamp.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHander from "express-async-handler";
import geocoder from "../utils/getcoder.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// @desc get All Bootcamps
// @route GET /api/v1/bootcamps
// @access public
const getAllBootcamps = asyncHander(async (req, res, next) => {
  console.log(res.advancedResults, "Response form middleware");
  res.status(200).json(res.advancedResults);
});

// @desc get bootcamp by Id
// @route GET /api/v1/bootcamps/:id
// @access public
const getBootcampById = asyncHander(async (req, res, next) => {
  const bootcampId = req.params.id;
  if (!bootcampId) {
    return res.status(400).json({
      success: false,
      message: `Please find a valid Id to find the necessary bootcamp`,
    });
  }
  const bootcamp = await Bootcamp.findById(bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found for the provided id : ${bootcampId}`,
        404
      )
    );
  }
  res.status(200).json(bootcamp);
});

// @desc create bootcamp
// @route POST /api/v1/bootcamps
// @access public
const createBootcamp = asyncHander(async (req, res, next) => {
  req.body.user = req.user.id;

  console.log(req.user);

  const isBootcampPublished = await Bootcamp.findOne({ user: req.user.id });

  if (isBootcampPublished && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with role ${req.user.role} can only publish one bootcamp`
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc update bootcamp by id
// @route PUT /api/v1/bootcamps/:id
// @access public
const updateBootcampById = asyncHander(async (req, res, next) => {
  const bootcampBody = req.body;

  const bootcampId = req.params.id;

  let bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found for the provided id : ${bootcampId}`,
        404
      )
    );
  }

  if (req.user.id !== bootcamp.user.toString() && req.user.role !== "admin") {
    console.log(req.user.id, bootcamp.user.toString());
    return next(new ErrorResponse("User is not owner of the bootcamp"));
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(bootcampId, bootcamp, {
    new: true,
  });

  res.status(200).json(bootcamp);
});

// @desc delete bootcamp by id
// @route DELETE /api/v1/bootcamps/:id
// @access public
const deleteBootcampById = asyncHander(async (req, res, next) => {
  const bootcampId = req.params.id;

  let bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found for the provided id : ${bootcampId}`,
        404
      )
    );
  }

  if (req.user.id !== bootcamp.user.toString()) {
    console.log(req.user.id, bootcamp.user.toString());
    return next(
      new ErrorResponse("User is not owner of the bootcamp, yeah that's true")
    );
  }

  bootcamp = await Bootcamp.findByIdAndDelete(bootcampId);

  // await bootcamp.deleteOne();

  res
    .status(200)
    .json({ success: true, message: "Bootcamp deleted successfully" });
});

// @desc upload photo for bootcamp
// @route DELETE /api/v1/bootcamps/:id/photo
// @access private
const uploadPhotoForBootcamp = asyncHander(async (req, res, next) => {
  const bootcampId = req.params.id;

  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found for the provided id : ${bootcampId}`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("No file found for the request", 400));
  }

  const file = req.files.file;

  console.log(file, "file printed", process.env.MAX_FILE_UPLOAD_SIZE);

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please provide an image", 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD_SIZE) {
    return next(
      new ErrorResponse(
        `Please upload file less than ${process.env.MAX_FILE_UPLOAD_SIZE}`
      ),
      400
    );
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  console.log(file.name, "file name");

  // Uploading the file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse("Problem uploading the file", 500));
    }

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

// @desc get bootcamps within a specific range
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access public

const getBootcampsByDistance = asyncHander(async (req, res, next) => {
  // const { zipcode, distance } = req.params;
  const { zipcode, distance } = req.params;
  const { address } = req.body;

  // Getting geolocation of provided zipcode using geocoder utility
  const loc = await geocoder.geocode(address);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  console.log(zipcode, lng, lat);

  const bootcamps = await Bootcamp.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: distance,
      },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

export {
  getAllBootcamps,
  getBootcampById,
  updateBootcampById,
  deleteBootcampById,
  createBootcamp,
  getBootcampsByDistance,
  uploadPhotoForBootcamp,
};
