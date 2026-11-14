import React, { useState, useEffect } from 'react';
import { Package, Search, Eye, CheckCircle, Ban, Store } from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import Pagination from '../../components/common/Pagination';
import { adminService } from '../../services/adminService';

const ManageAllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminService.getProducts({
        search: search || undefined,
        category: category !== 'All' ? category : undefined,
        page,
        limit: 15
      });

      if (res.success) {
        setProducts(res.products || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch catalog products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleToggleStatus = async (id, name, isActive) => {
    const action = isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} product "${name}"?`)) return;

    setError('');
    setMessage('');

    try {
      const res = await adminService.toggleProductStatus(id);
      if (res.success) {
        setMessage(res.message);
        fetchProducts();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle product status.');
    }
  };

  const categories = ['All', 'Fashion', 'Electronics', 'Home & Kitchen', 'Beauty', 'Books', 'Sports', 'Accessories', 'Footwear'];

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <AdminSidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Marketplace Product Catalog</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Inspect and moderate all active & inactive products listed by sellers across the platform
            </p>
          </div>

          {message && <AlertBanner type="success" message={message} onClose={() => setMessage('')} />}
          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          {/* Search & Category Filter */}
          <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 240px' }}>
              <input
                type="text"
                placeholder="Search catalog by title..."
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
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Category:</span>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="form-select"
                style={{ width: 'auto', height: '38px', fontSize: '0.875rem' }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading catalog listings..." />
          ) : products.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <Package size={44} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>No Products Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No products match the selected criteria.
              </p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Vendor / Seller</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Catalog Status</th>
                      <th style={{ textAlign: 'right' }}>Moderation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                              alt={p.name}
                              style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                            />
                            <div>
                              <strong style={{ fontSize: '0.9rem', display: 'block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {p.name}
                              </strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {p.sku || 'N/A'}</span>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge-primary">{p.category}</span></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                            <Store size={14} /> {p.vendorStoreName || p.vendor?.vendorProfile?.storeName || 'Vendor'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {p.vendor?.name}
                          </div>
                        </td>
                        <td><strong>₹{p.price.toLocaleString('en-IN')}</strong></td>
                        <td>{p.stock} units</td>
                        <td>
                          <span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>
                            {p.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleToggleStatus(p._id, p.name, p.isActive)}
                            className={`btn btn-sm ${p.isActive ? 'btn-outline' : 'btn-primary'}`}
                            style={{
                              color: p.isActive ? 'var(--danger)' : '#FFFFFF',
                              borderColor: p.isActive ? 'var(--danger-light)' : undefined,
                              fontSize: '0.75rem',
                              padding: '0.35rem 0.65rem'
                            }}
                          >
                            {p.isActive ? <Ban size={14} /> : <CheckCircle size={14} />}
                            {p.isActive ? 'Deactivate' : 'Reactivate'}
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
        </main>
      </div>
    </div>
  );
};

export default ManageAllProductsPage;
