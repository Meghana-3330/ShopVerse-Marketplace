const express = require('express');
const router = express.Router();
const {
  getVendorDashboard,
  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  getVendorOrders,
  updateVendorOrderItemStatus,
  getVendorProfile,
  updateVendorProfile
} = require('../controllers/vendorController');
const { protect, authorize, checkVendorApproved } = require('../middleware/auth');

// All vendor routes require authentication and vendor role
router.use(protect);
router.use(authorize('vendor'));

router.get('/dashboard', getVendorDashboard);
router.get('/profile', getVendorProfile);
router.put('/profile', updateVendorProfile);

// Order fulfillment for vendor's products
router.get('/orders', getVendorOrders);
router.patch('/orders/:orderId/items/:itemId/status', updateVendorOrderItemStatus);

// Product management (creating & updating inventory requires approved vendor status!)
router.get('/products', getVendorProducts);
router.post('/products', checkVendorApproved, createVendorProduct);
router.put('/products/:id', checkVendorApproved, updateVendorProduct);
router.delete('/products/:id', checkVendorApproved, deleteVendorProduct);

module.exports = router;
