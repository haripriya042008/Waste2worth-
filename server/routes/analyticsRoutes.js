const express = require('express');
const router = express.Router();
const {
  getAdminAnalytics,
  getDonorAnalytics,
  getCharityAnalytics
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/admin', protect, authorize('admin'), getAdminAnalytics);
router.get('/donor', protect, authorize('donor', 'admin'), getDonorAnalytics);
router.get('/charity', protect, authorize('charity', 'admin'), getCharityAnalytics);

module.exports = router;
