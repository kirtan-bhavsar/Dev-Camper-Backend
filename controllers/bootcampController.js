// Model Imports
import Bootcamp from "../models/Bootcamp.js";

// @desc get All Bootcamps
// @route GET /api/v1/bootcamps
// @access public
const getAllBootcamps = async (req, res) => {
  // res.status(200).json({ success: true, message: "Display all bootcamps" });

  const bootcamps = await Bootcamp.find();

  // console.log(bootcamps);

  // res.json(200).json({ message: "getAllBootcamps being called" });

  res.json(200).json({ bootcamps });
};

// @desc get bootcamp by Id
// @route GET /api/v1/bootcamps/:id
// @access public
const getBootcampById = async (req, res) => {
  // res
  //   .status(200)
  //   .json({ success: true, message: `Display bootcamp ${req.params.id}` });
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
      return res.status(400).json({
        success: "false",
        message: "No bootcamp found for the provided Id",
      });
    }
    res.status(200).json(bootcamp);
  } catch (error) {
    console.log(error);
  }
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
