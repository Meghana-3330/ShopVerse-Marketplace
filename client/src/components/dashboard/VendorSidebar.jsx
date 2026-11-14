import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PackagePlus,
  Boxes,
  ShoppingBag,
  Store,
  ExternalLink,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const VendorSidebar = () => {
  const { user, logout, isVendorApproved } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const storeStatus = user?.vendorProfile?.status || 'pending';

  return (
    <aside className="dashboard-sidebar">
      {/* Store Header */}
      <div
        style={{
          paddingBottom: '1.25rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
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
              fontWeight: 800
            }}
          >
            <Store size={22} />
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
              {user?.vendorProfile?.storeName || 'Vendor Store'}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {user?.name}
            </span>
          </div>
        </div>

        {/* Status pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            className={`badge ${
              storeStatus === 'approved'
                ? 'badge-success'
                : storeStatus === 'pending'
                ? 'badge-warning'
                : 'badge-danger'
            }`}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Store Status: {storeStatus.toUpperCase()}
          </span>
        </div>

        {!isVendorApproved && (
          <div
            style={{
              marginTop: '0.65rem',
              padding: '0.5rem',
              backgroundColor: 'var(--warning-light)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: 'var(--warning-dark)',
              display: 'flex',
              gap: '4px'
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Store pending admin approval. Inventory management is locked until verified.</span>
          </div>
        )}
      </div>

      <nav>
        <ul className="sidebar-nav">
          <li>
            <NavLink
              to="/vendor/dashboard"
              end
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard Overview</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/vendor/add-product"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <PackagePlus size={18} />
              <span>Add New Product</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/vendor/products"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Boxes size={18} />
              <span>Manage Inventory</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/vendor/orders"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <ShoppingBag size={18} />
              <span>Vendor Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/vendor/profile"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Store size={18} />
              <span>Store Profile</span>
            </NavLink>
          </li>

          <li style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <NavLink to="/" className="sidebar-link">
              <ExternalLink size={18} />
              <span>Customer View</span>
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="sidebar-link"
              style={{ width: '100%', color: 'var(--danger)' }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default VendorSidebar;
