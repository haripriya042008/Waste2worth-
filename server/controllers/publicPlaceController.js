const PublicPlace = require('../models/PublicPlace');

// @desc    Create a verified public distribution point
// @route   POST /api/public-places
// @access  Private (Admin)
const createPublicPlace = async (req, res, next) => {
  try {
    const {
      name,
      placeType,
      address,
      latitude,
      longitude,
      description,
      operatingHours,
      contactPerson,
      contactPhone,
      verificationStatus = 'Verified'
    } = req.body;

    const lat = parseFloat(latitude) || 12.9716;
    const lng = parseFloat(longitude) || 77.5946;

    const place = await PublicPlace.create({
      name,
      placeType,
      address,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      description,
      operatingHours,
      contactPerson,
      contactPhone,
      verificationStatus
    });

    res.status(201).json({
      success: true,
      data: place
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all public distribution points
// @route   GET /api/public-places
// @access  Public / Private
const getPublicPlaces = async (req, res, next) => {
  try {
    const { type, status, search } = req.query;

    const query = {};
    if (type && type !== 'all') {
      query.placeType = type;
    }
    if (status && status !== 'all') {
      query.verificationStatus = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const places = await PublicPlace.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: places.length,
      data: places
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update public distribution point
// @route   PUT /api/public-places/:id
// @access  Private (Admin)
const updatePublicPlace = async (req, res, next) => {
  try {
    const place = await PublicPlace.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Public place not found' });
    }

    const {
      name,
      placeType,
      address,
      latitude,
      longitude,
      description,
      operatingHours,
      contactPerson,
      contactPhone,
      verificationStatus
    } = req.body;

    if (name) place.name = name;
    if (placeType) place.placeType = placeType;
    if (address) place.address = address;
    if (description !== undefined) place.description = description;
    if (operatingHours) place.operatingHours = operatingHours;
    if (contactPerson !== undefined) place.contactPerson = contactPerson;
    if (contactPhone !== undefined) place.contactPhone = contactPhone;
    if (verificationStatus) place.verificationStatus = verificationStatus;

    if (latitude !== undefined && longitude !== undefined) {
      place.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    const updated = await place.save();

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete public distribution point
// @route   DELETE /api/public-places/:id
// @access  Private (Admin)
const deletePublicPlace = async (req, res, next) => {
  try {
    const place = await PublicPlace.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Public place not found' });
    }

    await place.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Public distribution point deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPublicPlace,
  getPublicPlaces,
  updatePublicPlace,
  deletePublicPlace
};
