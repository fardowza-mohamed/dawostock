const { AppError } = require('./errorHandler');

/**
 * Restrict a route to one or more roles.
 * Usage: authorize('admin'), authorize('admin', 'pharmacist')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }
  next();
};

module.exports = { authorize };
