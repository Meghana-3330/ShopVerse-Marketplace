import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ShoppingBag, ArrowRight, ShieldCheck, Store, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AlertBanner from '../../components/common/AlertBanner';

const CustomerLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        // Direct to role-appropriate portal if coming from general login
        if (redirectPath === '/') {
          if (res.user.role === 'admin') navigate('/admin/dashboard');
          else if (res.user.role === 'vendor') navigate('/vendor/dashboard');
          else navigate('/customer/dashboard');
        } else {
          navigate(redirectPath);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick fill helper for evaluator ease of testing
  const quickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="container page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="card fade-in" style={{ padding: '2.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 800,
                fontSize: '1.5rem',
                color: 'var(--primary)',
                marginBottom: '1rem'
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <ShoppingBag size={22} />
              </div>
              <span>Shop<span style={{ color: '#0F172A' }}>Verse</span></span>
            </Link>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Welcome Back</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Sign in to manage your orders, vendor catalog, or marketplace
            </p>
          </div>

          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)'
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill Helper */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ⚡ One-Click Demo Accounts (Internship Evaluation)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => quickFill('admin@marketplace.com', 'admin123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'flex-start', color: '#5B21B6' }}
              >
                <ShieldCheck size={14} /> Admin
              </button>
              <button
                type="button"
                onClick={() => quickFill('vendor1@marketplace.com', 'vendor123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'flex-start', color: 'var(--primary)' }}
              >
                <Store size={14} /> Vendor (Approved)
              </button>
              <button
                type="button"
                onClick={() => quickFill('customer@marketplace.com', 'customer123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'flex-start', color: 'var(--success-dark)' }}
              >
                <User size={14} /> Customer
              </button>
              <button
                type="button"
                onClick={() => quickFill('pending@marketplace.com', 'vendor123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'flex-start', color: 'var(--warning-dark)' }}
              >
                <Store size={14} /> Vendor (Pending)
              </button>
            </div>
          </div>

          {/* Registration link footer */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Create customer account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
