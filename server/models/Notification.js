const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    notificationType: {
      type: String,
      enum: [
        'donation_created',
        'donation_accepted',
        'donation_rejected',
        'pickup_scheduled',
        'donation_collected',
        'donation_completed',
        'donation_cancelled',
        'new_user',
        'charity_verification',
        'system'
      ],
      default: 'system'
    },
    relatedDonationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
