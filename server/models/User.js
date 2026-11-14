const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    role: {
      type: String,
      enum: ['customer', 'vendor', 'admin'],
      default: 'customer'
    },
    vendorProfile: {
      storeName: { type: String, trim: true, default: '' },
      storeDescription: { type: String, trim: true, default: '' },
      storeLogo: {
        type: String,
        default: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&auto=format&fit=crop&q=60'
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending'
      },
      contactDetails: {
        phone: { type: String, default: '' },
        email: { type: String, default: '' },
        address: { type: String, default: '' }
      }
    },
    addresses: [addressSchema],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    isSuspended: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
