const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    charityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Charity',
      default: null
    },
    foodName: {
      type: String,
      required: [true, 'Please provide food name or item details'],
      trim: true
    },
    foodCategory: {
      type: String,
      enum: [
        'Cooked Meals',
        'Bakery & Bread',
        'Fresh Produce (Fruits & Vegetables)',
        'Dairy & Beverages',
        'Packaged & Canned Goods',
        'Grains & Cereals',
        'Snacks & Sweets',
        'Raw Meat/Fish',
        'Other'
      ],
      required: [true, 'Please select a food category']
    },
    foodType: {
      type: String,
      enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggitarian', 'Mixed/Other'],
      required: [true, 'Please specify food type']
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify available quantity'],
      min: [0.1, 'Quantity must be greater than zero']
    },
    quantityUnit: {
      type: String,
      enum: ['kg', 'grams', 'litres', 'packets', 'servings'],
      required: [true, 'Please select quantity unit']
    },
    estimatedServings: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      trim: true
    },
    foodImages: [
      {
        type: String
      }
    ],
    preparationDate: {
      type: Date
    },
    expiryDate: {
      type: Date,
      required: [true, 'Please provide consumption deadline or expiry date']
    },
    pickupAddress: {
      type: String,
      required: [true, 'Please specify pickup address'],
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
    pickupAvailability: {
      type: String,
      required: [true, 'Please specify pickup availability window'],
      trim: true
    },
    specialInstructions: {
      type: String,
      trim: true
    },
    donationStatus: {
      type: String,
      enum: ['Available', 'Accepted', 'Collected', 'Completed', 'Rejected', 'Cancelled', 'Expired'],
      default: 'Available'
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    acceptedAt: {
      type: Date
    },
    collectedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

donationSchema.index({ location: '2dsphere' });
donationSchema.index({ donationStatus: 1, createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);
