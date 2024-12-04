import Course from "../models/Course.js";
import asyncHandler from "express-async-handler";
import Bootcamp from "../models/Bootcamp.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc get all course or get courses of specific bootcamp
// @api GET api/v1/courses or GET api/v1/bootcamps/:bootcampId/courses
// @access public
const getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
  // const courses = await query;
  // as we are using const result = await query in advancedResults middleware
});

// @desc get course by specific Id
// @api GET api/v1/courses/:id
// @access public
const getCourseById = asyncHandler(async (req, res, next) => {
  const courseId = req.params.id;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(
      new ErrorResponse(`No course found for the id : ${courseId}`, 404)
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

  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found for id : ${req.params.bootcampId}`,
        404
      )
    );
  }

  if (req.user.id !== bootcamp.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        "User is not owner of the bootcamp, hence cannot create a course for this bootcamp.",
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc update course
// @api GET api/v1/courses/:id
// @access private
const updateCourseById = asyncHandler(async (req, res, next) => {
  const courseId = req.params.id;

  let course = await Course.findById(courseId);

  if (req.user.id !== course.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        "User is not owner of the bootcamp, hence cannot create a course for this bootcamp.",
        401
      )
    );
  }

  if (!course) {
    return next(
      new ErrorResponse(`No course found for the id : ${courseId}`, 404)
    );
  }

  course = await Course.findByIdAndUpdate(courseId, req.body, {
    new: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc delete course
// @api DELETE api/v1/courses/:id
// @access private
const deleteCourseById = asyncHandler(async (req, res, next) => {
  const courseId = req.params.id;

  let course = await Course.findById(courseId);

  if (req.user.id !== course.user.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        "User is not owner of the bootcamp, hence cannot create a course for this bootcamp.",
        401
      )
    );
  }

  if (!course) {
    return next(
      new ErrorResponse(`No course found for the id : ${courseId}`, 404)
    );
  }

  course = await Course.findByIdAndDelete(courseId);

  res.status(200).json({
    success: true,
    data: {},
  });
});

export {
  getCourses,
  getCourseById,
  createCourse,
  updateCourseById,
  deleteCourseById,
};
