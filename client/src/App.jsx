import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import ToastContainer from './components/common/ToastContainer';

// Public Pages
import HomePage from './pages/public/HomePage';
import ProductListingPage from './pages/public/ProductListingPage';
import ProductDetailsPage from './pages/public/ProductDetailsPage';
import CategoriesPage from './pages/public/CategoriesPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import CustomerLoginPage from './pages/public/CustomerLoginPage';
import CustomerRegisterPage from './pages/public/CustomerRegisterPage';
import VendorRegisterPage from './pages/public/VendorRegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';

// Customer Pages
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import OrderDetailsPage from './pages/customer/OrderDetailsPage';
import WishlistPage from './pages/customer/WishlistPage';
import ProfilePage from './pages/customer/ProfilePage';

// Vendor Pages
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import AddProductPage from './pages/vendor/AddProductPage';
import ManageProductsPage from './pages/vendor/ManageProductsPage';
import EditProductPage from './pages/vendor/EditProductPage';
import VendorOrdersPage from './pages/vendor/VendorOrdersPage';
import VendorStoreProfilePage from './pages/vendor/VendorStoreProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageVendorsPage from './pages/admin/ManageVendorsPage';
import ManageAllProductsPage from './pages/admin/ManageAllProductsPage';
import ManageAllOrdersPage from './pages/admin/ManageAllOrdersPage';

const NotFoundPage = () => (
  <div className="container page-wrapper" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
    <h1 style={{ fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>404</h1>
    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Page Not Found</h2>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
      The page you're searching for does not exist or may have been moved.
    </p>
    <Link to="/" className="btn btn-primary">
      Return to Marketplace Storefront
    </Link>
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<CustomerLoginPage />} />
        <Route path="/register" element={<CustomerRegisterPage />} />
        <Route path="/vendor/register" element={<VendorRegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Customer Protected Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}>
              <CustomerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/orders"
          element={
            <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/orders/:id"
          element={
            <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/wishlist"
          element={
            <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/profile"
          element={
            <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Vendor Protected Routes */}
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['vendor', 'admin']}>
              <VendorDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/add-product"
          element={
            <ProtectedRoute allowedRoles={['vendor', 'admin']}>
              <AddProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/products"
          element={
            <ProtectedRoute allowedRoles={['vendor', 'admin']}>
              <ManageProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/products/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['vendor', 'admin']}>
              <EditProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/orders"
          element={
            <ProtectedRoute allowedRoles={['vendor', 'admin']}>
              <VendorOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/profile"
          element={
            <ProtectedRoute allowedRoles={['vendor', 'admin']}>
              <VendorStoreProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vendors"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageVendorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageAllProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageAllOrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
