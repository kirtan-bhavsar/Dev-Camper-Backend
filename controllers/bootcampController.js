// Model Imports
import Bootcamp from "../models/Bootcamp.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc get All Bootcamps
// @route GET /api/v1/bootcamps
// @access public
const getAllBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    if (!bootcamps) {
      return res
        .status(400)
        .json({ success: false, message: "No Bootcmaps exists" });
    }
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    next(error);
  }
};

// @desc get bootcamp by Id
// @route GET /api/v1/bootcamps/:id
// @access public
const getBootcampById = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// @desc create bootcamps
// @route POST /api/v1/bootcamps
// @access public
const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc update bootcamp by id
// @route PUT /api/v1/bootcamps/:id
// @access public
const updateBootcampById = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// @desc delete bootcamp by id
// @route DELETE /api/v1/bootcamps/:id
// @access public
const deleteBootcampById = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export {
  getAllBootcamps,
  getBootcampById,
  updateBootcampById,
  deleteBootcampById,
  createBootcamp,
};
