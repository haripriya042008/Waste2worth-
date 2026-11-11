const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/my-donations', protect, authorize('donor', 'admin'), getMyDonations);
router.get('/available', protect, authorize('charity', 'admin'), getAvailableDonations);

router
  .route('/')
  .post(protect, authorize('donor', 'admin'), upload.array('images', 5), createDonation)
  .get(getDonations);

router
  .route('/:id')
  .get(getDonationById)
  .put(protect, upload.array('images', 5), updateDonation)
  .delete(protect, cancelDonation);

router.post('/:id/accept', protect, authorize('charity', 'admin'), acceptDonation);
router.post('/:id/reject', protect, authorize('charity', 'admin'), rejectDonation);
router.put('/:id/collect', protect, authorize('charity', 'admin'), collectDonation);
router.put('/:id/complete', protect, authorize('charity', 'admin'), completeDonation);

module.exports = router;
