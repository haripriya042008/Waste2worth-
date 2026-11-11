const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['admin', 'donor', 'charity'],
      default: 'donor'
    },
    donorCategory: {
      type: String,
      enum: [
        'Individual / Household',
        'Restaurant',
        'Hotel',
        'Event Organizer',
        'Bakery',
        'Supermarket',
        'Corporate / Office',
        'Other'
      ],
      default: 'Individual / Household'
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
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
        default: [77.5946, 12.9716] // Default Bangalore
      }
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'deactivated'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Geospatial index for nearby searches
userSchema.index({ location: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
