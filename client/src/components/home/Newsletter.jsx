import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem 2rem',
        marginBottom: '3.5rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}
        >
          <Mail size={26} />
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.65rem' }}>
          Subscribe to Exclusive Deals & Vendor Drops
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
          Get ₹200 off your first multi-vendor marketplace order, plus weekly flash discounts and new seller alerts directly to your inbox.
        </p>

        {subscribed ? (
          <div
            className="fade-in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success-dark)',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.925rem'
            }}
          >
            <CheckCircle2 size={18} /> Thank you! You've been subscribed to ShopVerse VIP perks.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.65rem',
              justifyContent: 'center',
              maxWidth: '480px',
              margin: '0 auto'
            }}
          >
            <input
              type="email"
              required
              placeholder="Enter your personal email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              style={{
                flex: '1 1 260px',
                height: '46px',
                borderRadius: 'var(--radius-md)'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ height: '46px', padding: '0 1.5rem' }}
            >
              Subscribe
            </button>
          </form>
        )}

        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '1rem' }}>
          We respect your privacy. No spam ever. Unsubscribe at any time.
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
