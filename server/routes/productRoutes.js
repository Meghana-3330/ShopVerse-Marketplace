const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductHighlights,
  addProductReview,
  getSearchSuggestions
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.get('/collections/highlights', getProductHighlights);
router.get('/suggestions', getSearchSuggestions);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, addProductReview);

module.exports = router;
