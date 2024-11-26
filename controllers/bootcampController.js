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

  const reqQuery = { ...req.query };

  // console.log(reqQuery);

  // fields not to be included in reqQuery
  const excludeFields = ["select", "sort", "page", "limit"];

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  // reqQuery = reqQuery.forEach((param) => delete reqQuery[param]);
  excludeFields.forEach((param) => delete reqQuery[param]);

  console.log(reqQuery);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

  query = query.skip(startIndex).limit(limit);

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // if (page < total / limit) {
  //   pagination.next = {
  //     page: page + 1,
  //     limit,
  //   };
  // }

  // if (page > 1) {
  //   pagination.prev = {
  //     page: page - 1,
  //     limit,
  //   };
  // }

  // to implement if select is used in query string, to select specific fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // to implement sort, if sort is used in query string, to sort the elements
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

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
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
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

  const bootcamp = await Bootcamp.findByIdAndDelete(bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found for the provided id : ${bootcampId}`,
        404
      )
    );
  }

  // await bootcamp.deleteOne();

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
