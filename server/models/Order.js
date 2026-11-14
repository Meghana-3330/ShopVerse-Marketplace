const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendorStoreName: { type: String, default: 'Vendor Store' },
  itemStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true }
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryCharge: {
      type: Number,
      required: true,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['simulated_card', 'simulated_upi', 'cod'],
      default: 'simulated_card'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'paid'
    },
    paymentResult: {
      id: { type: String },
      status: { type: String, default: 'succeeded' },
      update_time: { type: String },
      simulated: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true
  }
);

// Indexes
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ 'items.vendor': 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
