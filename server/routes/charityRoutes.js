const express = require('express');
const router = express.Router();
const {
  getCharityProfile,
  updateCharityProfile,
  getAllCharities,
  getNearbyCharities,
  verifyCharity
} = require('../controllers/charityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/profile', protect, authorize('charity'), getCharityProfile);
router.put('/profile', protect, authorize('charity'), updateCharityProfile);
router.get('/nearby', protect, getNearbyCharities);
router.get('/', protect, getAllCharities);
router.put('/:id/verify', protect, authorize('admin'), verifyCharity);

module.exports = router;
