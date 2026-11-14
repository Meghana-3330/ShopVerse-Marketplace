import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Check, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const QuickViewModal = ({ product, isOpen = true, onClose }) => {
  if (!isOpen || !product) return null;

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="card fade-in"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Image */}
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: '#F8FAFC',
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={displayImage}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '0.4rem' }}>
              <span className="badge badge-primary">{product.category}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                SKU: {product.sku || 'N/A'}
              </span>
            </div>

            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{product.name}</h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div className="stars">
                <Star size={16} fill="#F59E0B" color="#F59E0B" />
              </div>
              <span style={{ fontWeight: 700 }}>{product.rating || '4.5'}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ({product.numReviews || 12} customer reviews)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: '1.1rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discount > 0 && (
                <span className="discount-tag">Save {product.discount}%</span>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {product.description}
            </p>

            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600 }}>
                <ShieldCheck size={16} /> Sold & Fulfilled by {product.vendorStoreName || 'Marketplace Vendor'}
              </div>
              <div style={{ marginTop: '4px', color: isOutOfStock ? 'var(--danger)' : 'var(--success-dark)', fontWeight: 600 }}>
                {isOutOfStock ? 'Currently Out of Stock' : `In Stock: ${product.stock} items remaining`}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: '0.5rem 0.85rem', fontWeight: 700 }}
                  disabled={isOutOfStock}
                >
                  -
                </button>
                <span style={{ minWidth: '36px', textAlign: 'center', fontWeight: 700 }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  style={{ padding: '0.5rem 0.85rem', fontWeight: 700 }}
                  disabled={isOutOfStock}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn btn-primary"
                style={{
                  flex: 1,
                  backgroundColor: added ? 'var(--success)' : undefined
                }}
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart
                  </>
                )}
              </button>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link
                to={`/products/${product._id}`}
                onClick={onClose}
                style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
              >
                View Full Product Specifications & Customer Reviews &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
