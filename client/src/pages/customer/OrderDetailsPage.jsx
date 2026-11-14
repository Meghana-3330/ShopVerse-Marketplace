import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Store,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  ShieldCheck,
  CreditCard,
  Printer
} from 'lucide-react';
import CustomerSidebar from '../../components/dashboard/CustomerSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { orderService } from '../../services/orderService';
import { useSocket } from '../../context/SocketContext';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { socket } = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(id);
        if (res.success) {
          setOrder(res.order);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Real-time order status listener via Socket.IO
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data) => {
      if (data.orderId === id || data.orderNumber === order?.orderNumber) {
        console.log('[OrderDetailsPage] Real-time order update received:', data);
        orderService.getOrderById(id).then((res) => {
          if (res.success) setOrder(res.order);
        });
      }
    };

    socket.on('order_status_update', handleUpdate);
    return () => socket.off('order_status_update', handleUpdate);
  }, [socket, id, order?.orderNumber]);

  if (loading) return <LoadingSpinner text="Loading order details..." />;
  if (error || !order) {
    return (
      <div className="container page-wrapper">
        <AlertBanner type="error" message={error || 'Order not found.'} />
        <Link to="/customer/orders" className="btn btn-primary btn-sm">
          Return to My Orders
        </Link>
      </div>
    );
  }

  // Tracking steps progression
  const trackingSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentStepIdx = trackingSteps.indexOf(order.orderStatus.toLowerCase());

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <CustomerSidebar />

        <main className="dashboard-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <Link to="/customer/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <ArrowLeft size={14} /> Back to My Orders
              </Link>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '2px' }}>
                Order #{order.orderNumber}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.7rem',
                    color: '#059669',
                    backgroundColor: '#ECFDF5',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 600
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                  Live Sync
                </span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Printer size={16} /> Print Receipt
            </button>
          </div>

          {/* Fulfillment Progress Stepper */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Fulfillment Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {trackingSteps.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <div
                    key={step}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 2,
                      flex: 1
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: isPassed ? 'var(--primary)' : 'var(--bg-subtle)',
                        color: isPassed ? '#FFFFFF' : 'var(--text-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        marginBottom: '0.5rem',
                        boxShadow: isCurrent ? '0 0 0 4px var(--primary-light)' : 'none'
                      }}
                    >
                      {idx + 1}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: isPassed ? 700 : 500,
                        color: isPassed ? 'var(--text-main)' : 'var(--text-light)',
                        textTransform: 'capitalize'
                      }}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer & Shipping Summary Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Delivery Address */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <MapPin size={18} color="var(--primary)" /> Delivery Address
              </h3>
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                <strong>{order.customerInfo?.name || order.customer?.name}</strong><br />
                {order.shippingAddress?.street}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
                <span style={{ color: 'var(--text-muted)' }}>Phone: {order.customerInfo?.phone || 'N/A'}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <CreditCard size={18} color="var(--primary)" /> Payment Information
              </h3>
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                <div>Method: <strong>{order.paymentMethod?.replace('_', ' ').toUpperCase()}</strong></div>
                <div>Status: <span className="badge badge-success">{order.paymentStatus?.toUpperCase()}</span></div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Simulated Txn ID: {order.paymentResult?.id || 'SIM-TXN-SUCCESS'}
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Multi-Vendor Products Table */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Order Items</h3>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Seller / Vendor</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Item Status</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                          <span style={{ fontWeight: 600 }}>{item.name}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                          <Store size={14} /> {item.vendorStoreName || 'Marketplace Seller'}
                        </div>
                      </td>
                      <td>₹{item.price.toLocaleString('en-IN')}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <span className={`badge ${item.itemStatus === 'delivered' ? 'badge-success' : 'badge-warning'}`}>
                          {item.itemStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div style={{ maxWidth: '320px', marginLeft: 'auto', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.925rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Subtotal:</span>
                <span style={{ fontWeight: 700 }}>₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery Charge:</span>
                <span style={{ fontWeight: 700, color: order.deliveryCharge === 0 ? 'var(--success-dark)' : 'inherit' }}>
                  {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
                </span>
              </div>
              <div
                style={{
                  borderTop: '1.5px solid var(--border-color)',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}
              >
                <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>Grand Total:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{order.grandTotal?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
