
import { ApiError } from "../utils/ApiError.js";

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  // eslint-disable-line
  const status = err.statusCode || 500;

  const payload = {
    success: false,
    message: err.message || "Server error",
  };

  if (err.details) payload.details = err.details;

  // Avoid leaking internals in production
  if (process.env.NODE_ENV === "production" && status === 500) {
    payload.message = "Internal server error";
    delete payload.details;
  }

  res.status(status).json(payload);
}
