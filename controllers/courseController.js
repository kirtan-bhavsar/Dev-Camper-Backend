import expressAsyncHandler from "express-async-handler";
import Course from "../models/Course.js";
import asyncHandler from "express-async-handler";
import Bootcamp from "../models/Bootcamp.js";

// @desc get all course or get courses of specific boocamp
// @api GET api/v1/courses or GET api/v1/bootcamps/:bootcampId/courses
// @access public
const getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc get course by specific Id
// @api GET api/v1/courses/:id
// @access public
const getCourseById = asyncHandler(async (req, res, next) => {
  const courseId = req.params.id;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(
      new ErrorResponsez(`No course found for the id : ${courseId}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc create course for specific bootcamp
// @api GET api/v1/bootcamps/:id/courses
// @access private
const createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found for id : ${req.params.bootcampId}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

export { getCourses, getCourseById, createCourse };
