import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="dashboard-sidebar">
      {/* Admin Header */}
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
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-purple-light)',
            color: '#5B21B6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800
          }}
        >
          <ShieldCheck size={24} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h4
            style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#5B21B6',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            Administration
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Super Admin Access
          </span>
        </div>
      </div>

      <nav>
        <ul className="sidebar-nav">
          <li>
            <NavLink
              to="/admin/dashboard"
              end
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Overview & Analytics</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>User Management</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/vendors"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Store size={18} />
              <span>Vendor Approvals</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Package size={18} />
              <span>Product Catalog</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <ShoppingBag size={18} />
              <span>Marketplace Orders</span>
            </NavLink>
          </li>

          <li style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <NavLink to="/" className="sidebar-link">
              <ExternalLink size={18} />
              <span>Marketplace Storefront</span>
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

export default AdminSidebar;
