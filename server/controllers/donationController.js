const Donation = require('../models/Donation');
const DonationActivity = require('../models/DonationActivity');
const Charity = require('../models/Charity');
const User = require('../models/User');
const { calculateFoodQuantity } = require('../services/calculationService');
const { calculateHaversineDistance } = require('../services/distanceService');
const { notifyUser, emitToRole } = require('../services/socketService');

// @desc    Create a new food donation
// @route   POST /api/donations
// @access  Private (Donor / Admin)
const createDonation = async (req, res, next) => {
  try {
    const {
      foodName,
      foodCategory,
      foodType,
      quantity,
      quantityUnit,
      description,
      preparationDate,
      expiryDate,
      pickupAddress,
      latitude,
      longitude,
      pickupAvailability,
      specialInstructions
    } = req.body;

    // Handle uploaded images from Multer
    let foodImages = [];
    if (req.files && req.files.length > 0) {
      foodImages = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.foodImages) {
      // Support array of strings if passed via JSON
      foodImages = Array.isArray(req.body.foodImages) ? req.body.foodImages : [req.body.foodImages];
    }

    // Default coordinates if not provided
    const lat = parseFloat(latitude) || (req.user?.location?.coordinates?.[1] || 12.9716);
    const lng = parseFloat(longitude) || (req.user?.location?.coordinates?.[0] || 77.5946);

    // Calculate estimated servings
    const calculation = calculateFoodQuantity({
      quantity,
      quantityUnit,
      foodCategory
    });

    const donation = await Donation.create({
      donorId: req.user._id,
      foodName,
      foodCategory,
      foodType,
      quantity: Number(quantity),
      quantityUnit,
      estimatedServings: calculation.estimatedServings,
      description: description || '',
      foodImages,
      preparationDate: preparationDate ? new Date(preparationDate) : undefined,
      expiryDate: new Date(expiryDate),
      pickupAddress: pickupAddress || req.user.address,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      pickupAvailability,
      specialInstructions: specialInstructions || '',
      donationStatus: 'Available'
    });

    // Log Activity
    await DonationActivity.create({
      donationId: donation._id,
      userId: req.user._id,
      activityType: 'CREATED',
      description: `Donation created: "${foodName}" (${quantity} ${quantityUnit}) by ${req.user.name}.`
    });

    // Notify Donor confirmation
    await notifyUser({
      userId: req.user._id,
      title: 'Donation Submitted Successfully',
      message: `Your food donation of "${foodName}" (${quantity} ${quantityUnit}) is now visible to nearby verified charities.`,
      notificationType: 'donation_created',
      relatedDonationId: donation._id
    });

    // Notify all verified charities in real-time
    emitToRole('charity', 'new_donation_available', {
      donationId: donation._id,
      foodName: donation.foodName,
      foodCategory: donation.foodCategory,
      quantity: donation.quantity,
      quantityUnit: donation.quantityUnit,
      pickupAddress: donation.pickupAddress,
      location: donation.location
    });

    res.status(201).json({
      success: true,
      data: donation,
      calculation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations (with search, category, status, date filters)
// @route   GET /api/donations
// @access  Public / Private
const getDonations = async (req, res, next) => {
  try {
    const {
      status,
      category,
      foodType,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.donationStatus = status;
    }

    if (category && category !== 'all') {
      query.foodCategory = category;
    }

    if (foodType && foodType !== 'all') {
      query.foodType = foodType;
    }

    if (search) {
      query.$or = [
        { foodName: { $regex: search, $options: 'i' } },
        { pickupAddress: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions = { [sortBy]: order === 'asc' ? 1 : -1 };

    const [donations, total] = await Promise.all([
      Donation.find(query)
        .populate('donorId', 'name email phone donorCategory')
        .populate('acceptedBy', 'name email phone')
        .populate('charityId', 'organizationName organizationType address contactPhone')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Donation.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: donations.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: donations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donation details by ID (including activities)
// @route   GET /api/donations/:id
// @access  Public / Private
const getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name email phone donorCategory address location')
      .populate('acceptedBy', 'name email phone')
      .populate('charityId', 'organizationName organizationType address location contactPhone peopleServed');

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation record not found' });
    }

    // Fetch activities for audit timeline
    const activities = await DonationActivity.find({ donationId: donation._id })
      .populate('userId', 'name role')
      .sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: donation,
      activities
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my donations (Logged in Donor)
// @route   GET /api/donations/my-donations
// @access  Private (Donor)
const getMyDonations = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = { donorId: req.user._id };
    if (status && status !== 'all') {
      query.donationStatus = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [donations, total] = await Promise.all([
      Donation.find(query)
        .populate('acceptedBy', 'name email phone')
        .populate('charityId', 'organizationName organizationType contactPhone address')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Donation.countDocuments(query)
    ]);

    // Status summary for donor
    const summary = await Donation.aggregate([
      { $match: { donorId: req.user._id } },
      { $group: { _id: '$donationStatus', count: { $sum: 1 }, totalQty: { $sum: '$quantity' } } }
    ]);

    res.status(200).json({
      success: true,
      count: donations.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      summary,
      data: donations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available donations for Charities (with distance calculation and filters)
// @route   GET /api/donations/available
// @access  Private (Charity / Admin)
const getAvailableDonations = async (req, res, next) => {
  try {
    const { category, foodType, maxDistance, sort = 'nearest', lat, lng } = req.query;

    let targetLat = parseFloat(lat);
    let targetLng = parseFloat(lng);

    // Fallback to charity coordinates if registered
    if (isNaN(targetLat) || isNaN(targetLng)) {
      if (req.charity?.location?.coordinates?.length === 2) {
        targetLng = req.charity.location.coordinates[0];
        targetLat = req.charity.location.coordinates[1];
      } else if (req.user?.location?.coordinates?.length === 2) {
        targetLng = req.user.location.coordinates[0];
        targetLat = req.user.location.coordinates[1];
      } else {
        targetLat = 12.9716;
        targetLng = 77.5946;
      }
    }

    const query = { donationStatus: 'Available' };

    if (category && category !== 'all') {
      query.foodCategory = category;
    }

    if (foodType && foodType !== 'all') {
      query.foodType = foodType;
    }

    // Only non-expired items
    query.expiryDate = { $gte: new Date() };

    let donations = await Donation.find(query)
      .populate('donorId', 'name donorCategory address')
      .sort({ createdAt: -1 });

    const userCoords = [targetLng, targetLat];

    // Calculate distance for each donation
    let donationsWithDistance = donations.map((donation) => {
      const obj = donation.toObject();
      obj.distanceKm = calculateHaversineDistance(userCoords, donation.location?.coordinates);
      return obj;
    });

    // Filter by maxDistance if supplied
    if (maxDistance && !isNaN(parseFloat(maxDistance))) {
      const maxKm = parseFloat(maxDistance);
      donationsWithDistance = donationsWithDistance.filter(
        (d) => d.distanceKm !== null && d.distanceKm <= maxKm
      );
    }

    // Sort by proximity or creation date
    if (sort === 'nearest') {
      donationsWithDistance.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    } else {
      donationsWithDistance.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json({
      success: true,
      count: donationsWithDistance.length,
      data: donationsWithDistance
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update eligible donation (Donor only, before acceptance)
// @route   PUT /api/donations/:id
// @access  Private (Donor / Admin)
const updateDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Authorization check
    if (
      req.user.role !== 'admin' &&
      donation.donorId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this donation'
      });
    }

    // Only allow editing if Available
    if (donation.donationStatus !== 'Available' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: `Cannot edit donation once it is '${donation.donationStatus}'.`
      });
    }

    const {
      foodName,
      foodCategory,
      foodType,
      quantity,
      quantityUnit,
      description,
      preparationDate,
      expiryDate,
      pickupAddress,
      latitude,
      longitude,
      pickupAvailability,
      specialInstructions,
      existingImages
    } = req.body;

    if (foodName) donation.foodName = foodName;
    if (foodCategory) donation.foodCategory = foodCategory;
    if (foodType) donation.foodType = foodType;
    if (quantity !== undefined) donation.quantity = Number(quantity);
    if (quantityUnit) donation.quantityUnit = quantityUnit;
    if (description !== undefined) donation.description = description;
    if (preparationDate) donation.preparationDate = new Date(preparationDate);
    if (expiryDate) donation.expiryDate = new Date(expiryDate);
    if (pickupAddress) donation.pickupAddress = pickupAddress;
    if (pickupAvailability) donation.pickupAvailability = pickupAvailability;
    if (specialInstructions !== undefined) donation.specialInstructions = specialInstructions;

    if (latitude !== undefined && longitude !== undefined) {
      donation.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    // Recalculate estimated servings
    const calc = calculateFoodQuantity({
      quantity: donation.quantity,
      quantityUnit: donation.quantityUnit,
      foodCategory: donation.foodCategory
    });
    donation.estimatedServings = calc.estimatedServings;

    // Handle images: retain existing specified images + add new uploads
    let images = [];
    if (existingImages) {
      images = Array.isArray(existingImages) ? existingImages : [existingImages];
    }
    if (req.files && req.files.length > 0) {
      const newUploads = req.files.map((file) => `/uploads/${file.filename}`);
      images = [...images, ...newUploads];
    }
    if (images.length > 0) {
      donation.foodImages = images;
    }

    const updated = await donation.save();

    await DonationActivity.create({
      donationId: updated._id,
      userId: req.user._id,
      activityType: 'UPDATED',
      description: `Donation details updated by ${req.user.name}.`
    });

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept available donation (ATOMIC check-and-update to prevent duplicate acceptance)
// @route   POST /api/donations/:id/accept
// @access  Private (Verified Charity only)
const acceptDonation = async (req, res, next) => {
  try {
    const charity = await Charity.findOne({ userId: req.user._id });
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity profile not found' });
    }

    if (charity.verificationStatus !== 'Approved') {
      return res.status(403).json({
        success: false,
        message: 'Only approved charities are authorized to accept food donations.'
      });
    }

    // Atomic update to ensure no other charity accepts concurrently
    const updatedDonation = await Donation.findOneAndUpdate(
      {
        _id: req.params.id,
        donationStatus: 'Available'
      },
      {
        $set: {
          donationStatus: 'Accepted',
          acceptedBy: req.user._id,
          charityId: charity._id,
          acceptedAt: new Date()
        }
      },
      { new: true }
    )
      .populate('donorId', 'name email phone address')
      .populate('charityId', 'organizationName organizationType contactPhone address');

    if (!updatedDonation) {
      return res.status(409).json({
        success: false,
        message: 'This donation has already been accepted by another charity or is no longer available.'
      });
    }

    // Audit log
    await DonationActivity.create({
      donationId: updatedDonation._id,
      userId: req.user._id,
      activityType: 'ACCEPTED',
      description: `Donation accepted by ${charity.organizationName} (${req.user.name}).`
    });

    // Notify Donor
    await notifyUser({
      userId: updatedDonation.donorId._id,
      title: 'Donation Accepted!',
      message: `Great news! "${updatedDonation.foodName}" has been accepted by ${charity.organizationName}. They will coordinate pickup shortly.`,
      notificationType: 'donation_accepted',
      relatedDonationId: updatedDonation._id
    });

    // Notify Admins
    emitToRole('admin', 'donation_accepted', {
      donationId: updatedDonation._id,
      charityName: charity.organizationName,
      foodName: updatedDonation.foodName
    });

    res.status(200).json({
      success: true,
      message: 'Donation successfully accepted! Pickup coordination details unlocked.',
      data: updatedDonation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject donation with reason
// @route   POST /api/donations/:id/reject
// @access  Private (Charity / Admin)
const rejectDonation = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.donationStatus = 'Rejected';
    donation.rejectionReason = rejectionReason || 'Does not match organization dietary criteria or capacity.';
    await donation.save();

    await DonationActivity.create({
      donationId: donation._id,
      userId: req.user._id,
      activityType: 'REJECTED',
      description: `Donation rejected: ${donation.rejectionReason}`
    });

    // Notify donor
    await notifyUser({
      userId: donation.donorId,
      title: 'Donation Status Update',
      message: `Your donation for "${donation.foodName}" was not accepted. Reason: ${donation.rejectionReason}`,
      notificationType: 'donation_rejected',
      relatedDonationId: donation._id
    });

    res.status(200).json({
      success: true,
      message: 'Donation marked as rejected.',
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark donation as Collected
// @route   PUT /api/donations/:id/collect
// @access  Private (Accepted Charity / Admin)
const collectDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (
      req.user.role !== 'admin' &&
      donation.acceptedBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only the accepting organization can mark this donation as collected.'
      });
    }

    if (donation.donationStatus !== 'Accepted') {
      return res.status(400).json({
        success: false,
        message: `Cannot collect donation in '${donation.donationStatus}' status.`
      });
    }

    donation.donationStatus = 'Collected';
    donation.collectedAt = new Date();
    await donation.save();

    await DonationActivity.create({
      donationId: donation._id,
      userId: req.user._id,
      activityType: 'COLLECTED',
      description: `Donation marked as COLLECTED from donor location.`
    });

    // Notify donor
    await notifyUser({
      userId: donation.donorId,
      title: 'Food Donation Picked Up!',
      message: `Your food donation of "${donation.foodName}" has been safely collected. Thank you!`,
      notificationType: 'donation_collected',
      relatedDonationId: donation._id
    });

    res.status(200).json({
      success: true,
      message: 'Donation status updated to Collected.',
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark donation as Completed (Distributed)
// @route   PUT /api/donations/:id/complete
// @access  Private (Accepted Charity / Admin)
const completeDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (
      req.user.role !== 'admin' &&
      donation.acceptedBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only the accepting organization can mark this donation as completed.'
      });
    }

    if (donation.donationStatus !== 'Collected' && donation.donationStatus !== 'Accepted') {
      return res.status(400).json({
        success: false,
        message: `Cannot complete donation from '${donation.donationStatus}' status.`
      });
    }

    donation.donationStatus = 'Completed';
    donation.completedAt = new Date();
    await donation.save();

    await DonationActivity.create({
      donationId: donation._id,
      userId: req.user._id,
      activityType: 'COMPLETED',
      description: `Donation distribution COMPLETED successfully. Food reached beneficiaries.`
    });

    // Notify donor
    await notifyUser({
      userId: donation.donorId,
      title: 'Donation Distribution Completed! 🎉',
      message: `Your donation of "${donation.foodName}" has been fully distributed to beneficiaries. Your contribution saved ${donation.quantity} ${donation.quantityUnit} of food!`,
      notificationType: 'donation_completed',
      relatedDonationId: donation._id
    });

    res.status(200).json({
      success: true,
      message: 'Donation successfully completed and distributed!',
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel donation (Donor only, before collection)
// @route   DELETE /api/donations/:id
// @access  Private (Donor / Admin)
const cancelDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (
      req.user.role !== 'admin' &&
      donation.donorId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this donation'
      });
    }

    if (donation.donationStatus === 'Collected' || donation.donationStatus === 'Completed') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel donation after it has been '${donation.donationStatus}'.`
      });
    }

    donation.donationStatus = 'Cancelled';
    await donation.save();

    await DonationActivity.create({
      donationId: donation._id,
      userId: req.user._id,
      activityType: 'CANCELLED',
      description: `Donation cancelled by ${req.user.name}.`
    });

    // If accepted by a charity, notify them of cancellation
    if (donation.acceptedBy) {
      await notifyUser({
        userId: donation.acceptedBy,
        title: 'Donation Cancelled by Donor',
        message: `Donation for "${donation.foodName}" has been cancelled by the donor.`,
        notificationType: 'donation_cancelled',
        relatedDonationId: donation._id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Donation has been cancelled.',
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDonation,
  getDonations,
  getDonationById,
  getMyDonations,
  getAvailableDonations,
  updateDonation,
  acceptDonation,
  rejectDonation,
  collectDonation,
  completeDonation,
  cancelDonation
};
