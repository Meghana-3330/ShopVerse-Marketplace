const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide product description']
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be a positive number']
    },
    originalPrice: {
      type: Number,
      default: function () {
        return this.price;
      }
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      trim: true
    },
    brand: {
      type: String,
      trim: true,
      default: 'Generic'
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one product image'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Product must have at least one image'
      }
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vendorStoreName: {
      type: String,
      default: 'Marketplace Vendor'
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    numReviews: {
      type: Number,
      default: 12
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isTrending: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: false
    },
    isBestSeller: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Calculate discount percentage before validate and save if originalPrice is higher
productSchema.pre('validate', function (next) {
  if (this.price !== undefined) {
    if (this.originalPrice && this.originalPrice > this.price) {
      this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    } else {
      if (!this.originalPrice || this.originalPrice < this.price) {
        this.originalPrice = this.price;
      }
      this.discount = 0;
    }
  }
  next();
});

productSchema.pre('save', function (next) {
  if (this.originalPrice > this.price && this.originalPrice > 0) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  } else if (!this.originalPrice || this.originalPrice < this.price) {
    this.originalPrice = this.price;
    this.discount = 0;
  }
  next();
});

// Index for search & filtering
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1, vendor: 1 });

module.exports = mongoose.model('Product', productSchema);
