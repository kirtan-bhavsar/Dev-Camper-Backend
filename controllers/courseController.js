import expressAsyncHandler from "express-async-handler";
import Course from "../models/Course.js";
import asyncHandler from "express-async-handler";

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

// @desc get all course or get courses of specific boocamp
// @api GET api/v1/courses or GET api/v1/bootcamps/:bootcampId/courses
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

export { getCourses, getCourseById };
