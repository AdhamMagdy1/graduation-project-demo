require('dotenv').config();
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/error');

// Middleware function to verify JWT token and extract user information
const authenticateUser = (req, res, next) => {
  // Get token from headers
  const token = req.headers.authorization;

  if (!token) {
    return next(new AppError('Unauthorized - No token provided', 401));
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new AppError('Unauthorized - Invalid token', 401));
    }

    // Attach user information to request object
    req.user = decoded;
    next();
  });
};

module.exports = authenticateUser;
