const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { emitToUser, emitToAdmin, emitToAll } = require('../socket');

// @desc    Get Vendor Dashboard Analytics & Statistics
// @route   GET /api/vendor/dashboard
// @access  Private (Vendor)
const getVendorDashboard = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    // 1. Product statistics
    const [totalProducts, activeProducts, outOfStockProducts, lowStockProducts] = await Promise.all([
      Product.countDocuments({ vendor: vendorId }),
      Product.countDocuments({ vendor: vendorId, isActive: true }),
      Product.countDocuments({ vendor: vendorId, stock: 0 }),
      Product.countDocuments({ vendor: vendorId, stock: { $gt: 0, $lte: 5 } })
    ]);

    // 2. Orders containing vendor products
    const vendorOrders = await Order.find({ 'items.vendor': vendorId })
      .sort({ createdAt: -1 })
      .populate('customer', 'name email phone');

    // Filter order items to only this vendor and calculate total revenue & units sold
    let totalRevenue = 0;
    let totalItemsSold = 0;
    let pendingFulfillments = 0;

    const monthlySalesMap = {};

    vendorOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      order.items.forEach((item) => {
        if (item.vendor.toString() === vendorId.toString()) {
          const itemSales = item.price * item.quantity;
          totalRevenue += itemSales;
          totalItemsSold += item.quantity;

          if (item.itemStatus === 'pending' || item.itemStatus === 'processing') {
            pendingFulfillments += 1;
          }

          if (!monthlySalesMap[orderDate]) {
            monthlySalesMap[orderDate] = { date: orderDate, sales: 0, orders: 0 };
          }
          monthlySalesMap[orderDate].sales += itemSales;
          monthlySalesMap[orderDate].orders += 1;
        }
      });
    });

    // Format chart data (chronological order)
    const salesChart = Object.values(monthlySalesMap).slice(-7);

    // Sanitize recent 5 orders for display
    const recentOrders = vendorOrders.slice(0, 5).map((order) => {
      const myItems = order.items.filter(
        (i) => i.vendor.toString() === vendorId.toString()
      );
      const mySubtotal = myItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        customerName: order.customerInfo?.name || order.customer?.name || 'Customer',
        customerPhone: order.customerInfo?.phone || 'N/A',
        shippingAddress: order.shippingAddress,
        itemsCount: myItems.length,
        items: myItems,
        vendorSubtotal: mySubtotal,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      };
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        lowStockProducts,
        inStockProducts: Math.max(0, totalProducts - outOfStockProducts),
        totalOrders: vendorOrders.length,
        totalRevenue,
        totalItemsSold,
        pendingFulfillments,
        storeStatus: req.user.vendorProfile?.status || 'pending',
        storeName: req.user.vendorProfile?.storeName || 'My Store'
      },
      salesChart,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products belonging to current vendor
// @route   GET /api/vendor/products
// @access  Private (Vendor)
const getVendorProducts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const query = { vendor: req.user._id };

    if (search) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNum,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product by vendor
// @route   POST /api/vendor/products
// @access  Private (Vendor - Approved)
const createVendorProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      sku,
      stock,
      images,
      isFeatured,
      isTrending
    } = req.body;

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required product details (name, description, price, category, stock).'
      });
    }

    // Default image if none provided
    const productImages =
      images && Array.isArray(images) && images.length > 0
        ? images
        : [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60'
          ];

    // Generate unique SKU if not provided
    const productSku =
      sku && sku.trim() !== ''
        ? sku.trim().toUpperCase()
        : `SKU-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      category,
      brand: brand || 'Generic',
      sku: productSku,
      stock: Number(stock),
      images: productImages,
      vendor: req.user._id,
      vendorStoreName: req.user.vendorProfile?.storeName || `${req.user.name}'s Store`,
      isFeatured: !!isFeatured,
      isTrending: !!isTrending,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Product created and listed successfully!',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vendor's product
// @route   PUT /api/vendor/products/:id
// @access  Private (Vendor - Approved)
const updateVendorProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // SECURITY CHECK: Ensure vendor owns this product
    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit products belonging to your store.'
      });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      sku,
      stock,
      images,
      isActive,
      isFeatured,
      isTrending
    } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (category) product.category = category;
    if (brand !== undefined) product.brand = brand;
    if (sku) product.sku = sku.toUpperCase();
    if (stock !== undefined) product.stock = Number(stock);
    if (images && Array.isArray(images) && images.length > 0) product.images = images;
    if (isActive !== undefined) product.isActive = isActive;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isTrending !== undefined) product.isTrending = isTrending;

    await product.save();

    if (stock !== undefined) {
      emitToAll('stock_update', {
        productId: product._id,
        newStock: product.stock
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or deactivate vendor's product
// @route   DELETE /api/vendor/products/:id
// @access  Private (Vendor)
const deleteVendorProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // SECURITY CHECK: Verify ownership
    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete products belonging to your store.'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted from marketplace inventory.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders containing vendor's products
// @route   GET /api/vendor/orders
// @access  Private (Vendor)
const getVendorOrders = async (req, res, next) => {
  try {
    const vendorId = req.user._id.toString();

    const orders = await Order.find({ 'items.vendor': req.user._id })
      .sort({ createdAt: -1 })
      .populate('customer', 'name email phone');

    // Filter order items so vendor ONLY sees their own items and fulfillment info
    const sanitizedOrders = orders.map((order) => {
      const myItems = order.items.filter((item) => item.vendor.toString() === vendorId);
      const mySubtotal = myItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        customerInfo: {
          name: order.customerInfo?.name || order.customer?.name || 'Customer',
          phone: order.customerInfo?.phone || order.customer?.phone || 'N/A',
          email: order.customerInfo?.email || order.customer?.email || 'N/A'
        },
        shippingAddress: order.shippingAddress,
        items: myItems,
        vendorSubtotal: mySubtotal,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        orderStatus: order.orderStatus
      };
    });

    res.status(200).json({
      success: true,
      count: sanitizedOrders.length,
      orders: sanitizedOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update fulfillment status of vendor's specific order item
// @route   PATCH /api/vendor/orders/:orderId/items/:itemId/status
// @access  Private (Vendor)
const updateVendorOrderItemStatus = async (req, res, next) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Permitted values: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Order item not found.' });
    }

    // SECURITY CHECK: Verify vendor owns this specific item
    if (item.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only update fulfillment status for items from your store.'
      });
    }

    item.itemStatus = status;

    // If all items in the order have reached a particular status, update global order status
    const allStatuses = order.items.map((i) => i.itemStatus);
    if (allStatuses.every((s) => s === 'delivered')) {
      order.orderStatus = 'delivered';
    } else if (allStatuses.some((s) => s === 'shipped')) {
      order.orderStatus = 'shipped';
    } else if (allStatuses.some((s) => s === 'processing')) {
      order.orderStatus = 'processing';
    }

    await order.save();

    // Push real-time status update to customer & admin
    try {
      const custNotif = await Notification.create({
        recipient: order.customer,
        sender: req.user._id,
        title: `Item Status Updated: ${status.toUpperCase()}`,
        message: `Your item "${item.name}" from order #${order.orderNumber} has been updated to "${status.toUpperCase()}".`,
        type: 'order_status',
        link: `/customer/orders/${order._id}`,
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          itemId: item._id,
          itemStatus: status,
          orderStatus: order.orderStatus
        }
      });

      emitToUser(order.customer, 'order_status_update', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        itemId: item._id,
        itemStatus: status,
        orderStatus: order.orderStatus,
        item,
        notification: custNotif
      });

      emitToAdmin('admin_order_alert', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        message: `Vendor ${req.user.vendorProfile?.storeName || 'Vendor'} updated item to ${status}`,
        orderStatus: order.orderStatus
      });
    } catch (notifErr) {
      console.error('Vendor order status notification error:', notifErr.message);
    }

    res.status(200).json({
      success: true,
      message: `Item status updated to ${status}.`,
      item,
      orderStatus: order.orderStatus
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor store profile
// @route   GET /api/vendor/profile
// @access  Private (Vendor)
const getVendorProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      vendorProfile: user.vendorProfile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vendor store profile
// @route   PUT /api/vendor/profile
// @access  Private (Vendor)
const updateVendorProfile = async (req, res, next) => {
  try {
    const { storeName, storeDescription, storeLogo, contactDetails } = req.body;
    const user = await User.findById(req.user._id);

    if (storeName) user.vendorProfile.storeName = storeName;
    if (storeDescription) user.vendorProfile.storeDescription = storeDescription;
    if (storeLogo) user.vendorProfile.storeLogo = storeLogo;
    if (contactDetails) {
      user.vendorProfile.contactDetails = {
        ...user.vendorProfile.contactDetails,
        ...contactDetails
      };
    }

    await user.save();

    // Also update vendorStoreName in all vendor's products
    if (storeName) {
      await Product.updateMany({ vendor: user._id }, { vendorStoreName: storeName });
    }

    res.status(200).json({
      success: true,
      message: 'Store profile updated successfully.',
      vendorProfile: user.vendorProfile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVendorDashboard,
  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  getVendorOrders,
  updateVendorOrderItemStatus,
  getVendorProfile,
  updateVendorProfile
};
