// src/utils/api-error.js
class ApiError extends Error {
  constructor(
    statusCode,
    message,
    errors = [],
    stack = "",
    data = {}
  ) {
    super(message);
    this.statusCode = statusCode;
    // this.name = this.constructor.name;
    this.success = false;
    this.errors = errors;
    this.data = data;

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError }