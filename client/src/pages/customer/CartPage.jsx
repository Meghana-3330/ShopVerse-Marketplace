import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Store, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryCharge,
    grandTotal,
    totalItemsCount,
    freeDeliveryThreshold,
    freeDeliveryRemaining
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container page-wrapper" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}
        >
          <ShoppingBag size={40} />
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
          Explore thousands of verified products from independent marketplace sellers and add them to your cart.
        </p>
        <Link to="/products" className="btn btn-lg btn-primary">
          Explore Products Now
        </Link>
      </div>
    );
  }

  // Calculate free delivery progress percentage
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="container page-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Shopping Cart</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in your cart from multiple marketplace sellers
          </p>
        </div>

        <button
          onClick={clearCart}
          className="btn btn-outline btn-sm"
          style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
        >
          <Trash2 size={15} /> Clear Cart
        </button>
      </div>

      {/* Free Delivery Incentive Progress Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          backgroundColor: deliveryCharge === 0 ? 'var(--success-light)' : 'var(--primary-light)',
          borderColor: deliveryCharge === 0 ? '#A7F3D0' : '#C7D2FE'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.875rem' }}>
          <Truck size={18} color={deliveryCharge === 0 ? 'var(--success-dark)' : 'var(--primary)'} />
          {deliveryCharge === 0 ? (
            <span style={{ color: 'var(--success-dark)' }}>
              🎉 Congratulations! You have unlocked FREE Express Delivery!
            </span>
          ) : (
            <span style={{ color: 'var(--primary-text)' }}>
              Add ₹{freeDeliveryRemaining.toLocaleString('en-IN')} more to unlock FREE Delivery!
            </span>
          )}
        </div>
        <div
          style={{
            height: '6px',
            borderRadius: '999px',
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${freeDeliveryProgress}%`,
              backgroundColor: deliveryCharge === 0 ? 'var(--success)' : 'var(--primary)',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Column: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              {/* Product Image */}
              <Link
                to={`/products/${item.product}`}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: '#F8FAFC',
                  flexShrink: 0
                }}
              >
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60'}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Link>

              {/* Product Info */}
              <div style={{ flex: 1, minWidth: '180px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '2px' }}>
                  <Store size={14} /> Sold by: {item.vendorStoreName || 'Marketplace Vendor'}
                </div>

                <Link to={`/products/${item.product}`}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    {item.name}
                  </h3>
                </Link>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  {item.originalPrice > item.price && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls & Subtotal */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: 'auto' }}>
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
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    style={{ padding: '0.4rem 0.75rem', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    style={{ padding: '0.4rem 0.75rem', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>

                <div style={{ minWidth: '85px', textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ₹{item.price} each
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  style={{ color: 'var(--text-light)', cursor: 'pointer', padding: '6px' }}
                  title="Remove item"
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                  onMouseLeave={(e.currentTarget.style.color = 'var(--text-light)')}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {/* Continue Shopping button */}
          <div style={{ marginTop: '1rem' }}>
            <Link to="/products" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>Order Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.925rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal ({totalItemsCount} items)</span>
                <span style={{ fontWeight: 700 }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery</span>
                <span style={{ fontWeight: 700, color: deliveryCharge === 0 ? 'var(--success-dark)' : 'var(--text-main)' }}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}
              >
                <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>Grand Total</span>
                <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-lg btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.775rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <ShieldCheck size={18} color="var(--success)" style={{ flexShrink: 0 }} />
              <span>Multi-vendor cart supported. All prices recalculated securely from database at checkout.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
