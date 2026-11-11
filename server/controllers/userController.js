const User = require('../models/User');
const Charity = require('../models/Charity');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let charity = null;
    if (user.role === 'charity') {
      charity = await Charity.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        charity
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, phone, address, donorCategory, latitude, longitude } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (donorCategory && user.role === 'donor') user.donorCategory = donorCategory;

    if (latitude !== undefined && longitude !== undefined) {
      user.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (with search and filters)
// @route   GET /api/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.accountStatus = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user account status (active, suspended, deactivated)
// @route   PUT /api/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended', 'deactivated'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be active, suspended, or deactivated.'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deactivating own admin account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Administrator cannot modify their own active status.'
      });
    }

    user.accountStatus = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserStatus
};
