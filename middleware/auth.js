import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/errorResponse.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //   if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  if (!token) {
    return next(
      new ErrorResponse("Not authorized to use this route for token not found"),
      401
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(
      new ErrorResponse(
        "Not authorized to use this route for decoded failed",
        401
      )
    );
  }
});

export { protect };
