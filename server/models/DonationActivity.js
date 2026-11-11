const mongoose = require('mongoose');

const donationActivitySchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    activityType: {
      type: String,
      enum: ['CREATED', 'ACCEPTED', 'REJECTED', 'COLLECTED', 'COMPLETED', 'CANCELLED', 'UPDATED'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false
  }
);

module.exports = mongoose.model('DonationActivity', donationActivitySchema);
