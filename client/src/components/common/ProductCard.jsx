import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const ProductCard = ({ product, onQuickView, viewMode = 'grid' }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isProductInWishlist, toggleWishlist, isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [currentStock, setCurrentStock] = useState(product?.stock ?? 0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Sync initial product stock safely
  useEffect(() => {
    if (product?.stock !== undefined) {
      setCurrentStock(product.stock);
    }
  }, [product?.stock]);

  // Listen for real-time stock updates for this specific product
  useEffect(() => {
    if (!socket || !product?._id) return;
    const handleStockUpdate = (data) => {
      if (data.productId === product._id) {
        console.log(`[ProductCard] Real-time stock update for ${product.name}: ${data.newStock}`);
        setCurrentStock(data.newStock);
      }
    };

    socket.on('stock_update', handleStockUpdate);
    return () => socket.off('stock_update', handleStockUpdate);
  }, [socket, product?._id, product?.name]);

  const isWishlisted = product?._id && isProductInWishlist ? isProductInWishlist(product._id) : false;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (toggleWishlist && product?._id) {
      toggleWishlist(product._id);
    }
  };

  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60';

  const priceFormatted = (product?.price || 0).toLocaleString('en-IN');
  const originalPriceFormatted = (product?.originalPrice || product?.price || 0).toLocaleString('en-IN');
  const hasDiscount = (product?.originalPrice || 0) > (product?.price || 0);

  // -------------------------------------------------------------
  // LIST VIEW LAYOUT
  // -------------------------------------------------------------
  if (viewMode === 'list') {
    return (
      <div className="product-card-list">
        <div className="list-image-container">
          <Link to={`/products/${product._id}`}>
            <img src={displayImage} alt={product.name || 'Product'} className="list-image" loading="lazy" />
          </Link>
          {product.discount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '3px 7px',
                borderRadius: '4px'
              }}
            >
              -{product.discount}%
            </span>
          )}
        </div>

        <div className="list-content">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {product.brand || product.category || 'General'} • {product.vendorStoreName || 'Marketplace Vendor'}
              </span>
              <button
                onClick={handleWishlistToggle}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isWishlisted ? '#EF4444' : '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>
                {product.name}
              </h3>
            </Link>

            <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {product.description || ''}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem' }}>
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{product.rating || '4.5'}</span>
                <span style={{ color: '#94A3B8' }}>({product.numReviews || 12})</span>
              </div>
              <span style={{ color: '#CBD5E1' }}>|</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: isOutOfStock ? '#EF4444' : isLowStock ? '#D97706' : '#059669'
                }}
              >
                {isOutOfStock ? 'Sold out' : isLowStock ? `Only ${currentStock} left in stock` : `${currentStock} in stock`}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A' }}>
                ₹{priceFormatted}
              </span>
              {hasDiscount && (
                <span style={{ fontSize: '0.875rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                  ₹{originalPriceFormatted}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {onQuickView && (
                <button
                  onClick={() => onQuickView(product)}
                  className="btn btn-outline btn-sm"
                  title="Quick View"
                >
                  <Eye size={15} /> Quick View
                </button>
              )}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                style={{
                  backgroundColor: addedAnimation ? '#10B981' : isOutOfStock ? '#E2E8F0' : '#0F172A',
                  color: isOutOfStock ? '#94A3B8' : '#FFFFFF',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                {addedAnimation ? (
                  <>
                    <Check size={14} /> Added
                  </>
                ) : isOutOfStock ? (
                  'Sold Out'
                ) : (
                  <>
                    <ShoppingBag size={14} /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // GRID VIEW LAYOUT (WeTheKnot / Minimalist Luxury)
  // -------------------------------------------------------------
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Badges Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 2
        }}
      >
        {product.discount > 0 && (
          <span
            style={{
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              letterSpacing: '0.02em'
            }}
          >
            -{product.discount}%
          </span>
        )}
        {product.isNewArrival && (
          <span
            style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              fontSize: '0.6875rem',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: '4px'
            }}
          >
            NEW
          </span>
        )}
        {isOutOfStock && (
          <span
            style={{
              backgroundColor: '#64748B',
              color: '#FFFFFF',
              fontSize: '0.6875rem',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: '4px'
            }}
          >
            SOLD OUT
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isWishlisted ? '#EF4444' : '#64748B',
          zIndex: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
        }}
        aria-label="Wishlist"
        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Image Container */}
      <Link
        to={`/products/${product._id}`}
        style={{
          display: 'block',
          width: '100%',
          height: '240px',
          backgroundColor: '#F8FAFC',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <img
          src={displayImage}
          alt={product.name || 'Product Image'}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </Link>

      {/* Product Details Content */}
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Vendor / Store Name */}
          <div
            style={{
              fontSize: '0.7rem',
              color: '#64748B',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '4px'
            }}
          >
            {product.vendorStoreName || 'Marketplace Vendor'}
          </div>

          {/* Title */}
          <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
            <h4
              style={{
                fontSize: '0.925rem',
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '6px',
                lineHeight: 1.35,
                height: '2.7em',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
              title={product.name}
            >
              {product.name}
            </h4>
          </Link>

          {/* Rating & Stock row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              fontSize: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={13} fill="#F59E0B" color="#F59E0B" />
              <span style={{ fontWeight: 600, color: '#0F172A' }}>{product.rating || '4.5'}</span>
              <span style={{ color: '#94A3B8' }}>({product.numReviews || 12})</span>
            </div>

            <span
              style={{
                fontWeight: 500,
                color: isOutOfStock ? '#EF4444' : isLowStock ? '#D97706' : '#059669',
                fontSize: '0.7rem'
              }}
            >
              {isOutOfStock ? 'Sold out' : isLowStock ? `Only ${currentStock} left` : 'In stock'}
            </span>
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              marginBottom: '12px'
            }}
          >
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
              ₹{priceFormatted}
            </span>
            {hasDiscount && (
              <span
                style={{
                  fontSize: '0.8rem',
                  color: '#94A3B8',
                  textDecoration: 'line-through'
                }}
              >
                ₹{originalPriceFormatted}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                flex: 1,
                backgroundColor: addedAnimation ? '#10B981' : isOutOfStock ? '#F1F5F9' : '#0F172A',
                color: isOutOfStock ? '#94A3B8' : '#FFFFFF',
                height: '36px',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: 'none',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              {addedAnimation ? (
                <>
                  <Check size={15} /> Added
                </>
              ) : isOutOfStock ? (
                'Sold Out'
              ) : (
                <>
                  <ShoppingBag size={14} /> Add to Cart
                </>
              )}
            </button>

            {onQuickView && (
              <button
                onClick={() => onQuickView(product)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Quick View"
                aria-label="Quick View"
              >
                <Eye size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
