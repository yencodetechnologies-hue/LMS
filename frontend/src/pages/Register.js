import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { API_URL } from '../data/service';
import '../styles/authForm.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

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
    <AuthLayout title="Create Account" subtitle="Sign up to get started.">
      {error && (
        <div className="auth-alert">
          <AlertCircle size={16} color="#fb7185" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label className="auth-label">Full Name</label>
          <div className="auth-input-wrapper">
            <User size={18} className="auth-icon" />
            <input
              type="text"
              name="name"
              required
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label">Email</label>
          <div className="auth-input-wrapper">
            <Mail size={18} className="auth-icon" />
            <input
              type="email"
              name="email"
              required
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label">Password</label>
          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-icon" />
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="auth-submit-btn">
          {loading ? (
            <span className="auth-btn-content"><Loader2 size={16} className="spin-icon" /> Creating Account...</span>
          ) : (
            <span className="auth-btn-content">Create Account <ArrowRight size={16} /></span>
          )}
        </button>
      </form>

      <div className="auth-footer-note">
        Already have an account? <Link to="/login" className="auth-link">Log In</Link>
      </div>
    </AuthLayout>
  );
}