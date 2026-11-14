import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, ShoppingBag, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AlertBanner from '../../components/common/AlertBanner';

const CustomerRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'customer'
      });

      if (res.success) {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div className="card fade-in" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 800,
                fontSize: '1.5rem',
                color: 'var(--primary)',
                marginBottom: '0.75rem'
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <ShoppingBag size={20} />
              </div>
              <span>Shop<span style={{ color: '#0F172A' }}>Verse</span></span>
            </Link>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>Create Customer Account</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Join thousands of happy shoppers enjoying verified multi-vendor products
            </p>
          </div>

          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="e.g. Rahul Verma"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.name}
                  onChange={handleChange}
                />
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="rahul@example.com"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.email}
                  onChange={handleChange}
                />
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  name="password"
                  placeholder="At least 6 characters"
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
                  placeholder="Repeat your password"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {submitting ? 'Creating Account...' : 'Register & Start Shopping'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.825rem' }}>
            Want to sell products?{' '}
            <Link to="/vendor/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Register as a Marketplace Vendor &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegisterPage;
