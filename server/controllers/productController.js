const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Get all products with filtering, search, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      vendor,
      minPrice,
      maxPrice,
      minRating,
      minDiscount,
      inStock,
      sort,
      page = 1,
      limit = 12,
      featured,
      trending,
      newArrival,
      bestSeller
    } = req.query;

    const query = { isActive: true };

    // Search keyword in name, description, brand
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { brand: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All' && category !== '') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Brand filter (supports comma-separated)
    if (brand && brand !== 'All' && brand !== '') {
      const brands = brand.split(',').map((b) => b.trim()).filter(Boolean);
      if (brands.length === 1) {
        query.brand = { $regex: new RegExp(`^${brands[0]}$`, 'i') };
      } else if (brands.length > 1) {
        query.brand = { $in: brands.map((b) => new RegExp(`^${b}$`, 'i')) };
      }
    }

    // Vendor filter
    if (vendor) {
      query.vendor = vendor;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Rating filter
    if (minRating !== undefined && minRating !== '') {
      query.rating = { $gte: Number(minRating) };
    }

    // Discount filter
    if (minDiscount !== undefined && minDiscount !== '') {
      query.discount = { $gte: Number(minDiscount) };
    }

    // Stock availability
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Badges / Flags
    if (featured === 'true') query.isFeatured = true;
    if (trending === 'true') query.isTrending = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (bestSeller === 'true') query.isBestSeller = true;

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'discount') {
      sortOption = { discount: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('vendor', 'name vendorProfile')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNum,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'vendor',
      'name vendorProfile email phone'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Fetch product reviews
    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });

    // Fetch related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4);

    res.status(200).json({
      success: true,
      product,
      reviews,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get special collections for home page
// @route   GET /api/products/collections/highlights
// @access  Public
const getProductHighlights = async (req, res, next) => {
  try {
    const [featured, trending, newArrivals, bestSellers] = await Promise.all([
      Product.find({ isActive: true, isFeatured: true }).populate('vendor', 'name vendorProfile').limit(8),
      Product.find({ isActive: true, isTrending: true }).populate('vendor', 'name vendorProfile').limit(8),
      Product.find({ isActive: true, isNewArrival: true }).populate('vendor', 'name vendorProfile').limit(8),
      Product.find({ isActive: true, isBestSeller: true }).populate('vendor', 'name vendorProfile').limit(8)
    ]);

    res.status(200).json({
      success: true,
      featured,
      trending,
      newArrivals,
      bestSellers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
// @access  Private (Customer)
const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({ product: productId, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this product.'
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment
    });

    // Recalculate average rating
    const allReviews = await Review.find({ product: productId });
    const avgRating =
      allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;

    product.rating = parseFloat(avgRating.toFixed(1));
    product.numReviews = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully.',
      review,
      productRating: product.rating,
      numReviews: product.numReviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get live search suggestions (products, brands, categories)
// @route   GET /api/products/suggestions
// @access  Public
const getSearchSuggestions = async (req, res, next) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    if (!q) {
      // Return popular or trending suggestions
      const popularProducts = await Product.find({ isActive: true })
        .select('name category price images brand')
        .sort({ rating: -1 })
        .limit(6);

      const categories = await Product.distinct('category', { isActive: true });
      const brands = await Product.distinct('brand', { isActive: true });

      return res.status(200).json({
        success: true,
        suggestions: {
          products: popularProducts,
          categories: categories.slice(0, 5),
          brands: brands.filter((b) => b && b !== 'Generic').slice(0, 5)
        }
      });
    }

    const regex = new RegExp(q, 'i');

    const [matchedProducts, categories, brands] = await Promise.all([
      Product.find({
        isActive: true,
        $or: [{ name: regex }, { brand: regex }, { category: regex }]
      })
        .select('name category price originalPrice discount images brand vendorStoreName')
        .limit(6),
      Product.distinct('category', { isActive: true, category: regex }),
      Product.distinct('brand', { isActive: true, brand: regex })
    ]);

    res.status(200).json({
      success: true,
      suggestions: {
        products: matchedProducts,
        categories: categories.slice(0, 4),
        brands: brands.filter((b) => b && b !== 'Generic').slice(0, 4)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductHighlights,
  addProductReview,
  getSearchSuggestions
};
