import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, Store, MapPin, Printer } from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import Pagination from '../../components/common/Pagination';
import { adminService } from '../../services/adminService';

const ManageAllOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders({
        search: search || undefined,
        status: status !== 'all' ? status : undefined,
        page,
        limit: 15
      });

      if (res.success) {
        setOrders(res.orders || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch marketplace orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setError('');
    setMessage('');

    try {
      const res = await adminService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setMessage(res.message);
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.order);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const allowedStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <AdminSidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Marketplace Order Operations</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Track multi-vendor dispatching, customer destinations, and oversee marketplace fulfillment lifecycle
            </p>
          </div>

          {message && <AlertBanner type="success" message={message} onClose={() => setMessage('')} />}
          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          {/* Search & Status Filter */}
          <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 260px' }}>
              <input
                type="text"
                placeholder="Search order number or customer email..."
                className="form-control"
                style={{ height: '38px', fontSize: '0.875rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0 0.85rem' }}>
                <Search size={15} />
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="form-select"
                style={{ width: 'auto', height: '38px', fontSize: '0.875rem' }}
              >
                <option value="all">All Statuses ({totalCount})</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
            <LoadingSpinner text="Retrieving marketplace orders..." />
          ) : orders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <ShoppingBag size={44} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>No Orders Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No customer orders match the selected search or status criteria.
              </p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order No</th>
                      <th>Customer Info</th>
                      <th>Multi-Vendor Items</th>
                      <th>Grand Total</th>
                      <th>Order Status</th>
                      <th>Update Status</th>
                      <th style={{ textAlign: 'right' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <strong>#{order.orderNumber}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div>{order.customerInfo?.name || order.customer?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customerInfo?.email}</div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{order.items?.length || 0} Products</span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                            {Array.from(new Set(order.items?.map((i) => i.vendorStoreName))).join(', ')}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800 }}>₹{order.grandTotal.toLocaleString('en-IN')}</div>
                          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              order.orderStatus === 'delivered'
                                ? 'badge-success'
                                : order.orderStatus === 'shipped'
                                ? 'badge-primary'
                                : order.orderStatus === 'cancelled'
                                ? 'badge-danger'
                                : 'badge-warning'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="form-select"
                            style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          >
                            {allowedStatuses.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn btn-outline btn-sm btn-icon"
                            title="Inspect order details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ padding: '1rem' }}>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
              </div>
            </div>
          )}

          {/* Order Details Modal for Admin */}
          {selectedOrder && (
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
              onClick={() => setSelectedOrder(null)}
            >
              <div
                className="card fade-in"
                style={{
                  width: '100%',
                  maxWidth: '750px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '2rem'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem' }}>Order #{selectedOrder.orderNumber}</h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Placed: {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} style={{ fontSize: '1.5rem', cursor: 'pointer' }}>
                    &times;
                  </button>
                </div>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  <strong>Shipping To:</strong> {selectedOrder.customerInfo?.name} ({selectedOrder.customerInfo?.phone})<br />
                  {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Order Items & Associated Vendors:</h3>
                <div className="table-responsive" style={{ marginBottom: '1.25rem' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Associated Vendor</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Fulfillment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td><strong>{item.name}</strong></td>
                          <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{item.vendorStoreName || 'Vendor'}</td>
                          <td>₹{item.price.toLocaleString('en-IN')}</td>
                          <td>{item.quantity}</td>
                          <td><span className="badge badge-warning">{item.itemStatus}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Payment Method:</span>{' '}
                    <strong>{selectedOrder.paymentMethod?.toUpperCase()}</strong>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                    Total: ₹{selectedOrder.grandTotal?.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageAllOrdersPage;
