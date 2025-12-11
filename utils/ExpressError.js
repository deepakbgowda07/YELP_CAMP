/**
 * ExpressError.js
 * -----------------------------------------------------
 * Custom error class used to standardize error handling
 * throughout the application.
 *
 * Usage:
 *    throw new ExpressError("Message here", 400);
 *
 * Properties:
 *  - message     → Description of the error
 *  - statusCode  → HTTP status code (e.g., 400, 404, 500)
 */

class ExpressError extends Error {
    constructor(message, statusCode) {
        super();               // Call built-in Error constructor
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
