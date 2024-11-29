import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";

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

  const token = user.getSignedToken();

  res.status(200).json({ success: true, data: token });
});

export { registerUser };
