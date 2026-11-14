import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Store, Check, X, Ban, Search, Clock, ShieldCheck, Mail, Phone } from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { adminService } from '../../services/adminService';

const ManageVendorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await adminService.getVendors({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search || undefined
      });

      if (res.success) {
        setVendors(res.vendors || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vendor applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [statusFilter]);

  const handleUpdateStatus = async (vendorId, storeName, newStatus) => {
    const confirmText = `Are you sure you want to change store status for "${storeName}" to "${newStatus.toUpperCase()}"?`;
    if (!window.confirm(confirmText)) return;

    setError('');
    setMessage('');

    try {
      const res = await adminService.updateVendorStatus(vendorId, newStatus);
      if (res.success) {
        setMessage(`Vendor "${storeName}" status updated to "${newStatus}".`);
        fetchVendors();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update vendor status.');
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <AdminSidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Vendor Approvals & Partner Stores</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Review merchant onboarding applications, grant marketplace seller access, and manage store statuses
            </p>
          </div>

          {message && <AlertBanner type="success" message={message} onClose={() => setMessage('')} />}
          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          {/* Search and Status Pills */}
          <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 240px' }}>
              <input
                type="text"
                placeholder="Search vendor or store name..."
                className="form-control"
                style={{ height: '38px', fontSize: '0.875rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="button"
                onClick={fetchVendors}
                className="btn btn-primary btn-sm"
                style={{ padding: '0 0.85rem' }}
              >
                <Search size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setSearchParams(e.target.value !== 'all' ? { status: e.target.value } : {});
                }}
                className="form-select"
                style={{ width: 'auto', height: '38px', fontSize: '0.875rem' }}
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved Stores</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading vendor applications..." />
          ) : vendors.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <Store size={44} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>No Vendors Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No vendor records match the selected status filter.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {vendors.map((v) => {
                const vp = v.vendorProfile || {};
                const currentStatus = vp.status || 'pending';

                return (
                  <div key={v._id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {vp.storeLogo ? (
                            <img src={vp.storeLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Store size={26} />
                          )}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                              {vp.storeName || `${v.name}'s Store`}
                            </h3>
                            <span
                              className={`badge ${
                                currentStatus === 'approved'
                                  ? 'badge-success'
                                  : currentStatus === 'pending'
                                  ? 'badge-warning'
                                  : 'badge-danger'
                              }`}
                            >
                              {currentStatus.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Owner: <strong>{v.name}</strong> • Email: {v.email} • Phone: {v.phone || 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Action Decision Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {currentStatus !== 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(v._id, vp.storeName || v.name, 'approved')}
                            className="btn btn-sm btn-primary"
                            style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}
                          >
                            <Check size={15} /> Approve Store
                          </button>
                        )}

                        {currentStatus === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(v._id, vp.storeName || v.name, 'rejected')}
                            className="btn btn-sm btn-outline"
                            style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
                          >
                            <X size={15} /> Reject
                          </button>
                        )}

                        {currentStatus === 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(v._id, vp.storeName || v.name, 'suspended')}
                            className="btn btn-sm btn-outline"
                            style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
                          >
                            <Ban size={15} /> Suspend Store
                          </button>
                        )}

                        {currentStatus === 'suspended' && (
                          <button
                            onClick={() => handleUpdateStatus(v._id, vp.storeName || v.name, 'approved')}
                            className="btn btn-sm btn-outline"
                          >
                            Re-Approve Store
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Store Description & Metadata */}
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1rem', backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                      <strong>Store Description: </strong>
                      {vp.storeDescription || 'No description provided during registration.'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>Joined: {new Date(v.createdAt).toLocaleDateString()}</span>
                      <span>Catalog: <strong>{v.productCount || 0} Products</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageVendorsPage;
