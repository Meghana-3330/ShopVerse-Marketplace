import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PackagePlus, ArrowLeft, Image, Check, AlertCircle } from 'lucide-react';
import VendorSidebar from '../../components/dashboard/VendorSidebar';
import AlertBanner from '../../components/common/AlertBanner';
import { vendorService } from '../../services/vendorService';
import { useAuth } from '../../context/AuthContext';

const AddProductPage = () => {
  const { isVendorApproved, user } = useAuth();
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
    isFeatured: false,
    isTrending: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'Fashion',
    'Electronics',
    'Home & Kitchen',
    'Beauty',
    'Books',
    'Sports',
    'Accessories',
    'Footwear'
  ];

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
    if (!isVendorApproved) {
      setError('Your vendor account is pending administrator approval. You cannot add products yet.');
      return;
    }

    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      setError('Please provide product name, description, price, and stock quantity.');
      return;
    }

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
        sku: formData.sku || undefined,
        images: formData.imageUrl ? [formData.imageUrl] : undefined,
        isFeatured: formData.isFeatured,
        isTrending: formData.isTrending
      };

      const res = await vendorService.createProduct(payload);

      if (res.success) {
        setSuccess('Product listed successfully in marketplace catalog!');
        setTimeout(() => {
          navigate('/vendor/products');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <VendorSidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '1.75rem' }}>
            <Link to="/vendor/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <ArrowLeft size={14} /> Back to Inventory
            </Link>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Add New Marketplace Product</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Create an item listing under your verified vendor store: <strong>{user?.vendorProfile?.storeName}</strong>
            </p>
          </div>

          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
          {success && <AlertBanner type="success" message={success} />}

          {!isVendorApproved && (
            <div
              className="card"
              style={{
                backgroundColor: 'var(--warning-light)',
                borderColor: '#FDE68A',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center'
              }}
            >
              <AlertCircle size={22} color="var(--warning-dark)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.875rem', color: 'var(--warning-dark)' }}>
                <strong>Account Pending Verification:</strong> You may prepare draft details, but submitting requires an approved vendor account.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>General Product Information</h2>

              <div className="form-group">
                <label className="form-label">Product Title / Name *</label>
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="e.g. Pure Cotton Embroidered Kurti or Studio Wireless ANC Headphones"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  name="description"
                  placeholder="Describe material, specifications, sizing, key benefits, and warranty..."
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Marketplace Category *</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Brand Name</label>
                  <input
                    type="text"
                    name="brand"
                    placeholder="e.g. Aura Traditions"
                    className="form-control"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SKU (Leave empty to auto-generate)</label>
                  <input
                    type="text"
                    name="sku"
                    placeholder="e.g. KURTI-001"
                    className="form-control"
                    value={formData.sku}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Pricing & Stock Inventory</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    name="price"
                    placeholder="e.g. 699"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Original Price (₹) (For Strikethrough Discount)</label>
                  <input
                    type="number"
                    min="1"
                    name="originalPrice"
                    placeholder="e.g. 1299"
                    className="form-control"
                    value={formData.originalPrice}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Available Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    name="stock"
                    placeholder="e.g. 30"
                    className="form-control"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Media Image URL */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Image size={20} color="var(--primary)" /> Product Visuals
              </h2>

              <div className="form-group">
                <label className="form-label">Product Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://images.unsplash.com/photo-..."
                  className="form-control"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Paste any high-resolution image URL (Unsplash, Cloudinary, etc.) or leave blank for high-definition placeholder.
                </span>
              </div>

              {formData.imageUrl && (
                <div style={{ marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Image Preview:</span>
                  <div style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Badges / Visibility */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Marketplace Visibility Tags</h3>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                  />
                  <span>Mark as Featured Product</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    name="isTrending"
                    checked={formData.isTrending}
                    onChange={handleChange}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                  />
                  <span>Mark as Trending Deal</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !isVendorApproved}
              className="btn btn-lg btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <PackagePlus size={20} /> {submitting ? 'Publishing Product...' : 'Publish to Marketplace Catalog'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddProductPage;
