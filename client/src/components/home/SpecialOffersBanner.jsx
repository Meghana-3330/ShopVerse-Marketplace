import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Flame, ArrowRight } from 'lucide-react';

const SpecialOffersBanner = () => {
  // Simulated countdown timer: 8 hours, 32 mins, 14 secs
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 32,
    seconds: 14
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #BE185D 0%, #E11D48 50%, #F43F5E 100%)',
        borderRadius: 'var(--radius-xl)',
        color: '#FFFFFF',
        padding: '2.5rem 2rem',
        marginBottom: '3.5rem',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem'
        }}
      >
        <div style={{ maxWidth: '520px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4px)',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '0.85rem'
            }}
          >
            <Flame size={15} color="#FBBF24" />
            <span>FLASH DEAL OF THE DAY</span>
          </div>

          <h2 style={{ color: '#FFFFFF', fontSize: '1.85rem', marginBottom: '0.65rem' }}>
            Multi-Vendor Weekend Clearance: Up to 60% OFF
          </h2>
          <p style={{ color: '#FFE4E6', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
            Curated electronics, designer kurtis, ergonomic cookware, and active footwear with verified vendor guarantees.
          </p>
        </div>

        {/* Countdown Timer Display */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#FFE4E6', fontWeight: 600 }}>
            <Clock size={16} /> Deals Expire In:
          </div>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.85rem',
                minWidth: '55px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.45rem', fontWeight: 800 }}>{pad(timeLeft.hours)}</div>
              <div style={{ fontSize: '0.65rem', color: '#FBCFE8', textTransform: 'uppercase' }}>Hours</div>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, alignSelf: 'center' }}>:</span>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.85rem',
                minWidth: '55px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.45rem', fontWeight: 800 }}>{pad(timeLeft.minutes)}</div>
              <div style={{ fontSize: '0.65rem', color: '#FBCFE8', textTransform: 'uppercase' }}>Mins</div>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, alignSelf: 'center' }}>:</span>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.85rem',
                minWidth: '55px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.45rem', fontWeight: 800 }}>{pad(timeLeft.seconds)}</div>
              <div style={{ fontSize: '0.65rem', color: '#FBCFE8', textTransform: 'uppercase' }}>Secs</div>
            </div>
          </div>
          <Link
            to="/products?discount=true"
            className="btn btn-sm"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#BE185D',
              fontWeight: 700,
              marginTop: '4px'
            }}
          >
            Claim Deals Now <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffersBanner;
