/**
 * Global Error Handler Middleware
 * 
 * This middleware catches all errors thrown in async route handlers.
 * It standardizes error responses and provides proper HTTP status codes.
 * 
 * Usage: app.use(errorHandler) after all routes
 * 
 * Throwing custom errors:
 * - throw new AppError("User not found", 404)
 * - throw new AppError("Unauthorized", 401)
 * - throw new Error("Database error") defaults to 500
 */

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  // Set default status and message
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Validation Error",
      details: messages
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      status: 400,
      message: `Duplicate value for field: ${field}`
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Invalid token"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Token expired"
    });
  }

  // Send error response
  res.status(err.statusCode).json({
    success: false,
    status: err.statusCode,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

module.exports = { errorHandler, AppError };
