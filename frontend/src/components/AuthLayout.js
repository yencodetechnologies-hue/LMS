import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/authForm.css';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page-bg">
      

      <div className="auth-card">
        
        <div className="auth-side-panel">
          {/* <nav className="auth-side-nav">
            <span className="auth-menu-icon">☰</span>
            <a href="/">HOME</a>
            <a href="/about">ABOUT</a>
            <a href="/services">SERVICES</a>
            <a href="/blog">BLOG</a>
            <a href="/contact">CONTACT</a>
          </nav> */}
          <Link to="/" className="auth-back-home-btn">
        &larr; Back to Home
      </Link>
          <button className="auth-book-btn">BOOK NOW</button>
          <div className="auth-side-text">
            <p className="auth-side-subtitle">DASHBOARD</p>
            <h4 className="auth-side-title">LOGIN</h4>
          </div>
        </div>

        <div className="auth-content-panel">{children}</div>
      </div>

     
    </div>
  );
}