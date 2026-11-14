import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  Truck,
  ShieldCheck,
  Store,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import AlertBanner from '../../components/common/AlertBanner';

const CheckoutPage = () => {
  const { cartItems, subtotal, deliveryCharge, grandTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Address form fields
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.addresses?.[0]?.street || '42 MG Road, 3rd Floor, Indiranagar',
    city: user?.addresses?.[0]?.city || 'Bengaluru',
    state: user?.addresses?.[0]?.state || 'Karnataka',
    postalCode: user?.addresses?.[0]?.postalCode || '560038'
  });

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || 'Rahul Verma',
    email: user?.email || 'customer@marketplace.com',
    phone: user?.phone || '+91 98765 43210'
  });

  const [paymentMethod, setPaymentMethod] = useState('simulated_card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="container page-wrapper" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      setError('Please provide complete shipping address details.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Prepare payload: server strictly recalculates prices from DB!
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.product,
          quantity: item.quantity
        })),
        shippingAddress,
        customerInfo,
        paymentMethod
      };

      const res = await orderService.createOrder(payload);

      if (res.success && res.order) {
        clearCart();
        setOrderSuccess(res.order);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please check stock or details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container page-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card fade-in" style={{ maxWidth: '600px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            <CheckCircle2 size={42} />
          </div>

          <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>
            Payment Confirmed (Simulated)
          </span>

          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>
            Thank You! Your Order Has Been Placed
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Order Number: <strong style={{ color: 'var(--text-main)' }}>#{orderSuccess.orderNumber}</strong>
          </p>

          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              textAlign: 'left',
              fontSize: '0.875rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items Count:</span>
              <strong>{orderSuccess.items.length} Multi-Vendor Products</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Amount:</span>
              <strong style={{ color: 'var(--primary)' }}>₹{orderSuccess.grandTotal.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Address:</span>
              <span style={{ textAlign: 'right', maxWidth: '240px' }}>
                {orderSuccess.shippingAddress.street}, {orderSuccess.shippingAddress.city}, {orderSuccess.shippingAddress.state} - {orderSuccess.shippingAddress.postalCode}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
              <span>{orderSuccess.paymentMethod.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/customer/orders" className="btn btn-primary">
              View in My Orders
            </Link>
            <Link to="/products" className="btn btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      <div style={{ marginBottom: '1.75rem' }}>
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          <ArrowLeft size={16} /> Back to Shopping Cart
        </Link>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Secure Checkout</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Complete your delivery information and select simulated payment
        </p>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handlePlaceOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Left Column: Delivery Address & Payment Method */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* 1. Customer & Shipping Details */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} color="var(--primary)" /> 1. Delivery & Contact Details
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address & Landmark</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="House/Flat No., Apartment, Street, Landmark"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Postal / PIN Code</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 2. Simulated Payment Options */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="var(--primary)" /> 2. Simulated Payment Method
              </h2>

              <div
                style={{
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid #C7D2FE',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.8rem',
                  color: 'var(--primary-text)',
                  marginBottom: '1.25rem'
                }}
              >
                <strong>Academic / Internship Demo Mode:</strong> Payments are simulated safely. No real financial credit card information is collected or charged.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* Simulated Card */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${paymentMethod === 'simulated_card' ? 'var(--primary)' : 'var(--border-color)'}`,
                    backgroundColor: paymentMethod === 'simulated_card' ? 'var(--primary-light)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="simulated_card"
                    checked={paymentMethod === 'simulated_card'}
                    onChange={() => setPaymentMethod('simulated_card')}
                    style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                  />
                  <CreditCard size={22} color="var(--primary)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Simulated Credit / Debit Card</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Auto-approves instant test transaction</div>
                  </div>
                </label>

                {/* Simulated UPI */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${paymentMethod === 'simulated_upi' ? 'var(--primary)' : 'var(--border-color)'}`,
                    backgroundColor: paymentMethod === 'simulated_upi' ? 'var(--primary-light)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="simulated_upi"
                    checked={paymentMethod === 'simulated_upi'}
                    onChange={() => setPaymentMethod('simulated_upi')}
                    style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                  />
                  <QrCode size={22} color="#0EA5E9" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Simulated UPI / QR Code</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Instant virtual VPA confirmation</div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border-color)'}`,
                    backgroundColor: paymentMethod === 'cod' ? 'var(--primary-light)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                  />
                  <Truck size={22} color="#10B981" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cash on Delivery (COD)</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Pay upon parcel arrival at doorstep</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Total */}
          <div style={{ maxWidth: '420px', width: '100%' }}>
            <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Review Items ({cartItems.length})</h2>

              {/* Items listing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '4px' }}>
                {cartItems.map((item) => (
                  <div key={item.product} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        background: '#F8FAFC',
                        flexShrink: 0
                      }}
                    >
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                        Store: {item.vendorStoreName || 'Vendor'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, fontSize: '0.875rem', fontWeight: 700 }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                  <span style={{ fontWeight: 700 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery Charge:</span>
                  <span style={{ fontWeight: 700, color: deliveryCharge === 0 ? 'var(--success-dark)' : 'var(--text-main)' }}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div
                  style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Final Total:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-lg btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {isSubmitting ? 'Verifying & Placing Order...' : `Pay ₹${grandTotal.toLocaleString('en-IN')} (Simulated)`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
