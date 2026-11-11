const User = require('../models/User');
const Charity = require('../models/Charity');
const generateToken = require('../utils/generateToken');
const { notifyUser, emitToRole } = require('../services/socketService');

// @desc    Register a new user (Donor or Charity)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'donor',
      donorCategory,
      address,
      latitude,
      longitude,
      // Charity specific fields:
      organizationName,
      organizationType,
      description,
      serviceCapacity,
      peopleServed,
      operatingHours
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    // Default coordinates if not provided (Bangalore coords)
    const lat = parseFloat(latitude) || 12.9716;
    const lng = parseFloat(longitude) || 77.5946;

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      donorCategory: role === 'donor' ? donorCategory || 'Individual / Household' : undefined,
      address,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    });

    let charityData = null;

    // If role is charity, create charity profile
    if (role === 'charity') {
      charityData = await Charity.create({
        userId: user._id,
        organizationName: organizationName || name,
        organizationType: organizationType || 'NGO',
        description: description || '',
        verificationStatus: 'Pending',
        address: address,
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        serviceCapacity: serviceCapacity ? Number(serviceCapacity) : 100,
        peopleServed: peopleServed ? Number(peopleServed) : 50,
        operatingHours: operatingHours || '9:00 AM - 6:00 PM',
        contactPhone: phone
      });

      // Notify admins of new charity verification request
      emitToRole('admin', 'admin_alert', {
        title: 'New Charity Verification Request',
        message: `${charityData.organizationName} has registered and requested verification.`,
        charityId: charityData._id
      });
    }

    // Welcome notification
    await notifyUser({
      userId: user._id,
      title: 'Welcome to Waste2Worth!',
      message:
        role === 'charity'
          ? 'Thank you for registering. Your charity account has been submitted for administrator verification.'
          : 'Thank you for joining the mission to eliminate food waste! You can now post donations.',
      notificationType: 'system'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        donorCategory: user.donorCategory,
        address: user.address,
        location: user.location,
        accountStatus: user.accountStatus,
        charity: charityData
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Find user with password selected
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    // Check account status
    if (user.accountStatus === 'suspended' || user.accountStatus === 'deactivated') {
      return res.status(403).json({
        success: false,
        message: `Your account is currently ${user.accountStatus}. Please contact support.`
      });
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password does not match.'
      });
    }

    let charity = null;
    if (user.role === 'charity') {
      charity = await Charity.findOne({ userId: user._id });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        donorCategory: user.donorCategory,
        address: user.address,
        location: user.location,
        accountStatus: user.accountStatus,
        charity
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let charity = null;

    if (user.role === 'charity') {
      charity = await Charity.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        donorCategory: user.donorCategory,
        address: user.address,
        location: user.location,
        accountStatus: user.accountStatus,
        charity
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear token placeholder
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
