import AppError from "./appError.js";

export default (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 1. Mongoose Bad ObjectId (CastError) -> e.g., looking up id "123"
  if (err.name === "CastError") {
    error = new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
  }

  // 2. Mongoose Duplicate Fields -> e.g., signing up with an email that exists
  if (err.code === 11000) {
    const value = Object.values(err.keyValue)[0];
    error = new AppError(
      `Duplicate field value: "${value}". Please use another value!`,
      400,
    );
  }

  // 3. Mongoose Validation Error -> e.g., password too short
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    error = new AppError(`Invalid input data. ${errors.join(". ")}`, 400);
  }

  // Send the response
  res.status(error.statusCode || 500).json({ message: error.message });
};
