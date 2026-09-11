import React from 'react';
import { ShoppingCart, Search, BookOpen, LogIn } from 'lucide-react';

export default function Header({ cartCount, onCartClick, onLoginClick }) {
  return (
    <header className="edumarket-header">
      <div className="header-brand">
        <div className="header-logo-icon">
          <BookOpen size={20} />
        </div>
        <h2 className="header-title">
          LM<span>System</span>
        </h2>
      </div>

      <div className="header-search-bar">
        <Search size={18} color="#64748b" />
        <input 
          type="text" 
          placeholder="Search for professional courses, skills..." 
          className="header-search-input"
        />
      </div>

      <div className="header-actions">
        <button onClick={onCartClick} className="cart-trigger-btn">
          <ShoppingCart size={22} color="#6d1327" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="cart-badge-counter">
              {cartCount}
            </span>
          )}
        </button>

        <button onClick={onLoginClick} className="header-login-btn">
          <LogIn size={16} />
          <span>Login</span>
        </button>
      </div>
    </header>
  );
}