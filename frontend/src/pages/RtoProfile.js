import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/service';
import '../styles/rtoProfile.css';
import DashboardLayout from '../components/DashboardLayout';

export default function RtoProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    rtoNumber: '',
    instituteName: '',
    logo: ''
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  useEffect(() => {
    const fetchProfileById = async () => {
      try {
        // Retrieve the stored user object from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = storedUser.id || storedUser._id;

        if (!userId) {
          throw new Error('No user session ID found in localStorage');
        }

        const response = await fetch(`${API_URL}/api/orders/profile/${userId}`, {
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch profile details');
        
        setProfile({
          name: data.profile.name || '',
          email: data.profile.email || '',
          rtoNumber: data.profile.rtoNumber || '',
          instituteName: data.profile.instituteName || '',
          logo: data.profile.logo || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileById();
  }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    setUploading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch(`${API_URL}/api/orders/update-logo`, {
        method: 'PUT',
        headers: authHeaders(),
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update logo');

      setProfile((prev) => ({ ...prev, logo: data.logo }));
      setSuccessMsg('Logo uploaded and updated successfully in the orders database!');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading profile...</div>;

  return (
    <DashboardLayout>
      <div className="rto-profile-container">
        <div className="rto-profile-header">
          <h1 className="rto-profile-title">RTO Profile</h1>
        </div>

        {error && <div className="rto-error-alert">{error}</div>}
        {successMsg && <div className="rto-success-alert">{successMsg}</div>}

        <div className="rto-profile-card">
          
          {/* Logo Section */}
          <div className="rto-logo-section">
            <div className="rto-logo-wrapper">
              {profile.logo ? (
                <img src={profile.logo} alt="RTO Logo" className="rto-logo-image" />
              ) : (
                <span className="rto-logo-placeholder">No Logo</span>
              )}
            </div>
            <label className="rto-upload-btn-label">
              {uploading ? 'Uploading...' : 'Upload Logo'}
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Non-Editable Fields */}
          <div className="rto-form-group">
            <label className="rto-form-label">Name</label>
            <input type="text" value={profile.name} readOnly className="rto-form-input" />
          </div>

          <div className="rto-form-group">
            <label className="rto-form-label">Email Address </label>
            <input type="text" value={profile.email} readOnly className="rto-form-input" />
          </div>

          <div className="rto-form-group">
            <label className="rto-form-label">RTO Number </label>
            <input type="text" value={profile.rtoNumber} readOnly className="rto-form-input" />
          </div>

          <div className="rto-form-group">
            <label className="rto-form-label">Institute Name</label>
            <input type="text" value={profile.instituteName} readOnly className="rto-form-input" />
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}