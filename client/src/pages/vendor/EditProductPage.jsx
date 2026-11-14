import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Image, Trash2, AlertCircle } from 'lucide-react';
import VendorSidebar from '../../components/dashboard/VendorSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { productService } from '../../services/productService';
import { vendorService } from '../../services/vendorService';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Fashion',
    price: '',
    originalPrice: '',
    stock: '',
    brand: '',
    sku: '',
    imageUrl: '',
    isActive: true,
    isFeatured: false,
    isTrending: false
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = ['Fashion', 'Electronics', 'Home & Kitchen', 'Beauty', 'Books', 'Sports', 'Accessories', 'Footwear'];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getProductById(id);
        if (res.success && res.product) {
          const p = res.product;
          setFormData({
            name: p.name || '',
            description: p.description || '',
            category: p.category || 'Fashion',
            price: p.price || '',
            originalPrice: p.originalPrice || '',
            stock: p.stock !== undefined ? p.stock : '',
            brand: p.brand || '',
            sku: p.sku || '',
            imageUrl: p.images?.[0] || '',
            isActive: p.isActive !== undefined ? p.isActive : true,
            isFeatured: !!p.isFeatured,
            isTrending: !!p.isTrending
          });
        }
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        stock: Number(formData.stock),
        brand: formData.brand || 'Generic',
        sku: formData.sku,
        images: formData.imageUrl ? [formData.imageUrl] : undefined,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        isTrending: formData.isTrending
      };

      const res = await vendorService.updateProduct(id, payload);
      if (res.success) {
        setSuccess('Product updated successfully!');
        setTimeout(() => navigate('/vendor/products'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching product data..." />;

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <VendorSidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '1.75rem' }}>
            <Link to="/vendor/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <ArrowLeft size={14} /> Back to Products
            </Link>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Edit Product Listing</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Modify product details, adjust inventory pricing, or update stock
            </p>
          </div>

          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
          {success && <AlertBanner type="success" message={success} />}

          <form onSubmit={handleSubmit}>
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>General Details</h2>

              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  required
                  rows={4}
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input type="text" name="brand" className="form-control" value={formData.brand} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">SKU</label>
                  <input type="text" name="sku" className="form-control" value={formData.sku} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Pricing & Stock Quantity</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Selling Price (₹)</label>
                  <input type="number" required min="1" name="price" className="form-control" value={formData.price} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input type="number" min="1" name="originalPrice" className="form-control" value={formData.originalPrice} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input type="number" required min="0" name="stock" className="form-control" value={formData.stock} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Visual Asset</h2>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="url" name="imageUrl" className="form-control" value={formData.imageUrl} onChange={handleChange} />
              </div>

              {formData.imageUrl && (
                <div style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', marginTop: '0.75rem' }}>
                  <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            {/* Visibility Settings */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Active & Visibility Controls</h3>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
                  <span style={{ fontWeight: 600 }}>Active in Public Marketplace Catalog</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
                  <span>Featured Collection</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
                  <span>Trending Deal</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-lg btn-primary">
              <Save size={18} /> {submitting ? 'Saving...' : 'Update Product Listing'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditProductPage;
