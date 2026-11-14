import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import AlertBanner from '../../components/common/AlertBanner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container page-wrapper">
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.65rem' }}>Contact Customer Support</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Have questions regarding an order, multi-vendor shipping, or vendor onboarding? We're here to assist.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}
      >
        {/* Contact Info Card */}
        <div className="card" style={{ padding: '2.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Get in Touch</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <MapPin size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>Corporate Headquarters</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Level 5, Tower B, Tech Park, Indiranagar, Bengaluru, Karnataka 560038
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Phone size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>Phone Support</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  +91 (80) 4123-5678 (Mon-Sat, 9 AM - 7 PM IST)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--warning-light)',
                  color: 'var(--warning-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Mail size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>Email Assistance</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  support@shopverse-marketplace.com
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.825rem',
              color: 'var(--text-muted)'
            }}
          >
            Looking to partner as a vendor? Visit our{' '}
            <a href="/vendor/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Vendor Registration Portal
            </a>.
          </div>
        </div>

        {/* Message Form */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Send Us a Message</h2>

          {submitted && (
            <AlertBanner
              type="success"
              message="Your inquiry has been received! Our support team will reply within 24 hours."
              onClose={() => setSubmitted(false)}
            />
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Order Tracking or Return Request"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message Details</label>
              <textarea
                required
                rows={4}
                className="form-control"
                placeholder="Provide details regarding your inquiry..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
