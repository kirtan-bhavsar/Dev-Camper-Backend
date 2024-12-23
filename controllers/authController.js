import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

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
    return next(
      new ErrorResponse(
        "Invalid Credentials as no email id found for this id",
        401
      )
    );
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(
      new ErrorResponse("Invalid Credentials as password does not matches", 401)
    );
  }

  // instead of the below two lines, the we generated a seperate function to be called

  // const token = await user.getSignedToken();

  // res.status(200).json({ success: true, data: token });

  sendTokenResponse(user, 200, res);
});

// @desc
// @api GET api/v1/auth/me
// access private
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc  send token to registered email-id when hitted the route
// @api POST api/v1/auth/forgotpassword
// access public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(`No user found for the email : ${req.body.email}`, 401)
    );
  }

  const resetToken = await user.getResetToken();

  console.log(resetToken, "reset token");

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Please find the link to reset password, and make a put request to the same \n\n ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
    });

    res.status(200).json({ success: true, data: "Email Sent" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc api to reset the password
// @api PUT api/v1/auth/resetpassword/:resetToken
// @access public
const resetPassword = asyncHandler(async (req, res, next) => {
  const resetToken = req.params.resetToken;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  const updatedPassword = req.body.password;

  user.password = updatedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.save();

  // res.status(200).json({ success: true, data: resetToken, user: user });
  sendTokenResponse(user, 200, res);
});

// @desc api to reset the password
// @api PUT api/v1/auth/resetpassword/:resetToken
// @access private
const updateUserDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user });
});

// @desc change password by user
// @api PUT api/v1/auth/
// @access private
const updateUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("No user found", 404));
  }

  user.password = req.body.newPassword;

  user.save();

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

// @desc  log user out / clear cookie
// @api GET api/v1/auth/logout
// access private
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  forgotPassword,
  resetPassword,
  updateUserDetails,
  updateUserPassword,
};
