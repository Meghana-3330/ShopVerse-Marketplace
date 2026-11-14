import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, ShieldCheck, Award, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container page-wrapper">
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '3.5rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Our Story & Mission
        </span>
        <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
          Empowering Independent Vendors, Delightful Shopping for Everyone
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          ShopVerse is a modern multi-vendor commerce platform engineered from scratch on the MERN stack. We unite independent craftspeople, national brand distributors, and modern boutiques under one high-speed marketplace.
        </p>
      </div>

      {/* Feature cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.75rem',
          marginBottom: '4rem'
        }}
      >
        <div className="card" style={{ padding: '2rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <Users size={26} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Multi-Vendor Architecture</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Customers can combine products from multiple independent vendors in a single unified checkout cart. Orders are atomically separated and routed to each respective seller.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Admin Moderation & Quality</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Every vendor undergoes an administrative review and approval workflow before listing inventory. Products are actively monitored to protect customer trust.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--warning-light)',
              color: 'var(--warning-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <Award size={26} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Production-Grade Security</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Robust bcrypt password encryption, JWT authentication, role-based authorization, rate-limiting, and server-side price recalculation at checkout.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          borderRadius: 'var(--radius-xl)',
          color: '#FFFFFF',
          padding: '3rem',
          textAlign: 'center'
        }}
      >
        <h2 style={{ color: '#FFFFFF', fontSize: '2rem', marginBottom: '0.75rem' }}>
          Ready to Experience the Marketplace?
        </h2>
        <p style={{ color: '#E0E7FF', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto 2rem' }}>
          Start exploring thousands of curated items, or apply to register your independent store today.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn btn-lg btn-primary" style={{ backgroundColor: '#FFFFFF', color: 'var(--primary)' }}>
            Start Shopping
          </Link>
          <Link to="/vendor/register" className="btn btn-lg btn-outline" style={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}>
            Sell With Us <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
