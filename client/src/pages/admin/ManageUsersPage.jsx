import React, { useState, useEffect } from 'react';
import { Users, Search, Ban, CheckCircle, ShieldAlert, Store, User } from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import Pagination from '../../components/common/Pagination';
import { adminService } from '../../services/adminService';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        search: search || undefined,
        role: role !== 'all' ? role : undefined,
        page,
        limit: 15
      });

      if (res.success) {
        setUsers(res.users || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleSuspend = async (id, name, isSuspended) => {
    const action = isSuspended ? 'reactivate' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${action} the account for "${name}"?`)) {
      return;
    }

    try {
      const res = await adminService.toggleUserSuspension(id);
      if (res.success) {
        setMessage(res.message);
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} user.`);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <AdminSidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>User Directory Management</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Inspect registered accounts, filter by role, and manage account authorization status
            </p>
          </div>

          {message && <AlertBanner type="success" message={message} onClose={() => setMessage('')} />}
          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          {/* Search & Filter Bar */}
          <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 240px' }}>
              <input
                type="text"
                placeholder="Search user by name or email..."
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
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Role Filter:</span>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setPage(1);
                }}
                className="form-select"
                style={{ width: 'auto', height: '38px', fontSize: '0.875rem' }}
              >
                <option value="all">All Roles</option>
                <option value="customer">Customers Only</option>
                <option value="vendor">Vendors Only</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <LoadingSpinner text="Querying user records..." />
          ) : users.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <Users size={44} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>No Users Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No accounts found matching your filter criteria.
              </p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Joined Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                backgroundColor: u.role === 'admin' ? 'var(--accent-purple-light)' : u.role === 'vendor' ? 'var(--primary-light)' : 'var(--success-light)',
                                color: u.role === 'admin' ? '#5B21B6' : u.role === 'vendor' ? 'var(--primary)' : 'var(--success-dark)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.85rem'
                              }}
                            >
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong style={{ fontSize: '0.9rem' }}>{u.name}</strong>
                              {u.role === 'vendor' && u.vendorProfile?.storeName && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                                  Store: {u.vendorProfile.storeName}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span
                            className={`badge ${
                              u.role === 'admin' ? 'badge-purple' : u.role === 'vendor' ? 'badge-primary' : 'badge-success'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td>{u.phone || 'N/A'}</td>
                        <td>
                          <span className={`badge ${u.isSuspended ? 'badge-danger' : 'badge-success'}`}>
                            {u.isSuspended ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleToggleSuspend(u._id, u.name, u.isSuspended)}
                              className={`btn btn-sm ${u.isSuspended ? 'btn-primary' : 'btn-outline'}`}
                              style={{
                                color: u.isSuspended ? '#FFFFFF' : 'var(--danger)',
                                borderColor: u.isSuspended ? undefined : 'var(--danger-light)',
                                fontSize: '0.75rem',
                                padding: '0.35rem 0.65rem'
                              }}
                            >
                              {u.isSuspended ? <CheckCircle size={14} /> : <Ban size={14} />}
                              {u.isSuspended ? 'Reactivate' : 'Suspend'}
                            </button>
                          )}
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
        </main>
      </div>
    </div>
  );
};

export default ManageUsersPage;
