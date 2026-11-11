const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Charity = require('../models/Charity');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'waste2worth_secret_2026');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    if (user.accountStatus === 'suspended' || user.accountStatus === 'deactivated') {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.accountStatus}. Please contact administrator.`
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed verification'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this resource`
      });
    }
    next();
  };
};

// Check if charity is verified
const requireVerifiedCharity = async (req, res, next) => {
  if (req.user.role !== 'charity') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to charity accounts only'
    });
  }

  const charity = await Charity.findOne({ userId: req.user._id });
  if (!charity) {
    return res.status(404).json({
      success: false,
      message: 'Charity profile not found'
    });
  }

  if (charity.verificationStatus !== 'Approved') {
    return res.status(403).json({
      success: false,
      message: `Your charity account status is '${charity.verificationStatus}'. Only verified charities can perform this action.`
    });
  }

  req.charity = charity;
  next();
};

module.exports = {
  protect,
  authorize,
  requireVerifiedCharity
};
