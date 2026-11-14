const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Protect routes: verify JWT authentication
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret_key_2026'
      );

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.'
        });
      }

      if (user.isSuspended) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been suspended. Please contact customer support.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Invalid or expired token.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to proceed.'
    });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

// Require vendor to be approved before creating/editing products
const checkVendorApproved = (req, res, next) => {
  if (req.user.role !== 'vendor') {
    return next();
  }

  if (req.user.vendorProfile?.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: `Your vendor account status is '${req.user.vendorProfile?.status || 'pending'}'. Only approved vendors can manage inventory or receive orders.`
    });
  }

  next();
};

module.exports = {
  generateToken,
  protect,
  authorize,
  checkVendorApproved
};
