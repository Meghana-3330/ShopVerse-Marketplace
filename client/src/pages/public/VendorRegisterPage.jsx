import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, Mail, Phone, Lock, FileText, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AlertBanner from '../../components/common/AlertBanner';

const VendorRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    storeName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    storeDescription: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await register({
        name: formData.name,
        storeName: formData.storeName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        storeDescription: formData.storeDescription,
        role: 'vendor'
      });

      if (res.success) {
        setRegisteredSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Vendor registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (registeredSuccess) {
    return (
      <div className="container page-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card fade-in" style={{ maxWidth: '520px', padding: '3rem 2rem', textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: 'var(--warning-light)',
              color: 'var(--warning-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            <Clock size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.65rem' }}>
            Application Submitted Successfully!
          </h2>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Thank you for applying to sell on ShopVerse. Your vendor store <strong>"{formData.storeName}"</strong> has been registered with <strong>PENDING APPROVAL</strong> status. An administrator will review your application shortly.
          </p>

          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              fontSize: '0.85rem',
              color: 'var(--text-main)',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>Internship Demonstration Note:</div>
            <div>
              You can log in as Administrator (<code style={{ color: 'var(--primary)' }}>admin@marketplace.com</code> / <code style={{ color: 'var(--primary)' }}>admin123</code>) to review and approve this vendor in the <strong>Admin Vendor Management</strong> panel.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/vendor/dashboard')}
              className="btn btn-primary"
            >
              Go to Vendor Portal
            </button>
            <Link to="/" className="btn btn-outline">
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>
        <div className="card fade-in" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <Store size={26} />
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>Open Your Marketplace Store</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Sell your products alongside verified vendors with unified cart fulfillment
            </p>
          </div>

          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Owner Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder="e.g. Priya Patel"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Store / Brand Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    name="storeName"
                    placeholder="e.g. ElectroTech Gadgets"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.storeName}
                    onChange={handleChange}
                  />
                  <Store size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Business Email</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="vendor@store.com"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Business Phone</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    required
                    name="phone"
                    placeholder="+91 98765 22222"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    name="password"
                    placeholder="Min 6 characters"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    name="confirmPassword"
                    placeholder="Repeat password"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Store Description & Merchandise Overview</label>
              <textarea
                required
                rows={3}
                name="storeDescription"
                placeholder="Describe your product catalog, categories you specialize in, and brand heritage..."
                className="form-control"
                value={formData.storeDescription}
                onChange={handleChange}
              />
            </div>

            <div
              style={{
                backgroundColor: 'var(--warning-light)',
                border: '1px solid #FDE68A',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                fontSize: '0.825rem',
                color: 'var(--warning-dark)',
                marginBottom: '1.25rem'
              }}
            >
              Note: Vendor applications are submitted with <strong>Pending Approval</strong> status. An administrator must approve your application before product inventory can be activated on the marketplace.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
            >
              {submitting ? 'Submitting Vendor Application...' : 'Submit Vendor Application'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already a registered vendor?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Vendor Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegisterPage;
