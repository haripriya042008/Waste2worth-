const express = require('express');
const router = express.Router();
const {
  createPublicPlace,
  getPublicPlaces,
  updatePublicPlace,
  deletePublicPlace
} = require('../controllers/publicPlaceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('admin'), createPublicPlace)
  .get(getPublicPlaces);

router.route('/:id')
  .put(protect, authorize('admin'), updatePublicPlace)
  .delete(protect, authorize('admin'), deletePublicPlace);

module.exports = router;
