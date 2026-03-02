import { ApiError } from "../utils/ApiError.js";

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function isProd() {
  return process.env.NODE_ENV === "production";
}

export function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  let status = err.statusCode || err.status || 500;

  // Default response shape
  const payload = {
    success: false,
    message: err.message || "Server error",
  };

  // --- Zod validation (if your validate middleware attaches details)
  if (err?.name === "ZodError") {
    status = 400;
    payload.message = "Validation error";
    payload.details = err.flatten ? err.flatten() : err;
  }

  // --- Mongoose: bad ObjectId (CastError)
  if (err?.name === "CastError") {
    status = 400;
    payload.message = `Invalid ${err.path}`;
    payload.details = { value: err.value };
  }

  // --- Mongoose: duplicate key
  if (err?.code === 11000) {
    status = 409;
    const fields = Object.keys(err.keyValue || {});
    payload.message = `Duplicate value for: ${fields.join(", ")}`;
    payload.details = err.keyValue;
  }

  // --- Mongoose validation error
  if (err?.name === "ValidationError") {
    status = 400;
    payload.message = "Validation error";
    payload.details = Object.fromEntries(
      Object.entries(err.errors || {}).map(([k, v]) => [k, v.message]),
    );
  }

  // --- Your ApiError supports details
  if (err instanceof ApiError && err.details) {
    payload.details = err.details;
  } else if (err?.details) {
    payload.details = err.details;
  }

  // Optional error code for easier frontend handling
  if (err?.codeName && typeof err.codeName === "string") {
    payload.code = err.codeName;
  }

  // Hide internals in production for 500s
  if (isProd() && status >= 500) {
    payload.message = "Internal server error";
    delete payload.details;
    delete payload.code;
  }

  // Helpful for debugging in development only
  if (!isProd()) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}
