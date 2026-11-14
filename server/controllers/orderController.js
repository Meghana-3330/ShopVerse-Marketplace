const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const { emitToUser, emitToVendor, emitToAdmin, emitToAll } = require('../socket');

// @desc    Create new multi-vendor order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, customerInfo, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items to place an order.'
      });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete delivery address details.'
      });
    }

    let calculatedSubtotal = 0;
    const validatedOrderItems = [];
    const productsToUpdate = [];

    // Step 1: Validate all products, verify stock, recalculate DB prices, associate vendors
    for (const item of items) {
      const productId = item.productId || item._id || item.product;
      const rawQty = parseInt(item.quantity, 10);

      if (isNaN(rawQty) || rawQty <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Item quantity must be a positive integer greater than zero.'
        });
      }
      const quantity = rawQty;

      const product = await Product.findById(productId).populate('vendor', 'name vendorProfile');

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} is no longer available.`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" is currently inactive and cannot be purchased.`
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available (you requested ${quantity}).`
        });
      }

      // Security: use real product.price from database, NEVER the price sent from client!
      const itemSubtotal = product.price * quantity;
      calculatedSubtotal += itemSubtotal;

      validatedOrderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        vendor: product.vendor._id || product.vendor,
        vendorStoreName: product.vendor?.vendorProfile?.storeName || product.vendorStoreName || 'Marketplace Vendor',
        itemStatus: 'pending'
      });

      productsToUpdate.push({
        product,
        quantityToDeduct: quantity
      });
    }

    // Step 2: Calculate delivery and grand total
    // Free delivery on orders above ₹1,000, otherwise flat ₹99
    const deliveryCharge = calculatedSubtotal >= 1000 ? 0 : 99;
    const grandTotal = calculatedSubtotal + deliveryCharge;

    // Step 3: Decrement stock in database
    for (const entry of productsToUpdate) {
      entry.product.stock -= entry.quantityToDeduct;
      await entry.product.save();
    }

    // Step 4: Generate unique order number
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `ORD-${datePrefix}-${randomSuffix}`;

    // Step 5: Simulated payment record
    const isPaid = paymentMethod !== 'cod';
    const paymentResult = {
      id: `SIM-TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: isPaid ? 'succeeded' : 'pending',
      update_time: new Date().toISOString(),
      simulated: true
    };

    // Step 6: Create order document
    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      customerInfo: {
        name: customerInfo?.name || req.user.name,
        email: customerInfo?.email || req.user.email,
        phone: customerInfo?.phone || req.user.phone || 'N/A'
      },
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode
      },
      items: validatedOrderItems,
      subtotal: calculatedSubtotal,
      deliveryCharge,
      grandTotal,
      orderStatus: 'confirmed',
      paymentMethod: paymentMethod || 'simulated_card',
      paymentStatus: isPaid ? 'paid' : 'pending',
      paymentResult
    });

    // Step 7: Push Real-Time Notifications & Socket.IO Events
    try {
      // 7a. Group items by vendor to notify each vendor individually
      const vendorMap = {};
      validatedOrderItems.forEach((item) => {
        const vId = item.vendor.toString();
        if (!vendorMap[vId]) {
          vendorMap[vId] = [];
        }
        vendorMap[vId].push(item);
      });

      for (const [vendorId, vItems] of Object.entries(vendorMap)) {
        const vTotal = vItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
        const vendorNotif = await Notification.create({
          recipient: vendorId,
          sender: req.user._id,
          title: 'New Order Received',
          message: `Order #${order.orderNumber} received for ${vItems.length} item(s) (₹${vTotal.toLocaleString()}).`,
          type: 'new_order',
          link: '/vendor/orders',
          data: { orderId: order._id, orderNumber: order.orderNumber, total: vTotal }
        });

        emitToVendor(vendorId, 'new_order', {
          orderId: order._id,
          orderNumber: order.orderNumber,
          items: vItems,
          total: vTotal,
          createdAt: order.createdAt,
          notification: vendorNotif
        });
      }

      // 7b. Notify customer
      const custNotif = await Notification.create({
        recipient: req.user._id,
        title: 'Order Confirmed',
        message: `Your order #${order.orderNumber} for ₹${grandTotal.toLocaleString()} has been placed successfully.`,
        type: 'order_status',
        link: `/customer/orders/${order._id}`,
        data: { orderId: order._id, orderNumber: order.orderNumber, status: 'confirmed' }
      });

      emitToUser(req.user._id, 'order_status_update', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: 'confirmed',
        order,
        notification: custNotif
      });

      // 7c. Notify admin
      emitToAdmin('admin_order_alert', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        grandTotal,
        customerName: req.user.name,
        createdAt: order.createdAt
      });

      // 7d. Broadcast stock updates
      for (const entry of productsToUpdate) {
        emitToAll('stock_update', {
          productId: entry.product._id,
          newStock: entry.product.stock
        });
      }
    } catch (notifErr) {
      console.error('Real-time notification dispatch error:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Thank you for shopping with us.',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in customer's orders
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images category');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images category sku');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Role-based visibility check:
    // 1. Admin can see the complete order.
    // 2. Customer can only see their own order.
    // 3. Vendor can see ONLY items that belong to them (filtered order view).
    if (req.user.role === 'admin') {
      return res.status(200).json({
        success: true,
        order
      });
    }

    if (req.user.role === 'customer') {
      if (order.customer._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You are not authorized to view this order.'
        });
      }
      return res.status(200).json({
        success: true,
        order
      });
    }

    if (req.user.role === 'vendor') {
      const vendorIdStr = req.user._id.toString();
      const vendorItems = order.items.filter(
        (item) => item.vendor.toString() === vendorIdStr
      );

      if (vendorItems.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: This order does not contain products from your store.'
        });
      }

      // Calculate vendor-specific subtotal
      const vendorSubtotal = vendorItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Return vendor-sanitized order view (never expose items from other vendors!)
      return res.status(200).json({
        success: true,
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          createdAt: order.createdAt,
          customerInfo: order.customerInfo,
          shippingAddress: order.shippingAddress,
          items: vendorItems,
          vendorSubtotal,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus
        }
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
