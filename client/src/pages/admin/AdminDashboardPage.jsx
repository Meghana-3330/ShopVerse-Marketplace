import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  IndianRupee,
  Users,
  Store,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package
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
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { adminService } from '../../services/adminService';
import { useSocket } from '../../context/SocketContext';

const AdminDashboardPage = () => {
  const { socket } = useSocket();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30d');
  const [actionInProgress, setActionInProgress] = useState(null);
  const [pendingVendorsList, setPendingVendorsList] = useState([]);

  const fetchAdminStats = useCallback(async () => {
    try {
      const res = await adminService.getDashboard();
      if (res.success) {
        setData(res);
      }
      // Also fetch pending vendors for 1-click approvals
      const vendorRes = await adminService.getAllVendors({ status: 'pending' });
      if (vendorRes.success) {
        setPendingVendorsList(vendorRes.vendors || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin overview metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  // Real-time listener for incoming orders across entire platform
  useEffect(() => {
    if (!socket) return;
    const handleAdminAlert = () => {
      fetchAdminStats();
    };

    socket.on('admin_order_alert', handleAdminAlert);
    return () => socket.off('admin_order_alert', handleAdminAlert);
  }, [socket, fetchAdminStats]);

  const handleVendorAction = async (vendorId, status) => {
    setActionInProgress(vendorId);
    try {
      await adminService.updateVendorStatus(vendorId, status);
      await fetchAdminStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update vendor status');
    } finally {
      setActionInProgress(null);
    }
  };

  if (loading) return <LoadingSpinner text="Connecting central marketplace telemetry..." />;

  const stats = data?.stats || {};

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <AdminSidebar />

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
                <span
                  style={{
                    backgroundColor: '#F3E8FF',
                    color: '#7E22CE',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}
                >
                  Super Admin Hub
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
                  Socket.IO Active
                </span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Marketplace Telemetry & Control
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                Unified database metrics across vendors, customer orders, and approvals
              </p>
            </div>

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
          </div>

          {error && <AlertBanner type="error" message={error} />}

          {/* 4 KPI Cards (Inspired by Fluxcart) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}
          >
            {/* Total Revenue */}
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
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Marketplace GMV</span>
                <span className="metric-pill metric-pill-up">
                  <ArrowUpRight size={12} /> +20.4%
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                ₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                Across all multi-vendor orders
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
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Orders Count</span>
                <span className="metric-pill metric-pill-up">
                  <ArrowUpRight size={12} /> +10.4%
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                {stats.totalOrders || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                {stats.completedOrders || 0} successfully delivered
              </div>
            </div>

            {/* Total Vendors */}
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
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Registered Vendors</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: stats.pendingVendors > 0 ? '#D97706' : '#059669' }}>
                  {stats.pendingVendors > 0 ? `${stats.pendingVendors} Pending` : 'All Approved'}
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                {stats.totalVendors || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                Active seller merchant network
              </div>
            </div>

            {/* Total Customers */}
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
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Active Shoppers</span>
                <span className="metric-pill metric-pill-up">
                  <ArrowUpRight size={12} /> +18.2%
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                {stats.totalCustomers || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                Registered customer accounts
              </div>
            </div>
          </div>

          {/* Pending Vendor Approvals Widget (With 1-click Approval) */}
          {pendingVendorsList.length > 0 && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #FDE68A',
                borderRadius: '10px',
                padding: '1.25rem',
                marginBottom: '2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#D97706" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#92400E', margin: 0 }}>
                    {pendingVendorsList.length} Vendor Application{pendingVendorsList.length > 1 ? 's' : ''} Awaiting Review
                  </h3>
                </div>
                <Link to="/admin/vendors?status=pending" style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>
                  Manage All &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pendingVendorsList.slice(0, 3).map((v) => (
                  <div
                    key={v._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#FFFBEB',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #FEF3C7'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                        {v.vendorProfile?.storeName || v.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Owner: {v.name} • {v.email}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleVendorAction(v._id, 'approved')}
                        disabled={actionInProgress === v._id}
                        style={{
                          backgroundColor: '#10B981',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle2 size={13} /> Approve
                      </button>

                      <button
                        onClick={() => handleVendorAction(v._id, 'rejected')}
                        disabled={actionInProgress === v._id}
                        style={{
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Revenue Chart Section */}
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
                  Marketplace Platform Volume
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  Total gross merchandise sales processed through simulated payment gateway
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                Period: {dateRange.toUpperCase()}
              </span>
            </div>

            {data?.revenueChart && data.revenueChart.length > 0 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.revenueChart}>
                    <defs>
                      <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Marketplace Volume']}
                      contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '6px', border: 'none', fontSize: '0.8rem' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#adminRevGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                No historical sales recorded yet.
              </div>
            )}
          </div>

          {/* Recent Orders Overview */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Recent Platform Orders
              </h3>
              <Link to="/admin/orders" style={{ fontSize: '0.8125rem', color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>
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
                      <th>Items</th>
                      <th>Grand Total</th>
                      <th>Payment</th>
                      <th>Status</th>
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
                          <div style={{ fontWeight: 500 }}>{o.customerInfo?.name || 'Customer'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{o.customerInfo?.email}</div>
                        </td>
                        <td>{o.items?.length || 0} product(s)</td>
                        <td>
                          <strong style={{ color: '#0F172A' }}>₹{o.grandTotal?.toLocaleString('en-IN')}</strong>
                        </td>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor: o.paymentStatus === 'paid' ? '#ECFDF5' : '#FEF3C7',
                              color: o.paymentStatus === 'paid' ? '#065F46' : '#92400E',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}
                          >
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor:
                                o.orderStatus === 'delivered'
                                  ? '#ECFDF5'
                                  : o.orderStatus === 'shipped'
                                  ? '#EEF2FF'
                                  : '#F8FAFC',
                              color:
                                o.orderStatus === 'delivered'
                                  ? '#065F46'
                                  : o.orderStatus === 'shipped'
                                  ? '#3730A3'
                                  : '#334155',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid #E2E8F0'
                            }}
                          >
                            {o.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>
                No customer orders placed yet.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
