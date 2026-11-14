import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Package, Clock, Eye, Store } from 'lucide-react';
import CustomerSidebar from '../../components/dashboard/CustomerSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { orderService } from '../../services/orderService';
import { useSocket } from '../../context/SocketContext';

const MyOrdersPage = () => {
  const { socket } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = async () => {
    try {
      const res = await orderService.getMyOrders();
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Real-time updates listener
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
      fetchOrders();
    };
    socket.on('order_status_update', handleUpdate);
    return () => socket.off('order_status_update', handleUpdate);
  }, [socket]);

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.orderStatus.toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <CustomerSidebar />

        <main className="dashboard-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>My Order History</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Track fulfillment and view itemized invoices for your marketplace purchases
              </p>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select"
              style={{ width: 'auto', fontSize: '0.875rem' }}
            >
              <option value="all">All Orders ({orders.length})</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading orders..." />
          ) : filteredOrders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <Package size={44} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>No Orders Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {filterStatus !== 'all' ? `No orders found with status "${filterStatus}".` : 'You have not placed any orders yet.'}
              </p>
              <Link to="/products" className="btn btn-primary btn-sm">
                Shop Products
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {filteredOrders.map((order) => (
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
                        <span
                          className={`badge ${
                            order.orderStatus === 'delivered'
                              ? 'badge-success'
                              : order.orderStatus === 'shipped'
                              ? 'badge-primary'
                              : 'badge-warning'
                          }`}
                        >
                          {order.orderStatus.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                          ₹{order.grandTotal.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Payment: {order.paymentStatus.toUpperCase()}
                        </div>
                      </div>

                      <Link
                        to={`/customer/orders/${order._id}`}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={15} /> Order Details
                      </Link>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div
                          style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            background: '#F8FAFC',
                            flexShrink: 0
                          }}
                        >
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '2px' }}>
                            {item.name}
                          </h4>
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Store size={13} /> Seller: {item.vendorStoreName || 'Marketplace Seller'}
                          </div>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Qty: <strong>{item.quantity}</strong>
                        </div>

                        <div style={{ minWidth: '90px', textAlign: 'right', fontWeight: 700, fontSize: '0.95rem' }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>

                        <div style={{ flexShrink: 0 }}>
                          <span
                            className={`badge ${
                              item.itemStatus === 'delivered'
                                ? 'badge-success'
                                : item.itemStatus === 'shipped'
                                ? 'badge-primary'
                                : 'badge-warning'
                            }`}
                            style={{ fontSize: '0.7rem' }}
                          >
                            Item: {item.itemStatus}
                          </span>
                        </div>
                      </div>
                    ))}
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

export default MyOrdersPage;
