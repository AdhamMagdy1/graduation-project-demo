require('dotenv').config();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
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

// const authenticate = async (Model) => {
//   return async (req, res, next) => {
//     try {
//       const token = req.headers.authorization;
//       console.log(token);
//       if (!token) {
//         return next(new AppError("Unauthorized - No token provided", 401));
//       }
//       const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//       console.log(decoded);
//       const user = await Model.findByPk(decoded.id, {
//         attributes: { exclude: ["password"] },
//       });
//       if (!user) {
//         return next(
//           new AppError(
//             `${Model.name} related to this token is no longer avaliable`,
//             401
//           )
//         );
//       }
//       req.user = user;
//       next();
//     } catch (error) {
//       console.error(error);
//       return next(new AppError("Unauthorized - Invalid token", 401));
//     }
//   };
// };

module.exports = authenticateUser;
