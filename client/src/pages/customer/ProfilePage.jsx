import React, { useState } from 'react';
import { User, Mail, Phone, Lock, MapPin, Plus, CheckCircle, Save } from 'lucide-react';
import CustomerSidebar from '../../components/dashboard/CustomerSidebar';
import AlertBanner from '../../components/common/AlertBanner';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Address form
  const [addresses, setAddresses] = useState(
    user?.addresses?.length > 0
      ? user.addresses
      : [
          {
            street: '42 MG Road, 3rd Floor, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560038',
            isDefault: true
          }
        ]
  );
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [showAddAddress, setShowAddAddress] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        name,
        phone,
        addresses
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await authService.updateProfile(payload);
      if (res.success) {
        setMessage('Profile and address preferences updated successfully!');
        updateUser(res.user);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
      setError('Please fill in all address fields.');
      return;
    }

    const updated = [...addresses, { ...newAddress, isDefault: false }];
    setAddresses(updated);
    setNewAddress({ street: '', city: '', state: '', postalCode: '' });
    setShowAddAddress(false);
  };

  const removeAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  return (
    <div className="container page-wrapper">
      <div className="dashboard-layout">
        <CustomerSidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Account Profile & Addresses</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Manage your personal information, security credentials, and delivery destinations
            </p>
          </div>

          {message && <AlertBanner type="success" message={message} onClose={() => setMessage('')} />}
          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleProfileUpdate}>
            {/* Personal Info Card */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} color="var(--primary)" /> Personal Information
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (Read-Only)</label>
                  <input
                    type="email"
                    disabled
                    className="form-control"
                    style={{ backgroundColor: 'var(--bg-subtle)' }}
                    value={user?.email || ''}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Address Management Card */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={20} color="var(--primary)" /> Saved Delivery Addresses
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="btn btn-outline btn-sm"
                >
                  <Plus size={15} /> Add New Address
                </button>
              </div>

              {/* Existing Addresses List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1.5px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">Address #{idx + 1}</span>
                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAddress(idx)}
                          style={{ fontSize: '0.75rem', color: 'var(--danger)', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                      <div>{addr.street}</div>
                      <div>{addr.city}, {addr.state} - <strong>{addr.postalCode}</strong></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Address Accordion */}
              {showAddAddress && (
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.85rem' }}>Add Delivery Destination</h4>
                  <div className="form-group">
                    <label className="form-label">Street / House Address</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 15 Palm Avenue"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="button" onClick={handleAddAddress} className="btn btn-primary btn-sm">
                      Save Address
                    </button>
                    <button type="button" onClick={() => setShowAddAddress(false)} className="btn btn-outline btn-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password Card */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} color="var(--primary)" /> Change Security Password
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Leave empty if you do not wish to update your login password
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
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
                    placeholder="Repeat new password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="btn btn-lg btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
