export class ApiError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true; // To differentiate between operational errors and programming errors
        
        Error.captureStackTrace(this, this.constructor);
    }
};