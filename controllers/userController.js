import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import getAdvancedResults from "../middleware/advancedResults.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc get all registered users
// @api GET api/v1/user
// @access private(to admin)
// const getAllUsers = asyncHandler(async (req, res, next) => {
//   res.status(200).json({success:true}));
// }));

const getAllUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc get all registered users
// @api GET api/v1/user/:id
// @access private(to admin)
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("No user found with this id", 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc create user
// @api POST api/v1/user
// @access private(to admin)
const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc update existing users
// @api PUT api/v1/user/:id
// @access private(to admin)
const updateUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!user) {
    return next(new ErrorResponse("No user found with this id", 404));
  }

  res.status(200).json({ success: true, data: user });
});

// @desc delete user
// @api DELETE api/v1/user/:id
// @access private(to admin)
const deleteUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorResponse("No user found with this id", 404));
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

const demoUserAPI = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});

export {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  demoUserAPI,
};
