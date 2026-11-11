const mongoose = require('mongoose');

const publicPlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide place name'],
      trim: true
    },
    placeType: {
      type: String,
      enum: [
        'Community Center',
        'Public Distribution Point',
        'Community Kitchen',
        'Public Park',
        'Municipal Shelter',
        'Religious Place/Trust',
        'Transit Station Hub',
        'Other'
      ],
      required: [true, 'Please specify place type']
    },
    address: {
      type: String,
      required: [true, 'Please provide street address'],
      trim: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [77.5946, 12.9716]
      }
    },
    description: {
      type: String,
      trim: true
    },
    operatingHours: {
      type: String,
      default: '8:00 AM - 8:00 PM'
    },
    contactPerson: {
      type: String,
      trim: true
    },
    contactPhone: {
      type: String,
      trim: true
    },
    verificationStatus: {
      type: String,
      enum: ['Verified', 'Pending', 'Suspended'],
      default: 'Verified'
    }
  },
  {
    timestamps: true
  }
);

publicPlaceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('PublicPlace', publicPlaceSchema);
