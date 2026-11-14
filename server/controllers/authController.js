const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @desc    Register a new customer or vendor
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, storeName, storeDescription } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.'
      });
    }

    // Security check: NEVER allow users to register directly as admin!
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Administrator registration is restricted and cannot be performed via public signup.'
      });
    }

    const assignedRole = role === 'vendor' ? 'vendor' : 'customer';

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    // Build user data
    const userData = {
      name,
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      role: assignedRole
    };

    if (assignedRole === 'vendor') {
      userData.vendorProfile = {
        storeName: storeName || `${name}'s Store`,
        storeDescription: storeDescription || 'Quality goods marketplace vendor',
        status: 'pending', // Vendor accounts require admin approval!
        contactDetails: {
          phone: phone || '',
          email: email.toLowerCase().trim()
        }
      };
    }

    const user = await User.create(userData);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message:
        assignedRole === 'vendor'
          ? 'Vendor account registered successfully. Your store is currently pending administrator approval.'
          : 'Account created successfully! Welcome to the marketplace.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        vendorProfile: user.vendorProfile,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by an administrator.'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        vendorProfile: user.vendorProfile,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, addresses, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (addresses) user.addresses = addresses;

    // Optional password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please enter your current password to set a new password.'
        });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect.'
        });
      }
      user.password = newPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        vendorProfile: user.vendorProfile,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulated Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user account found with that email address.'
      });
    }

    // In a production app, we would send an email with a secure token.
    // For internship/demo, we return a simulated success message and one-time verification token.
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email (simulated). You may now set a new password using the simulated reset code: RESET-2026',
      resetCode: 'RESET-2026'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulated Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email and new password.' });
    }

    if (resetCode !== 'RESET-2026') {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset code.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product in wishlist
// @route   POST /api/auth/wishlist/:productId
// @access  Private
const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    const isAlreadyWishlisted = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (isAlreadyWishlisted) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('wishlist');

    res.status(200).json({
      success: true,
      message: isAlreadyWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  toggleWishlist
};
