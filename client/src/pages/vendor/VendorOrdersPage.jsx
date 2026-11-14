import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Phone,
  User,
  ShieldAlert
} from 'lucide-react';
import VendorSidebar from '../../components/dashboard/VendorSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { vendorService } from '../../services/vendorService';
import { useSocket } from '../../context/SocketContext';

const VendorOrdersPage = () => {
  const { socket } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updatingItemId, setUpdatingItemId] = useState(null);

  const fetchVendorOrders = async () => {
    setLoading(true);
    try {
      const res = await vendorService.getOrders();
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vendor orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  // Real-time listener for new orders and status updates
  useEffect(() => {
    if (!socket) return;
    const handleNewOrder = () => {
      fetchVendorOrders();
    };
    socket.on('new_order', handleNewOrder);
    socket.on('order_status_update', handleNewOrder);
    return () => {
      socket.off('new_order', handleNewOrder);
      socket.off('order_status_update', handleNewOrder);
    };
  }, [socket]);

  const handleStatusChange = async (orderId, itemId, newStatus) => {
    setUpdatingItemId(itemId);
    setError('');
    setMessage('');

    try {
      const res = await vendorService.updateOrderItemStatus(orderId, itemId, newStatus);
      if (res.success) {
        setMessage(`Item fulfillment status successfully updated to "${newStatus}".`);
        fetchVendorOrders();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item status.');
    } finally {
      setUpdatingItemId(null);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <VendorSidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Vendor Order Fulfillment</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Manage shipping and fulfillment exclusively for products ordered from your store
            </p>
          </div>

          {message && <AlertBanner type="success" message={message} onClose={() => setMessage('')} />}
          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          {loading ? (
            <LoadingSpinner text="Fetching order records..." />
          ) : orders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <ShoppingBag size={44} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>No Orders Received Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                When customers purchase items from your catalog, their fulfillment details will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {orders.map((order) => (
                <div key={order._id} className="card" style={{ padding: '1.5rem' }}>
                  {/* Order Top Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-color)',
                      paddingBottom: '1rem',
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>#{order.orderNumber}</span>
                        <span className="badge badge-primary">Order Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Payment Status: <strong style={{ color: 'var(--success-dark)' }}>{order.paymentStatus?.toUpperCase()}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ₹{order.vendorSubtotal?.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Your Items Total
                      </div>
                    </div>
                  </div>

                  {/* Customer Delivery Info */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Recipient: </span>
                      <strong>{order.customerInfo?.name}</strong> • Phone: <strong>{order.customerInfo?.phone}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={15} color="var(--primary)" />
                      <span>{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</span>
                    </div>
                  </div>

                  {/* Vendor's items in this order */}
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Item Subtotal</th>
                          <th>Fulfillment Status</th>
                          <th style={{ textAlign: 'right' }}>Update Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item._id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                                />
                                <strong style={{ fontSize: '0.9rem' }}>{item.name}</strong>
                              </div>
                            </td>
                            <td>₹{item.price.toLocaleString('en-IN')}</td>
                            <td>{item.quantity}</td>
                            <td style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                            <td>
                              <span
                                className={`badge ${
                                  item.itemStatus === 'delivered'
                                    ? 'badge-success'
                                    : item.itemStatus === 'shipped'
                                    ? 'badge-primary'
                                    : item.itemStatus === 'cancelled'
                                    ? 'badge-danger'
                                    : 'badge-warning'
                                }`}
                              >
                                {item.itemStatus}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <select
                                value={item.itemStatus}
                                disabled={updatingItemId === item._id}
                                onChange={(e) => handleStatusChange(order._id, item._id, e.target.value)}
                                className="form-select"
                                style={{ width: 'auto', padding: '0.25rem 0.65rem', fontSize: '0.8rem', display: 'inline-block' }}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VendorOrdersPage;
