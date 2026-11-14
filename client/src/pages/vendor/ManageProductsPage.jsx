import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  PackageX
} from 'lucide-react';
import VendorSidebar from '../../components/dashboard/VendorSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import Pagination from '../../components/common/Pagination';
import { vendorService } from '../../services/vendorService';
import { useAuth } from '../../context/AuthContext';

const ManageProductsPage = () => {
  const { isVendorApproved } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchVendorProducts = async () => {
    setLoading(true);
    try {
      const res = await vendorService.getProducts({
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
      setError(err.response?.data?.message || 'Failed to fetch vendor products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorProducts();
  }, [category, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVendorProducts();
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from your store catalog? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await vendorService.deleteProduct(id);
      if (res.success) {
        setMessage(`Product "${name}" deleted successfully.`);
        fetchVendorProducts();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const categories = ['All', 'Fashion', 'Electronics', 'Home & Kitchen', 'Beauty', 'Books', 'Sports', 'Accessories', 'Footwear'];

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <VendorSidebar />

        <main className="dashboard-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Store Product Inventory</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Manage listings, update stock levels, and monitor SKU availability
              </p>
            </div>

            {isVendorApproved && (
              <Link to="/vendor/add-product" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={16} /> Add Product
              </Link>
            )}
          </div>

          {message && <AlertBanner type="success" message={message} onClose={() => setMessage('')} />}
          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          {/* Search & Filter Bar */}
          <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 240px' }}>
              <input
                type="text"
                placeholder="Search products by title or brand..."
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

          {/* Products Table */}
          {loading ? (
            <LoadingSpinner text="Loading inventory records..." />
          ) : products.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <PackageX size={44} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>No Products in Inventory</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                You haven't added any products matching this search.
              </p>
              {isVendorApproved && (
                <Link to="/vendor/add-product" className="btn btn-primary btn-sm">
                  Add Your First Product
                </Link>
              )}
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Level</th>
                      <th>SKU</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const isOutOfStock = p.stock <= 0;
                      const isLowStock = p.stock > 0 && p.stock <= 5;

                      return (
                        <tr key={p._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                                alt={p.name}
                                style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                              />
                              <div>
                                <strong style={{ fontSize: '0.9rem', display: 'block', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {p.name}
                                </strong>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Brand: {p.brand || 'Generic'}</span>
                              </div>
                            </div>
                          </td>
                          <td><span className="badge badge-primary">{p.category}</span></td>
                          <td>
                            <div style={{ fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</div>
                            {p.originalPrice > p.price && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </div>
                            )}
                          </td>
                          <td>
                            <span
                              style={{
                                fontWeight: 700,
                                color: isOutOfStock ? 'var(--danger)' : isLowStock ? 'var(--warning-dark)' : 'var(--success-dark)'
                              }}
                            >
                              {p.stock} units
                            </span>
                            {isOutOfStock && <span className="badge badge-danger" style={{ display: 'block', width: 'fit-content', marginTop: '2px', fontSize: '0.65rem' }}>Out of Stock</span>}
                            {isLowStock && <span className="badge badge-warning" style={{ display: 'block', width: 'fit-content', marginTop: '2px', fontSize: '0.65rem' }}>Low Stock</span>}
                          </td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.sku || 'N/A'}</td>
                          <td>
                            <span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>
                              {p.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                              <Link
                                to={`/products/${p._id}`}
                                className="btn btn-outline btn-sm btn-icon"
                                title="View live page"
                              >
                                <Eye size={15} />
                              </Link>
                              <Link
                                to={`/vendor/products/edit/${p._id}`}
                                className="btn btn-outline btn-sm btn-icon"
                                title="Edit product"
                              >
                                <Edit2 size={15} color="var(--primary)" />
                              </Link>
                              <button
                                onClick={() => handleDeleteProduct(p._id, p.name)}
                                className="btn btn-outline btn-sm btn-icon"
                                title="Delete product"
                              >
                                <Trash2 size={15} color="var(--danger)" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ padding: '1rem' }}>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageProductsPage;
