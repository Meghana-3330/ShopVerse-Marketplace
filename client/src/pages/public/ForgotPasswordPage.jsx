import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';
import AlertBanner from '../../components/common/AlertBanner';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Request, 2: Reset
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        setMessage(res.message);
        if (res.resetCode) setResetCode(res.resetCode);
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authService.resetPassword({
        email,
        resetCode,
        newPassword
      });

      if (res.success) {
        setIsSuccess(true);
        setMessage(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="card fade-in" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <KeyRound size={24} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>Reset Password</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {step === 1 ? 'Enter your account email to receive a recovery code' : 'Set your new secure password'}
            </p>
          </div>

          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
          {message && <AlertBanner type="success" message={message} />}

          {isSuccess ? (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                Proceed to Sign In
              </Link>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleRequestReset}>
              <div className="form-group">
                <label className="form-label">Account Email Address</label>
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
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
              >
                {loading ? 'Sending code...' : 'Send Recovery Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label className="form-label">Recovery Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RESET-2026"
                  className="form-control"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Confirm new password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <Link
              to="/login"
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <ArrowLeft size={15} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
