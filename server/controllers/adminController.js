const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { emitToUser, emitToVendor, emitToAdmin } = require('../socket');

// @desc    Get Administrator Dashboard Overview & Analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalCustomers,
      totalVendors,
      pendingVendors,
      totalProducts,
      totalOrders,
      allOrders
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'vendor' }),
      User.countDocuments({ role: 'vendor', 'vendorProfile.status': 'pending' }),
      Product.countDocuments({}),
      Order.countDocuments({}),
      Order.find({}).sort({ createdAt: -1 })
    ]);

    // Calculate marketplace financial metrics from database records
    let totalRevenue = 0;
    let completedOrders = 0;
    const salesByDateMap = {};

    allOrders.forEach((order) => {
      if (order.paymentStatus === 'paid') {
        totalRevenue += order.grandTotal;
      }
      if (order.orderStatus === 'delivered') {
        completedOrders += 1;
      }

      const dateLabel = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      if (!salesByDateMap[dateLabel]) {
        salesByDateMap[dateLabel] = { date: dateLabel, revenue: 0, orders: 0 };
      }
      salesByDateMap[dateLabel].revenue += order.grandTotal;
      salesByDateMap[dateLabel].orders += 1;
    });

    const revenueChart = Object.values(salesByDateMap).slice(-10);

    // Recent 6 orders
    const recentOrders = allOrders.slice(0, 6);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalCustomers,
        totalVendors,
        pendingVendors,
        totalProducts,
        totalOrders,
        completedOrders
      },
      revenueChart,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (customers and vendors)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * pageSize;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNum,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user account suspension
// @route   PATCH /api/admin/users/:id/suspend
// @access  Private (Admin)
const toggleUserSuspension = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot suspend administrator accounts.'
      });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isSuspended ? 'suspended' : 'reactivated'}.`,
      isSuspended: user.isSuspended
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vendors and applications
// @route   GET /api/admin/vendors
// @access  Private (Admin)
const getAllVendors = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = { role: 'vendor' };

    if (status && status !== 'all') {
      query['vendorProfile.status'] = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { 'vendorProfile.storeName': { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const vendors = await User.find(query).select('-password').sort({ createdAt: -1 });

    // Fetch product counts for each vendor
    const vendorsWithStats = await Promise.all(
      vendors.map(async (v) => {
        const productCount = await Product.countDocuments({ vendor: v._id });
        return {
          ...v.toObject(),
          productCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: vendorsWithStats.length,
      vendors: vendorsWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve, reject, or suspend vendor application
// @route   PATCH /api/admin/vendors/:id/status
// @access  Private (Admin)
const updateVendorStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['approved', 'rejected', 'suspended', 'pending'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Permitted: ${allowedStatuses.join(', ')}`
      });
    }

    const vendor = await User.findOne({ _id: req.params.id, role: 'vendor' });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }

    vendor.vendorProfile.status = status;
    await vendor.save();

    // Push notification to vendor
    try {
      const vNotif = await Notification.create({
        recipient: vendor._id,
        sender: req.user._id,
        title: `Vendor Account ${status.toUpperCase()}`,
        message: `Your vendor account status for "${vendor.vendorProfile?.storeName || 'Store'}" is now "${status.toUpperCase()}".`,
        type: 'vendor_approval',
        link: '/vendor/dashboard',
        data: { status }
      });

      emitToUser(vendor._id, 'vendor_status_update', {
        status,
        vendorProfile: vendor.vendorProfile,
        notification: vNotif
      });
    } catch (notifErr) {
      console.error('Vendor status notification error:', notifErr.message);
    }

    res.status(200).json({
      success: true,
      message: `Vendor status successfully updated to "${status}".`,
      vendorProfile: vendor.vendorProfile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products across marketplace
// @route   GET /api/admin/products
// @access  Private (Admin)
const getAllProducts = async (req, res, next) => {
  try {
    const { search, category, vendor, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (vendor) {
      query.vendor = vendor;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('vendor', 'name vendorProfile email')
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

// @desc    Toggle product active status (deactivate inappropriate products)
// @route   PATCH /api/admin/products/:id/status
// @access  Private (Admin)
const toggleProductStatus = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product "${product.name}" is now ${product.isActive ? 'Active' : 'Deactivated'}.`,
      isActive: product.isActive
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders across marketplace
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search.trim(), $options: 'i' } },
        { 'customerInfo.name': { $regex: search.trim(), $options: 'i' } },
        { 'customerInfo.email': { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * pageSize;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('items.vendor', 'name vendorProfile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNum,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update global order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Permitted: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.orderStatus = status;

    // Also update all items if order is cancelled or delivered
    if (status === 'cancelled' || status === 'delivered') {
      order.items.forEach((item) => {
        item.itemStatus = status;
      });
    }

    await order.save();

    // Push real-time status update to customer and affected vendors
    try {
      const custNotif = await Notification.create({
        recipient: order.customer,
        sender: req.user._id,
        title: `Order Status: ${status.toUpperCase()}`,
        message: `Your order #${order.orderNumber} status has been updated to "${status.toUpperCase()}" by Marketplace Admin.`,
        type: 'order_status',
        link: `/customer/orders/${order._id}`,
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          orderStatus: status
        }
      });

      emitToUser(order.customer, 'order_status_update', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        orderStatus: status,
        order,
        notification: custNotif
      });

      // Notify each distinct vendor in the order
      const vendorIds = [...new Set(order.items.map((i) => i.vendor?.toString()).filter(Boolean))];
      for (const vId of vendorIds) {
        emitToVendor(vId, 'order_status_update', {
          orderId: order._id,
          orderNumber: order.orderNumber,
          orderStatus: status,
          message: `Admin updated order #${order.orderNumber} to ${status}`
        });
      }
    } catch (notifErr) {
      console.error('Admin order status notification error:', notifErr.message);
    }

    res.status(200).json({
      success: true,
      message: `Order #${order.orderNumber} status updated to "${status}".`,
      order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  toggleUserSuspension,
  getAllVendors,
  updateVendorStatus,
  getAllProducts,
  toggleProductStatus,
  getAllOrders,
  updateOrderStatus
};
