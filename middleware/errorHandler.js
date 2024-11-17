import ErrorResponse from "../utils/errorResponse.js";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  console.log(err);

  //   if the error is CastError then the following activity is to be performed
  if (err.name === "CastError") {
    const message = `Resource not found for the id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // duplication error handler
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

export default errorHandler;
