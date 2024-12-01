import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import dotenv from "dotenv";

dotenv.config();

// @desc register a user
// @api POST api/v1/auth/register
// access public
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // const token = user.getSignedToken();

  // res.status(200).json({ success: true, data: token });

  sendTokenResponse(user, 200, res);
});

// @desc login a user
// @api POST api/v1/auth/login
// access public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password are being entered
  if (!email || !password) {
    return next(new ErrorResponse("Please provide email Id and Password", 404));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  // instead of the below two lines, the we generated a seperate function to be called

  // const token = await user.getSignedToken();

  // res.status(200).json({ success: true, data: token });

  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = async (user, statusCode, res) => {
  const token = await user.getSignedToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    data: token,
  });
};

const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export { registerUser, loginUser, getMe };
