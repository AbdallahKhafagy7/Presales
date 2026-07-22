export class ApiError extends Error {
    constructor(statusCode, message, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = true;  // is the error Opertaional or from the server
        Error.captureStackTrace(this, this.constructor); // Clean the stack trace
    }
}