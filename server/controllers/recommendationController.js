const PublicPlace = require('../models/PublicPlace');
const Charity = require('../models/Charity');
const { calculateHaversineDistance } = require('../services/distanceService');

// @desc    Get nearby public distribution points (MODULE 2)
// @route   GET /api/recommendations/public-places
// @access  Public / Private
const getPublicPlaces = async (req, res, next) => {
  try {
    const { lat, lng, radius = 25, placeType } = req.query;

    let userLat = parseFloat(lat);
    let userLng = parseFloat(lng);

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
    const maxDistanceKm = parseFloat(radius) || 25;

    const query = { verificationStatus: 'Verified' };
    if (placeType && placeType !== 'all') {
      query.placeType = placeType;
    }

    const places = await PublicPlace.find(query);

    const placesWithDistance = places
      .map((place) => {
        const obj = place.toObject();
        obj.distanceKm = calculateHaversineDistance(userCoords, place.location?.coordinates);

        // Generate Google Maps navigation URL
        if (place.location?.coordinates?.length === 2) {
          const [pLng, pLat] = place.location.coordinates;
          obj.googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${pLat},${pLng}`;
        }
        return obj;
      })
      .filter((p) => p.distanceKm !== null && p.distanceKm <= maxDistanceKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.status(200).json({
      success: true,
      count: placesWithDistance.length,
      data: placesWithDistance,
      userLocation: { lat: userLat, lng: userLng }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby community places (Charities, NGOs, Shelters) (MODULE 3)
// @route   GET /api/recommendations/community-places
// @access  Public / Private
const getCommunityPlaces = async (req, res, next) => {
  try {
    const { lat, lng, radius = 25, organizationType, minCapacity } = req.query;

    let userLat = parseFloat(lat);
    let userLng = parseFloat(lng);

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
    const maxDistanceKm = parseFloat(radius) || 25;

    const query = { verificationStatus: 'Approved' };
    if (organizationType && organizationType !== 'all') {
      query.organizationType = organizationType;
    }
    if (minCapacity && !isNaN(Number(minCapacity))) {
      query.serviceCapacity = { $gte: Number(minCapacity) };
    }

    const charities = await Charity.find(query).populate('userId', 'name email phone');

    const charitiesWithDistance = charities
      .map((charity) => {
        const obj = charity.toObject();
        obj.distanceKm = calculateHaversineDistance(userCoords, charity.location?.coordinates);

        if (charity.location?.coordinates?.length === 2) {
          const [cLng, cLat] = charity.location.coordinates;
          obj.googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${cLat},${cLng}`;
        }
        return obj;
      })
      .filter((c) => c.distanceKm !== null && c.distanceKm <= maxDistanceKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.status(200).json({
      success: true,
      count: charitiesWithDistance.length,
      data: charitiesWithDistance,
      userLocation: { lat: userLat, lng: userLng }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get combined nearby recommendations
// @route   GET /api/recommendations/nearby
// @access  Public / Private
const getCombinedNearby = async (req, res, next) => {
  try {
    const { lat, lng, radius = 25 } = req.query;

    let userLat = parseFloat(lat);
    let userLng = parseFloat(lng);

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
    const maxDistanceKm = parseFloat(radius) || 25;

    const [charities, publicPlaces] = await Promise.all([
      Charity.find({ verificationStatus: 'Approved' }).populate('userId', 'name email phone'),
      PublicPlace.find({ verificationStatus: 'Verified' })
    ]);

    const communityItems = charities
      .map((c) => {
        const obj = c.toObject();
        obj.recommendationType = 'COMMUNITY_ORGANIZATION';
        obj.distanceKm = calculateHaversineDistance(userCoords, c.location?.coordinates);
        return obj;
      })
      .filter((c) => c.distanceKm !== null && c.distanceKm <= maxDistanceKm);

    const publicItems = publicPlaces
      .map((p) => {
        const obj = p.toObject();
        obj.recommendationType = 'PUBLIC_DISTRIBUTION_POINT';
        obj.distanceKm = calculateHaversineDistance(userCoords, p.location?.coordinates);
        return obj;
      })
      .filter((p) => p.distanceKm !== null && p.distanceKm <= maxDistanceKm);

    const combined = [...communityItems, ...publicItems].sort(
      (a, b) => a.distanceKm - b.distanceKm
    );

    res.status(200).json({
      success: true,
      count: combined.length,
      data: combined,
      userLocation: { lat: userLat, lng: userLng }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicPlaces,
  getCommunityPlaces,
  getCombinedNearby
};
