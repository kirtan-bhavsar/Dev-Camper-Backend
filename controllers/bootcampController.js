// Model Imports
import Bootcamp from "../models/Bootcamp.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHander from "express-async-handler";
import geocoder from "../utils/getcoder.js";

// @desc get All Bootcamps
// @route GET /api/v1/bootcamps
// @access public
const getAllBootcamps = asyncHander(async (req, res, next) => {
  let query;

  let queryStr = JSON.stringify(req.query);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  console.log(JSON.parse(queryStr));

  query = Bootcamp.find(JSON.parse(queryStr));

  // const query = req.query;

  // console.log(query);

  // const bootcamps = await Bootcamp.find(query);
  //the above is mainly used to get the Bootcamps defined with specific query

  const bootcamps = await query;

  if (!bootcamps) {
    return res
      .status(400)
      .json({ success: false, message: "No Bootcmaps exists" });
  }
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
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

// @desc create bootcamps
// @route POST /api/v1/bootcamps
// @access public
const createBootcamp = asyncHander(async (req, res, next) => {
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
  const bootcamp = req.body;

  const bootcampId = req.params.id;

  const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
    bootcampId,
    bootcamp,
    {
      new: true,
    }
  );

  if (!updatedBootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found for the provided id : ${bootcampId}`,
        404
      )
    );
  }
  res.status(200).json(updatedBootcamp);
});

// @desc delete bootcamp by id
// @route DELETE /api/v1/bootcamps/:id
// @access public
const deleteBootcampById = asyncHander(async (req, res, next) => {
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

  await Bootcamp.findByIdAndDelete(bootcampId);

  res
    .status(200)
    .json({ success: true, message: "Bootcamp deleted successfully" });
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
};
