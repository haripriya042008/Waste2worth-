const User = require('../models/User');
const Charity = require('../models/Charity');
const Donation = require('../models/Donation');
const DonationActivity = require('../models/DonationActivity');

// @desc    Get Administrator platform analytics
// @route   GET /api/analytics/admin
// @access  Private (Admin)
const getAdminAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalDonors,
      totalCharities,
      verifiedCharities,
      totalDonations,
      statusBreakdown,
      categoryBreakdown,
      monthlyTrends,
      quantityStats,
      recentActivities
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'donor' }),
      Charity.countDocuments(),
      Charity.countDocuments({ verificationStatus: 'Approved' }),
      Donation.countDocuments(),

      // Donations by status
      Donation.aggregate([
        { $group: { _id: '$donationStatus', count: { $sum: 1 } } }
      ]),

      // Most donated food categories
      Donation.aggregate([
        {
          $group: {
            _id: '$foodCategory',
            count: { $sum: 1 },
            totalServings: { $sum: '$estimatedServings' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ]),

      // Monthly donation trends (last 6 months)
      Donation.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            servings: { $sum: '$estimatedServings' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]),

      // Total quantity and servings across all donations
      Donation.aggregate([
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: '$quantity' },
            totalEstimatedServings: { $sum: '$estimatedServings' }
          }
        }
      ]),

      // Recent platform activities
      DonationActivity.find()
        .populate('userId', 'name role')
        .populate('donationId', 'foodName foodCategory')
        .sort({ timestamp: -1 })
        .limit(10)
    ]);

    // Format status breakdown into object
    const statusCounts = {
      Available: 0,
      Accepted: 0,
      Collected: 0,
      Completed: 0,
      Cancelled: 0,
      Rejected: 0
    };
    statusBreakdown.forEach((item) => {
      if (statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDonors,
        totalCharities,
        verifiedCharities,
        pendingCharities: totalCharities - verifiedCharities,
        totalDonations,
        totalQuantity: quantityStats[0]?.totalQuantity || 0,
        totalEstimatedServings: quantityStats[0]?.totalEstimatedServings || 0,
        statusCounts,
        categoryBreakdown,
        monthlyTrends,
        recentActivities
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Donor specific analytics
// @route   GET /api/analytics/donor
// @access  Private (Donor)
const getDonorAnalytics = async (req, res, next) => {
  try {
    const donorId = req.user._id;

    const [
      totalDonations,
      statusBreakdown,
      categoryBreakdown,
      monthlyTrends,
      quantityStats,
      recentDonations
    ] = await Promise.all([
      Donation.countDocuments({ donorId }),

      Donation.aggregate([
        { $match: { donorId } },
        { $group: { _id: '$donationStatus', count: { $sum: 1 } } }
      ]),

      Donation.aggregate([
        { $match: { donorId } },
        { $group: { _id: '$foodCategory', count: { $sum: 1 }, totalQuantity: { $sum: '$quantity' } } },
        { $sort: { count: -1 } }
      ]),

      Donation.aggregate([
        { $match: { donorId } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            servings: { $sum: '$estimatedServings' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),

      Donation.aggregate([
        { $match: { donorId } },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: '$quantity' },
            totalServings: { $sum: '$estimatedServings' }
          }
        }
      ]),

      Donation.find({ donorId })
        .populate('charityId', 'organizationName contactPhone')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const statusCounts = {
      Available: 0,
      Accepted: 0,
      Collected: 0,
      Completed: 0,
      Cancelled: 0,
      Rejected: 0
    };
    statusBreakdown.forEach((item) => {
      if (statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalDonations,
        totalQuantity: quantityStats[0]?.totalQuantity || 0,
        totalEstimatedServings: quantityStats[0]?.totalServings || 0,
        statusCounts,
        categoryBreakdown,
        monthlyTrends,
        recentDonations
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Charity specific analytics
// @route   GET /api/analytics/charity
// @access  Private (Charity)
const getCharityAnalytics = async (req, res, next) => {
  try {
    const charity = await Charity.findOne({ userId: req.user._id });
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity profile not found' });
    }

    const [
      totalAccepted,
      totalCollected,
      totalCompleted,
      pendingPickups,
      categoryBreakdown,
      monthlyCollections,
      servingsImpact,
      recentDonations
    ] = await Promise.all([
      Donation.countDocuments({ acceptedBy: req.user._id }),
      Donation.countDocuments({ acceptedBy: req.user._id, donationStatus: 'Collected' }),
      Donation.countDocuments({ acceptedBy: req.user._id, donationStatus: 'Completed' }),
      Donation.countDocuments({ acceptedBy: req.user._id, donationStatus: 'Accepted' }),

      Donation.aggregate([
        { $match: { acceptedBy: req.user._id } },
        { $group: { _id: '$foodCategory', count: { $sum: 1 }, servings: { $sum: '$estimatedServings' } } },
        { $sort: { count: -1 } }
      ]),

      Donation.aggregate([
        { $match: { acceptedBy: req.user._id } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            servings: { $sum: '$estimatedServings' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),

      Donation.aggregate([
        { $match: { acceptedBy: req.user._id, donationStatus: { $in: ['Collected', 'Completed'] } } },
        { $group: { _id: null, totalServingsDistributed: { $sum: '$estimatedServings' } } }
      ]),

      Donation.find({ acceptedBy: req.user._id })
        .populate('donorId', 'name phone address')
        .sort({ updatedAt: -1 })
        .limit(6)
    ]);

    res.status(200).json({
      success: true,
      data: {
        charityName: charity.organizationName,
        verificationStatus: charity.verificationStatus,
        totalAccepted,
        totalCollected,
        totalCompleted,
        pendingPickups,
        totalServingsDistributed: servingsImpact[0]?.totalServingsDistributed || 0,
        categoryBreakdown,
        monthlyCollections,
        recentDonations
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminAnalytics,
  getDonorAnalytics,
  getCharityAnalytics
};
