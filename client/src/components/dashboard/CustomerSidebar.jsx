import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Heart, MapPin, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CustomerSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="dashboard-sidebar">
      {/* User Info Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          paddingBottom: '1.25rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
        </div>
        <div style={{ minWidth: 0 }}>
          <h4
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {user?.name || 'Customer'}
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {user?.email || ''}
          </span>
        </div>
      </div>

      <nav>
        <ul className="sidebar-nav">
          <li>
            <NavLink
              to="/customer/dashboard"
              end
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer/orders"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <ShoppingBag size={18} />
              <span>Order History</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer/wishlist"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Heart size={18} />
              <span>My Wishlist</span>
              {user?.wishlist?.length > 0 && (
                <span className="sidebar-badge badge-primary">
                  {user.wishlist.length}
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer/profile"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <User size={18} />
              <span>Profile & Addresses</span>
            </NavLink>
          </li>
          <li style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button
              onClick={handleLogout}
              className="sidebar-link"
              style={{ width: '100%', color: 'var(--danger)' }}
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default CustomerSidebar;
