export default class ApiResponse {
  /**
   * @param {number} statusCode - HTTP Status Code (e.g., 200, 201)
   * @param {any} data - Response payload
   * @param {string} message - Human-readable success message
   */
  constructor(statusCode, data = null, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Automatically sets boolean flag
  }
}

// usage example:
// const response = new ApiResponse(201, user, "User profile created successfully");
// return res.status(response.statusCode).json(response);
