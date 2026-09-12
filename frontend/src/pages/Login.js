import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { API_URL } from '../data/service';
import '../styles/authForm.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

 const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

const payload = {
  email: formData.email,
  password: formData.password,
  role: storedUser.role || 'rto', // Extracts just the role string (e.g., "rto")
};

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), // Passed as JSON
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');

    // Store token and user data so components like Sidebar can read it
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user)); 
    
    navigate('/dashboard');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout>
      <div className="auth-logo">LMS</div>

      <h1 className="auth-welcome-title">WELCOME BACK!</h1>
      <p className="auth-welcome-subtitle">Please login to view your dashboard</p>

      {error && <div className="auth-alert">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form-flat">
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="auth-input-flat"
        />

        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="auth-input-flat"
        />

        <div className="auth-row-between">
          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
            />
            Keep me logged in
          </label>
          <Link to="/forgot-password" className="auth-forgot-link">
            Forgot password? <span>Reset now</span>
          </Link>
        </div>

        <button type="submit" disabled={loading} className="auth-submit-btn-flat">
          {loading ? 'LOGGING IN...' : 'LOGIN'}
        </button>
      </form>

      <p className="auth-terms-note">
        By signing in you accept all our terms and conditions, privacy policy and cookie
        policy. We however do not use any third party vendor to share your data and its
        safe with us.
      </p>

      {/* <div className="auth-footer-note">
        Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
      </div> */}
    </AuthLayout>
  );
}