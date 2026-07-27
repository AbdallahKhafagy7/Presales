export class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConflictError extends ApiError {
  constructor(message, errors = null) {
    super(409, message, errors);
  }
}

export class AuthorityError extends ApiError {
  constructor(message, errors = null) {
    super(401, message, errors);
  }
}

export class BadRequestError extends ApiError {
  constructor(message, errors = null) {
    super(400, message, errors);
  }
}

export class NotFoundError extends ApiError {
  constructor(message, errors = null) {
    super(404, message, errors);
  }
}