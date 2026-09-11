import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '../data/service';
import '../styles/CheckoutPage.css';

// Generates a random RTO number like "RTO-48213"
const generateRtoNumber = () => {
  const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5-digit number, 10000–99999
  return `RTO-${randomDigits}`;
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rtoNumber: generateRtoNumber(),
    instituteName: '',
    role: 'rto',
    payStatus: 1, // Default payment status set to 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    // Load cart items from localStorage on mount
    const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCart);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegenerateRto = () => {
    setIsRegenerating(true);
    setFormData(prev => ({ ...prev, rtoNumber: generateRtoNumber() }));
    // Brief spin animation for visual feedback, then reset
    setTimeout(() => setIsRegenerating(false), 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Extract course IDs from cart items
    const courseIds = cartItems.map(item => item._id || item.id);

    const payload = {
      ...formData,
      courses: courseIds,
      payStatus: 1, // Ensured default payment status
    };

    try {
      // 1. Save structured details in localStorage as JSON
      localStorage.setItem('user', JSON.stringify(payload));

      // 2. Submit JSON payload to backend database API
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Order placed and details saved successfully!');
        localStorage.removeItem('cartItems'); // Clear cart after success
        navigate('/dashboard'); 
      } else {
        setError(data.message || 'Failed to submit order details.');
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-layout">
      <Header />
      <main className="checkout-main-container">
        <div className="checkout-card">
          <h2 className="checkout-title">Complete Your Checkout Details</h2>
          
          {error && <div className="checkout-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-field-group">
              <label className="checkout-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="checkout-input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="checkout-field-group">
              <label className="checkout-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="checkout-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="checkout-field-group">
              <label className="checkout-label">Institute Name</label>
              <input
                type="text"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleChange}
                required
                className="checkout-input"
                placeholder="Enter your institute name"
              />
            </div>

            <div className="checkout-field-group">
              <label className="checkout-label">RTO Number</label>
              <div className="checkout-rto-row">
                <input
                  type="text"
                  name="rtoNumber"
                  value={formData.rtoNumber}
                  readOnly
                  className="checkout-input checkout-input-readonly"
                />
                <button
                  type="button"
                  onClick={handleRegenerateRto}
                  className="checkout-regenerate-btn"
                  title="Generate a new RTO number"
                  aria-label="Generate a new RTO number"
                >
                  <RefreshCw size={16} className={isRegenerating ? 'checkout-regen-icon-spin' : ''} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="checkout-submit-btn"
            >
              {loading ? 'Processing...' : 'Submit & Complete Order'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}