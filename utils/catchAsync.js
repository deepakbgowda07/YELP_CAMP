/**
 * catchAsync.js
 * -----------------------------------------------------
 * Utility wrapper for async route handlers.
 *
 * Express does not automatically catch errors thrown inside
 * async functions. Instead of writing try/catch in every route:
 *
 *    router.get('/', async (req, res, next) => {
 *        try {
 *            ...
 *        } catch (e) {
 *            next(e);
 *        }
 *    });
 *
 * This helper lets you wrap async functions and automatically
 * forward any errors to Express' error-handling middleware.
 */

module.exports = (func) => {
    return (req, res, next) => {
        // Execute the async function passed in
        // If it returns a rejected promise, .catch(next) passes the error to Express
        func(req, res, next).catch(next);
    };
};
