import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Star, Check, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { API_URL } from '../data/service';
import '../styles/HomePage.css';

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  // Fetch courses dynamically with safe array-checking to prevent .map crashes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/courses`, { headers: authHeaders() });
        const data = await response.json();
        
        if (response.ok) {
          if (Array.isArray(data)) {
            setCourses(data);
          } else if (data && Array.isArray(data.courses)) {
            setCourses(data.courses);
          } else if (data && Array.isArray(data.data)) {
            setCourses(data.data);
          } else {
            setCourses([]);
            console.error('API response format is not an array:', data);
          }
        } else {
          console.error('Failed to fetch courses:', data.message);
          setCourses([]);
        }
      } catch (error) {
        console.error('Error connecting to course API:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAddToCart = (course) => {
    const courseId = course._id || course.id;
    if (!cart.some(item => (item._id || item.id) === courseId)) {
      setCart([...cart, course]);
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => (item._id || item.id) !== id));
  };

  const totalPrice = cart.reduce((acc, item) => acc + (item.fee || item.price || 0), 0);

  return (
    <div className="homepage-layout">
      <Header 
        cartCount={cart.length} 
        onCartClick={() => setIsCartOpen(true)} 
        onLoginClick={() => navigate('/login')} 
      />

      <div className="homepage-hero-wrapper">
        <div className="homepage-hero-banner">
          <div>
            <span className="hero-tag">Mega Learning Season</span>
            <h1>Upgrade Your Skills with Industry Experts</h1>
            <p>Unlock top-rated professional courses with lifetime access, hands-on projects, and recognized certificates.</p>
          </div>
        </div>
      </div>

      <main className="homepage-main-container">
        <div className="catalog-header-row">
          <h2>Top Featured Courses</h2>
          <span className="catalog-view-all">View All <ArrowRight size={14} /></span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
            <Loader2 size={32} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Loading dynamic courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
            <p>No active courses available right now.</p>
          </div>
        ) : (
          <div className="catalog-grid">
            {courses.map((course) => {
              const courseId = course._id || course.id;
              const isAlreadyInCart = cart.some(item => (item._id || item.id) === courseId);
              const courseFee = course.fee || 499.00;
              const originalPrice = courseFee * 3;

              return (
                <div key={courseId} className="course-card-item">
                  <span className="course-badge-tag">{course.status || 'Active'}</span>
                  <div className="course-thumb-box">
                    <img 
                      src={course.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'} 
                      alt={course.title} 
                    />
                  </div>
                  <div className="course-content-box">
                    <span className="course-category-label">{course.category}</span>
                    <h3 className="course-title-text">{course.title}</h3>

                    <div className="course-rating-row">
                      <span className="rating-pill">
                        4.8 <Star size={10} fill="#fff" />
                      </span>
                      <span className="course-reviews-count">({course.duration || 'Self-paced'})</span>
                    </div>

                    <div className="course-footer-row">
                      <div>
                        <span className="course-price-current">${courseFee.toFixed(2)}</span>
                        <span className="course-price-original">${originalPrice.toFixed(2)}</span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(course)}
                        className="add-to-cart-action-btn"
                        style={{ background: isAlreadyInCart ? '#388e3c' : '#6d1327' }}
                      >
                        {isAlreadyInCart ? <><Check size={14} /> Added</> : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {isCartOpen && (
        <div className="cart-drawer-backdrop">
          <div className="cart-drawer-panel">
            <div className="cart-drawer-header">
              <h3>My Cart ({cart.length})</h3>
              <button onClick={() => setIsCartOpen(false)} className="cart-drawer-close-btn">✕</button>
            </div>

            <div className="cart-drawer-body">
              {cart.length === 0 ? (
                <div className="cart-empty-state">
                  <ShoppingBag size={50} style={{ opacity: 0.3, marginBottom: '0.8rem' }} />
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Your cart is empty!</p>
                  <p style={{ fontSize: '0.8rem' }}>Explore courses and add items to your cart.</p>
                </div>
              ) : (
                cart.map((item) => {
                  const itemId = item._id || item.id;
                  const itemFee = item.fee || item.price || 0;
                  return (
                    <div key={itemId} className="cart-item-row">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'} 
                        alt={item.title} 
                        className="cart-item-thumb" 
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 className="cart-item-title">{item.title}</h4>
                        <span className="cart-item-price">${itemFee.toFixed(2)}</span>
                      </div>
                      <button onClick={() => handleRemoveFromCart(itemId)} className="cart-item-remove-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-total-row">
                  <span>Total Amount:</span>
                  <span className="cart-total-amount">${totalPrice.toFixed(2)}</span>
                </div>
<button 
  onClick={() => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
    setIsCartOpen(false);
    navigate('/checkout');
  }} 
  className="checkout-action-btn"
>
  Place Order & Checkout
</button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}