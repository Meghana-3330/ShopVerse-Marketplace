import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  MapPin,
  Clock,
  ArrowRight,
  Package,
  CheckCircle,
  Truck
} from 'lucide-react';
import CustomerSidebar from '../../components/dashboard/CustomerSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';

const CustomerDashboardPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (err) {
        console.error('Error fetching customer orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const wishlistCount = user?.wishlist?.length || 0;
  const addressesCount = user?.addresses?.length || 0;
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <CustomerSidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
              Welcome back, {user?.name}!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Here is a snapshot of your marketplace orders and account activity
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                <ShoppingBag size={26} />
              </div>
              <div className="stat-info">
                <h4>Total Orders</h4>
                <div className="stat-value">{orders.length}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
                <Heart size={26} />
              </div>
              <div className="stat-info">
                <h4>Wishlist Items</h4>
                <div className="stat-value">{wishlistCount}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success-dark)' }}>
                <MapPin size={26} />
              </div>
              <div className="stat-info">
                <h4>Saved Addresses</h4>
                <div className="stat-value">{addressesCount > 0 ? addressesCount : 1}</div>
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Orders</h2>
              <Link
                to="/customer/orders"
                style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View All Orders <ArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner text="Fetching your orders..." />
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <Package size={40} color="var(--text-light)" style={{ margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>No orders placed yet</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  Explore top deals and start shopping across our verified sellers
                </p>
                <Link to="/products" className="btn btn-primary btn-sm">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.15rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>#{order.orderNumber}</span>
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
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          ₹{order.grandTotal.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--success-dark)' }}>
                          {order.paymentStatus.toUpperCase()}
                        </div>
                      </div>

                      <Link
                        to={`/customer/orders/${order._id}`}
                        className="btn btn-outline btn-sm"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
