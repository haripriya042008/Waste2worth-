const Charity = require('../models/Charity');
const User = require('../models/User');
const { calculateHaversineDistance } = require('../services/distanceService');
const { notifyUser } = require('../services/socketService');

// @desc    Get current charity organization profile
// @route   GET /api/charities/profile
// @access  Private (Charity)
const getCharityProfile = async (req, res, next) => {
  try {
    const charity = await Charity.findOne({ userId: req.user._id }).populate(
      'userId',
      'name email phone address'
    );

    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity profile not found' });
    }

    res.status(200).json({
      success: true,
      data: charity
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update charity organization profile
// @route   PUT /api/charities/profile
// @access  Private (Charity)
const updateCharityProfile = async (req, res, next) => {
  try {
    const charity = await Charity.findOne({ userId: req.user._id });
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity profile not found' });
    }

    const {
      organizationName,
      organizationType,
      description,
      address,
      latitude,
      longitude,
      serviceCapacity,
      peopleServed,
      operatingHours,
      contactPhone
    } = req.body;

    if (organizationName) charity.organizationName = organizationName;
    if (organizationType) charity.organizationType = organizationType;
    if (description !== undefined) charity.description = description;
    if (address) charity.address = address;
    if (serviceCapacity !== undefined) charity.serviceCapacity = Number(serviceCapacity);
    if (peopleServed !== undefined) charity.peopleServed = Number(peopleServed);
    if (operatingHours) charity.operatingHours = operatingHours;
    if (contactPhone) charity.contactPhone = contactPhone;

    if (latitude !== undefined && longitude !== undefined) {
      charity.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    const updatedCharity = await charity.save();

    res.status(200).json({
      success: true,
      data: updatedCharity
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all charities (Admin or public listing with filters)
// @route   GET /api/charities
// @access  Private / Public
const getAllCharities = async (req, res, next) => {
  try {
    const { status, type, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.verificationStatus = status;
    }
    if (type && type !== 'all') {
      query.organizationType = type;
    }
    if (search) {
      query.$or = [
        { organizationName: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [charities, total] = await Promise.all([
      Charity.find(query)
        .populate('userId', 'name email phone accountStatus')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Charity.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: charities.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: charities
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby verified charities based on GPS coordinates
// @route   GET /api/charities/nearby
// @access  Private
const getNearbyCharities = async (req, res, next) => {
  try {
    const { lat, lng, radius = 25 } = req.query; // radius in km (default 25km)

    let userLat = parseFloat(lat);
    let userLng = parseFloat(lng);

    // Fallback to user location if not provided in query
    if (isNaN(userLat) || isNaN(userLng)) {
      if (req.user?.location?.coordinates?.length === 2) {
        userLng = req.user.location.coordinates[0];
        userLat = req.user.location.coordinates[1];
      } else {
        userLat = 12.9716;
        userLng = 77.5946;
      }
    }

    const userCoords = [userLng, userLat];
    const maxDistanceMeters = parseFloat(radius) * 1000;

    // Find verified charities nearby
    const charities = await Charity.find({
      verificationStatus: 'Approved',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: userCoords
          },
          $maxDistance: maxDistanceMeters
        }
      }
    }).populate('userId', 'name email phone');

    // Attach computed distance
    const charitiesWithDistance = charities.map((charity) => {
      const charityObj = charity.toObject();
      charityObj.distanceKm = calculateHaversineDistance(
        userCoords,
        charity.location?.coordinates
      );
      return charityObj;
    });

    res.status(200).json({
      success: true,
      count: charitiesWithDistance.length,
      data: charitiesWithDistance
    });
  } catch (error) {
    // If geospatial index query has edge issue, fallback gracefully to Haversine in-memory
    try {
      const allApproved = await Charity.find({ verificationStatus: 'Approved' }).populate(
        'userId',
        'name email phone'
      );
      const userCoords = [parseFloat(req.query.lng) || 77.5946, parseFloat(req.query.lat) || 12.9716];
      const maxDistance = parseFloat(req.query.radius) || 25;

      const filtered = allApproved
        .map((ch) => {
          const obj = ch.toObject();
          obj.distanceKm = calculateHaversineDistance(userCoords, ch.location?.coordinates);
          return obj;
        })
        .filter((ch) => ch.distanceKm !== null && ch.distanceKm <= maxDistance)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered
      });
    } catch (fallbackError) {
      next(fallbackError);
    }
  }
};

// @desc    Verify or reject charity (Admin action)
// @route   PUT /api/charities/:id/verify
// @access  Private (Admin)
const verifyCharity = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status. Must be Approved, Rejected, or Pending.'
      });
    }

    const charity = await Charity.findById(req.params.id);
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }

    charity.verificationStatus = status;
    if (status === 'Rejected') {
      charity.rejectionReason = rejectionReason || 'Information could not be verified.';
    } else if (status === 'Approved') {
      charity.rejectionReason = '';
    }

    await charity.save();

    // Send real-time notification to the charity owner
    await notifyUser({
      userId: charity.userId,
      title: `Charity Verification: ${status}`,
      message:
        status === 'Approved'
          ? 'Congratulations! Your charity account has been verified by the administrator. You can now accept surplus food donations.'
          : `Your charity verification was not approved. Reason: ${charity.rejectionReason}`,
      notificationType: 'charity_verification'
    });

    res.status(200).json({
      success: true,
      message: `Charity status updated to ${status}`,
      data: charity
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCharityProfile,
  updateCharityProfile,
  getAllCharities,
  getNearbyCharities,
  verifyCharity
};
