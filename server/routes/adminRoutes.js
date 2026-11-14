const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllUsers,
  toggleUserSuspension,
  getAllVendors,
  updateVendorStatus,
  getAllProducts,
  toggleProductStatus,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboard);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/suspend', toggleUserSuspension);

// Vendor management
router.get('/vendors', getAllVendors);
router.patch('/vendors/:id/status', updateVendorStatus);

// Product management
router.get('/products', getAllProducts);
router.patch('/products/:id/status', toggleProductStatus);

// Order management
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

module.exports = router;
