const express = require('express');
const router = express.Router();
const {
  getPublicPlaces,
  getCommunityPlaces,
  getCombinedNearby
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/nearby', getCombinedNearby);
router.get('/public-places', getPublicPlaces);
router.get('/community-places', getCommunityPlaces);

module.exports = router;
