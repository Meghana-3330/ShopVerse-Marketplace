import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  TrendingUp,
  ArrowUpRight,
  CheckCircle,
  Truck,
  Package,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import VendorSidebar from '../../components/dashboard/VendorSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { vendorService } from '../../services/vendorService';
import { useSocket } from '../../context/SocketContext';

const VendorDashboardPage = () => {
  const { socket } = useSocket();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30d'); // 'today' | '7d' | '30d' | 'year'
  const [statusUpdating, setStatusUpdating] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await vendorService.getDashboard();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vendor dashboard statistics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Listen for real-time order placements affecting this vendor
  useEffect(() => {
    if (!socket) return;
    const handleNewOrder = (orderData) => {
      console.log('[VendorDashboard] Real-time new order received:', orderData);
      fetchDashboard();
    };

    socket.on('new_order', handleNewOrder);
    return () => socket.off('new_order', handleNewOrder);
  }, [socket, fetchDashboard]);

  const handleUpdateItemStatus = async (orderId, itemId, newStatus) => {
    setStatusUpdating(`${orderId}-${itemId}`);
    try {
      await vendorService.updateOrderItemStatus(orderId, itemId, newStatus);
      await fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(null);
    }
  };

  if (loading) return <LoadingSpinner text="Connecting real-time vendor telemetry..." />;

  const stats = data?.stats || {};
  const isApproved = stats.storeStatus === 'approved';
  const avgOrderValue = stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0;

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <VendorSidebar />

        <main className="dashboard-content">
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
              flexWrap: 'wrap',
              gap: '1rem',
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '1.25rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  {stats.storeName || 'Vendor Workspace'}
                </h1>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    backgroundColor: isApproved ? '#ECFDF5' : stats.storeStatus === 'pending' ? '#FEF3C7' : '#FEE2E2',
                    color: isApproved ? '#065F46' : stats.storeStatus === 'pending' ? '#92400E' : '#991B1B',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}
                >
                  {stats.storeStatus?.toUpperCase()}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.7rem',
                    color: '#059669',
                    backgroundColor: '#ECFDF5',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 600
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  Socket.IO Live
                </span>
              </div>
              <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0 }}>
                Real-time sales tracking, order dispatch, and live inventory sync
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Date Filter Pills */}
              <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '6px', padding: '2px' }}>
                {['Today', '7D', '30D', 'Year'].map((label) => {
                  const key = label.toLowerCase();
                  const isSelected = (dateRange === '30d' && key === '30d') || dateRange === key;
                  return (
                    <button
                      key={label}
                      onClick={() => setDateRange(key)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                        color: isSelected ? '#0F172A' : '#64748B',
                        boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {isApproved && (
                <Link
                  to="/vendor/add-product"
                  style={{
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={15} /> Add Product
                </Link>
              )}
            </div>
          </div>

          {error && <AlertBanner type="error" message={error} />}

          {!isApproved && (
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '8px',
                padding: '1.25rem',
                marginBottom: '2rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}
            >
              <Clock size={28} color="#D97706" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.925rem', color: '#92400E', margin: '0 0 4px 0', fontWeight: 600 }}>
                  Store Application Under Administrator Review
                </h4>
                <p style={{ fontSize: '0.8125rem', color: '#B45309', margin: 0, lineHeight: 1.4 }}>
                  Your vendor store is pending approval. You can prepare catalog listings in the meantime; once approved by marketplace admin, your items become instantly purchasable.
                </p>
              </div>
            </div>
          )}

          {/* 4 Modern SaaS Stat Cards (Inspired by Nexadash & Fades) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}
          >
            {/* Total Sales */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Total Revenue</span>
                <span className="metric-pill metric-pill-up">
                  <ArrowUpRight size={12} /> +14.2%
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                ₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                From {stats.totalItemsSold || 0} units fulfilled
              </div>
            </div>

            {/* Total Orders */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Store Orders</span>
                <span className="metric-pill metric-pill-up">
                  <ArrowUpRight size={12} /> +8.1%
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                {stats.totalOrders || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                {stats.pendingFulfillments || 0} require dispatch
              </div>
            </div>

            {/* Average Order Value */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Avg. Order Value</span>
                <span className="metric-pill metric-pill-up">
                  <ArrowUpRight size={12} /> +5.4%
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                ₹{avgOrderValue.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                Average basket size
              </div>
            </div>

            {/* Inventory Health */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Active Listings</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: stats.outOfStockProducts > 0 ? '#DC2626' : '#059669' }}>
                  {stats.outOfStockProducts > 0 ? `${stats.outOfStockProducts} Out of stock` : 'Healthy stock'}
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                {stats.activeProducts || 0}
                <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }}> / {stats.totalProducts || 0}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                {stats.lowStockProducts || 0} low stock warnings
              </div>
            </div>
          </div>

          {/* Sales Performance Chart (Recharts) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Sales & Revenue Velocity
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  Daily gross revenue trajectory from completed customer purchases
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                Period: {dateRange.toUpperCase()}
              </span>
            </div>

            {data?.salesChart && data.salesChart.length > 0 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.salesChart}>
                    <defs>
                      <linearGradient id="vendorRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Gross Sales']}
                      contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '6px', border: 'none', fontSize: '0.8rem' }}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#vendorRevGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                No sales data recorded for this period yet.
              </div>
            )}
          </div>

          {/* Recent Orders with Quick Fulfillment Action */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Recent Orders Awaiting Dispatch
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  Update item fulfillment status directly to send real-time push alerts to buyers
                </p>
              </div>
              <Link to="/vendor/orders" style={{ fontSize: '0.8125rem', color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>
                All Orders &rarr;
              </Link>
            </div>

            {data?.recentOrders && data.recentOrders.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Store Items</th>
                      <th>Subtotal</th>
                      <th>Status Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((o) => (
                      <tr key={o._id}>
                        <td>
                          <strong>#{o.orderNumber}</strong>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                            {new Date(o.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{o.customerName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{o.customerPhone}</div>
                        </td>
                        <td>
                          {o.items?.map((item) => (
                            <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover' }}
                              />
                              <span style={{ fontSize: '0.8125rem' }}>
                                {item.quantity}x {item.name}
                              </span>
                            </div>
                          ))}
                        </td>
                        <td>
                          <strong style={{ color: '#0F172A' }}>₹{o.vendorSubtotal?.toLocaleString('en-IN')}</strong>
                        </td>
                        <td>
                          {o.items?.[0] && (
                            <select
                              value={o.items[0].itemStatus}
                              disabled={statusUpdating === `${o._id}-${o.items[0]._id}`}
                              onChange={(e) => handleUpdateItemStatus(o._id, o.items[0]._id, e.target.value)}
                              style={{
                                fontSize: '0.75rem',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid #CBD5E1',
                                backgroundColor:
                                  o.items[0].itemStatus === 'delivered'
                                    ? '#ECFDF5'
                                    : o.items[0].itemStatus === 'shipped'
                                    ? '#EEF2FF'
                                    : '#FFFBEB',
                                color:
                                  o.items[0].itemStatus === 'delivered'
                                    ? '#065F46'
                                    : o.items[0].itemStatus === 'shipped'
                                    ? '#3730A3'
                                    : '#92400E',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>
                No orders containing your items yet. When customers order, they appear here instantly.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorDashboardPage;
