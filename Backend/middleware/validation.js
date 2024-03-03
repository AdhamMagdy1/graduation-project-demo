const { validationResult, body } = require('express-validator');
const { AppError } = require('../utils/error');

// Middleware function for request validation using express-validator
const validateRequests = (validations) => {
  return async (req, res, next) => {
    // Execute the defined validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // If there are validation errors, send an error response
      const errorMessages = errors.array().map((error) => error.msg);
      next(new AppError(`Validation error: ${errorMessages.join(', ')}`, 400));
    } else {
      // If there are no validation errors, continue to the next middleware
      next();
    }
  };
};

module.exports = {
  validateRequests,
};
