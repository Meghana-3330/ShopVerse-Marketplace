import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Store,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import NotificationDropdown from './NotificationDropdown';
import axios from 'axios';

const ANNOUNCEMENT_MESSAGES = [
  '⚡ Free Express Delivery on orders over ₹1,000 across India',
  '🌿 Shop direct from verified independent artisans, designers & creators',
  '🔒 Secure checkout with instant simulated Card & UPI payments'
];

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isVendor } = useAuth();
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);

  const searchBoxRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Rotating Announcement Bar
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAnnouncement((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setShowSuggestions(false);
  }, [location.pathname]);

  // Click outside search suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search suggestions fetch
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!searchTerm.trim()) {
      setSuggestions(null);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(
          `${apiUrl}/products/suggestions?q=${encodeURIComponent(searchTerm.trim())}`
        );
        if (res.data?.success) {
          setSuggestions(res.data.suggestions);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.warn('Autocomplete fetch error:', err.message);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 280);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const wishlistCount = user?.wishlist?.length || 0;

  const categories = [
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Home & Kitchen', slug: 'home-kitchen' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Books', slug: 'books' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Footwear', slug: 'footwear' }
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#FFFFFF' }}>
      {/* Top Announcement Bar */}
      <div
        style={{
          backgroundColor: '#0F172A',
          color: '#E2E8F0',
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '6px 1rem',
          textAlign: 'center',
          letterSpacing: '0.03em',
          borderBottom: '1px solid #1E293B',
          transition: 'all 0.3s ease'
        }}
      >
        <span>{ANNOUNCEMENT_MESSAGES[activeAnnouncement]}</span>
      </div>

      {/* Main Navbar */}
      <div
        style={{
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '70px',
            gap: '1.5rem'
          }}
        >
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', color: '#0F172A' }}
            className="mobile-nav-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 800,
              fontSize: '1.4rem',
              color: '#0F172A',
              letterSpacing: '-0.03em',
              textDecoration: 'none',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '6px',
                backgroundColor: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <ShoppingBag size={18} />
            </div>
            <span>
              SHOP<span style={{ color: '#4F46E5' }}>VERSE</span>
            </span>
          </Link>

          {/* Primary Nav Links (Desktop) */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#475569'
            }}
            className="desktop-nav"
          >
            <Link to="/" style={{ color: location.pathname === '/' ? '#0F172A' : 'inherit', fontWeight: location.pathname === '/' ? 600 : 500 }}>
              Home
            </Link>
            <Link to="/products" style={{ color: location.pathname === '/products' ? '#0F172A' : 'inherit', fontWeight: location.pathname === '/products' ? 600 : 500 }}>
              Shop
            </Link>
            <Link to="/categories" style={{ color: location.pathname === '/categories' ? '#0F172A' : 'inherit', fontWeight: location.pathname === '/categories' ? 600 : 500 }}>
              Categories
            </Link>
            <Link to="/products?featured=true" style={{ color: 'inherit' }}>
              Featured
            </Link>
          </nav>

          {/* Live Search Bar with Suggestions Dropdown */}
          <div
            ref={searchBoxRef}
            style={{
              flex: 1,
              maxWidth: '480px',
              position: 'relative'
            }}
          >
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <input
                type="text"
                placeholder="Search products, brands, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (suggestions) setShowSuggestions(true);
                }}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '20px',
                  paddingLeft: '1rem',
                  paddingRight: '2.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  color: '#0F172A',
                  outline: 'none',
                  transition: 'border-color 0.15s ease'
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '6px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Submit search"
              >
                <Search size={14} />
              </button>
            </form>

            {/* Suggestions Overlay Dropdown */}
            {showSuggestions && suggestions && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06)',
                  zIndex: 250,
                  overflow: 'hidden',
                  animation: 'fadeInDown 0.15s ease-out'
                }}
              >
                {/* Matched Products */}
                {suggestions.products?.length > 0 && (
                  <div style={{ padding: '8px 0' }}>
                    <div
                      style={{
                        padding: '4px 16px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#94A3B8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      Products
                    </div>
                    {suggestions.products.map((p) => (
                      <Link
                        key={p._id}
                        to={`/products/${p._id}`}
                        onClick={() => setShowSuggestions(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 16px',
                          textDecoration: 'none',
                          color: '#0F172A',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                          alt={p.name}
                          style={{
                            width: '36px',
                            height: '36px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            backgroundColor: '#F1F5F9'
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                            {p.category} • <span style={{ fontWeight: 600, color: '#0F172A' }}>₹{p.price?.toLocaleString()}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Categories & Brands Chips */}
                {(suggestions.categories?.length > 0 || suggestions.brands?.length > 0) && (
                  <div style={{ padding: '8px 16px', borderTop: '1px solid #F1F5F9', backgroundColor: '#FAFAFA' }}>
                    {suggestions.categories?.length > 0 && (
                      <div style={{ marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, marginRight: '8px' }}>
                          Categories:
                        </span>
                        {suggestions.categories.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setShowSuggestions(false);
                              navigate(`/products?category=${encodeURIComponent(c)}`);
                            }}
                            style={{
                              fontSize: '0.75rem',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E2E8F0',
                              borderRadius: '12px',
                              padding: '2px 8px',
                              marginRight: '6px',
                              marginBottom: '4px',
                              cursor: 'pointer',
                              color: '#334155'
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}

                    {suggestions.brands?.length > 0 && (
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, marginRight: '8px' }}>
                          Brands:
                        </span>
                        {suggestions.brands.map((b) => (
                          <button
                            key={b}
                            onClick={() => {
                              setShowSuggestions(false);
                              navigate(`/products?brand=${encodeURIComponent(b)}`);
                            }}
                            style={{
                              fontSize: '0.75rem',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E2E8F0',
                              borderRadius: '12px',
                              padding: '2px 8px',
                              marginRight: '6px',
                              cursor: 'pointer',
                              color: '#334155'
                            }}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* View all footer */}
                <div
                  onClick={handleSearchSubmit}
                  style={{
                    padding: '10px 16px',
                    borderTop: '1px solid #E2E8F0',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#4F46E5',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <span>View all results for "{searchTerm}"</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginLeft: 'auto' }}>
            {/* Vendor Portal Shortcut */}
            {!isAdmin && (
              <Link
                to={isVendor ? '/vendor/dashboard' : '/vendor/register'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#F8FAFC',
                  color: '#334155',
                  border: '1px solid #E2E8F0',
                  textDecoration: 'none'
                }}
              >
                <Store size={15} />
                <span>{isVendor ? 'Vendor Portal' : 'Sell with Us'}</span>
              </Link>
            )}

            {/* Admin Portal Shortcut */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#EEF2FF',
                  color: '#4F46E5',
                  border: '1px solid #C7D2FE',
                  textDecoration: 'none'
                }}
              >
                <ShieldCheck size={15} />
                <span>Admin Hub</span>
              </Link>
            )}

            {/* Real-time Notifications Bell */}
            <NotificationDropdown />

            {/* Wishlist Icon */}
            <Link
              to="/customer/wishlist"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                color: '#334155',
                textDecoration: 'none'
              }}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: '#0F172A',
                    color: '#FFF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px'
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                color: '#334155',
                textDecoration: 'none'
              }}
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {totalItemsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: '#4F46E5',
                    color: '#FFF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px'
                  }}
                >
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Account Dropdown */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    color: '#0F172A',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    cursor: 'pointer'
                  }}
                  aria-label="User Account Menu"
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      backgroundColor: '#0F172A',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '220px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06)',
                      padding: '8px',
                      zIndex: 300,
                      animation: 'fadeInDown 0.15s ease-out'
                    }}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #F1F5F9' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{user.email}</div>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          backgroundColor: user.role === 'admin' ? '#F3E8FF' : user.role === 'vendor' ? '#EEF2FF' : '#ECFDF5',
                          color: user.role === 'admin' ? '#7E22CE' : user.role === 'vendor' ? '#4338CA' : '#047857',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          marginTop: '4px'
                        }}
                      >
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/customer/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        fontSize: '0.8125rem',
                        color: '#334155',
                        borderRadius: '6px',
                        textDecoration: 'none'
                      }}
                    >
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>

                    <Link
                      to="/customer/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        fontSize: '0.8125rem',
                        color: '#334155',
                        borderRadius: '6px',
                        textDecoration: 'none'
                      }}
                    >
                      <Package size={15} /> My Orders
                    </Link>

                    {isVendor && (
                      <Link
                        to="/vendor/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          fontSize: '0.8125rem',
                          color: '#4F46E5',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontWeight: 600
                        }}
                      >
                        <Store size={15} /> Vendor Portal
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          fontSize: '0.8125rem',
                          color: '#7E22CE',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontWeight: 600
                        }}
                      >
                        <ShieldCheck size={15} /> Admin Dashboard
                      </Link>
                    )}

                    <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '4px' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          fontSize: '0.8125rem',
                          color: '#EF4444',
                          borderRadius: '6px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  to="/login"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    backgroundColor: '#0F172A',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Category Sub-Nav Bar (Clean luxury links) */}
      <div
        style={{
          borderBottom: '1px solid #F1F5F9',
          backgroundColor: '#FFFFFF',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
            height: '42px',
            fontSize: '0.8125rem',
            color: '#64748B'
          }}
        >
          <span style={{ fontWeight: 600, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.75rem' }}>
            Categories
          </span>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/products?category=${encodeURIComponent(c.name)}`}
              style={{
                color: 'inherit',
                textDecoration: 'none',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <Link to="/" style={{ fontWeight: 600, color: '#0F172A', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/products" style={{ fontWeight: 600, color: '#0F172A', textDecoration: 'none' }}>
            Browse Catalog
          </Link>
          <Link to="/categories" style={{ fontWeight: 600, color: '#0F172A', textDecoration: 'none' }}>
            All Categories
          </Link>
          <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '0.25rem 0' }} />
          <Link to="/vendor/register" style={{ fontWeight: 600, color: '#4F46E5', textDecoration: 'none' }}>
            Sell with Us (Vendor Registration)
          </Link>
          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
