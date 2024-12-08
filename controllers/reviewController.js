import Course from "../models/Course.js";
import asyncHandler from "express-async-handler";
import Bootcamp from "../models/Bootcamp.js";
import ErrorResponse from "../utils/errorResponse.js";
import Review from "../models/Review.js";

// @desc get all course or get courses of specific bootcamp
// @api GET api/v1/courses or GET api/v1/bootcamps/:bootcampId/courses
// @access public
const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
  // const courses = await query;
  // as we are using const result = await query in advancedResults middleware
});

const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found for the id : ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc create a review for a bootcamp
// @api POST api/v1/bootcamps/:bootcampId/reviews
// access private
const addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  console.log(req.user, "request user");

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found for the id : ${req.params.bootcampId}`
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
  // res.status(201).json({
  //   success: true,
  //   data: "data",
  // });
});
export { getReviews, getReview, addReview };
