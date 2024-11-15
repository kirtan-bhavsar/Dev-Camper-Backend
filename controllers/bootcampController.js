// Model Imports
import Bootcamp from "../models/Bootcamp.js";

// @desc get All Bootcamps
// @route GET /api/v1/bootcamps
// @access public
const getAllBootcamps = (req, res) => {
  res.status(200).json({ success: true, message: "Display all bootcamps" });
};

// @desc get bootcamp by Id
// @route GET /api/v1/bootcamps/:id
// @access public
const getBootcampById = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Display bootcamp ${req.params.id}` });
};

// @desc create bootcamps
// @route POST /api/v1/bootcamps
// @access public
const createBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({ message: "Bad Request" });
  }
  //   res
  //   .status(200)
  //   .json({ success: true, message: "Bootcamp created successfully" });
};

// @desc update bootcamp by id
// @route PUT /api/v1/bootcamps/:id
// @access public
const updateBootcampById = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Bootcamp updated for ${req.params.id}` });
};

// @desc delete bootcamp by id
// @route DELETE /api/v1/bootcamps/:id
// @access public
const deleteBootcampById = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Bootcamp deleted for ${req.params.id}` });
};

export {
  getAllBootcamps,
  getBootcampById,
  updateBootcampById,
  deleteBootcampById,
  createBootcamp,
};
