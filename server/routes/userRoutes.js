const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserStatus
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id/status', protect, authorize('admin'), updateUserStatus);

module.exports = router;
