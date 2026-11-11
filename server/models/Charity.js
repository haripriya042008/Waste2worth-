const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    organizationName: {
      type: String,
      required: [true, 'Please provide an organization name'],
      trim: true
    },
    organizationType: {
      type: String,
      enum: [
        'NGO',
        'Shelter',
        'Orphanage',
        'Community Kitchen',
        'Food Bank',
        'Old Age Home',
        'Relief Organization',
        'Other'
      ],
      required: [true, 'Please specify organization type']
    },
    description: {
      type: String,
      trim: true
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    verificationDocuments: [
      {
        type: String // File paths or document identifiers
      }
    ],
    rejectionReason: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      required: [true, 'Please provide organization physical address']
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
    serviceCapacity: {
      type: Number,
      default: 100, // Maximum daily food portions handled
      min: 0
    },
    peopleServed: {
      type: Number,
      default: 50, // Average daily beneficiaries
      min: 0
    },
    operatingHours: {
      type: String,
      default: '9:00 AM - 6:00 PM'
    },
    contactPhone: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

charitySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Charity', charitySchema);
