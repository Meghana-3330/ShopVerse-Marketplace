import React, { useState, useEffect } from 'react';
import { Store, Image, Phone, Mail, MapPin, Save } from 'lucide-react';
import VendorSidebar from '../../components/dashboard/VendorSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertBanner from '../../components/common/AlertBanner';
import { vendorService } from '../../services/vendorService';

const VendorStoreProfilePage = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    storeLogo: '',
    phone: '',
    email: '',
    address: ''
  });

  const [storeStatus, setStoreStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await vendorService.getProfile();
        if (res.success && res.vendorProfile) {
          const vp = res.vendorProfile;
          setFormData({
            storeName: vp.storeName || '',
            storeDescription: vp.storeDescription || '',
            storeLogo: vp.storeLogo || '',
            phone: vp.contactDetails?.phone || '',
            email: vp.contactDetails?.email || '',
            address: vp.contactDetails?.address || ''
          });
          setStoreStatus(vp.status || 'pending');
        }
      } catch (err) {
        setError('Failed to load store profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await vendorService.updateProfile({
        storeName: formData.storeName,
        storeDescription: formData.storeDescription,
        storeLogo: formData.storeLogo,
        contactDetails: {
          phone: formData.phone,
          email: formData.email,
          address: formData.address
        }
      });

      if (res.success) {
        setMessage('Store profile and public brand information updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save store profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading store settings..." />;

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <VendorSidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Store Brand Profile</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Customize your public storefront details, logo visual, and customer inquiry contacts
            </p>
          </div>

          {message && <AlertBanner type="success" message={message} onClose={() => setMessage('')} />}
          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit}>
            {/* Store Information */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Store size={20} color="var(--primary)" /> Storefront Identity
                </h2>
                <span className={`badge ${storeStatus === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                  Verification Status: {storeStatus.toUpperCase()}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Store Public Name</label>
                <input
                  type="text"
                  required
                  name="storeName"
                  className="form-control"
                  value={formData.storeName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">About the Store / Bio</label>
                <textarea
                  required
                  rows={3}
                  name="storeDescription"
                  className="form-control"
                  value={formData.storeDescription}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Store Logo / Brand Banner Image URL</label>
                <input
                  type="url"
                  name="storeLogo"
                  className="form-control"
                  value={formData.storeLogo}
                  onChange={handleChange}
                />
              </div>

              {formData.storeLogo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={formData.storeLogo} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Storefront logo visual preview</span>
                </div>
              )}
            </div>

            {/* Contact Details */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Customer Support & Inquiries</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Support Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Support Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Business / Dispatch Warehouse Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. Textile Market, Surat, Gujarat"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn btn-lg btn-primary">
              <Save size={18} /> {saving ? 'Saving...' : 'Save Store Profile'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default VendorStoreProfilePage;
