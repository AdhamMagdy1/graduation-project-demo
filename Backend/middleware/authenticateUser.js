require('dotenv').config();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { AppError } = require('../utils/error');

// Middleware function to verify JWT token and extract user information
const authenticateUser = (Model) => {
  return async (req, res, next) => {
    try {
      // Get token from headers
      const token = req.headers.authorization;
      if (!token) {
        return next(new AppError('Unauthorized - No token provided', 401));
      }
      // Verify token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      // Check if user still exists
      const user = await Model.findByPk(decoded.id, { attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] } });
      if (!user) {
        return next(new AppError(`Unauthorized - ${Model.name} related to this token is no longer available`, 401));
      }
      // Attach user information to request object
      req.user = user;
      req.user.role = decoded.role;
      next();
    } catch (error) {
      console.error(error);
      return next(new AppError('Unauthorized - Invalid token', 401));
    }
  }
}

const autherizeUser =  (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Unauthorized - Only Owner can access this functionality', 401));
    }
    next();
  }
}

module.exports = { authenticateUser, autherizeUser };
