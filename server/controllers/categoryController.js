const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories with active product counts
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });

    // Update item counts dynamically from active products in database
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({
          category: { $regex: new RegExp(`^${cat.name}$`, 'i') },
          isActive: true
        });
        return {
          ...cat.toObject(),
          itemCount: count
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories
};
