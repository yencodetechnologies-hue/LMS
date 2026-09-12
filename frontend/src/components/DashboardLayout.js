import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import '../styles/dashboard.css';

export default function DashboardLayout({ title, subtitle, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer toggle
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop collapse toggle
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const handleHamburgerClick = () => {
    if (window.innerWidth <= 900) {
      setSidebarOpen(true); // Open mobile drawer
    } else {
      setSidebarCollapsed(!sidebarCollapsed); // Collapse/Expand on desktop
    }
  };

  return (
    <div className={`dash-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        collapsed={sidebarCollapsed} 
      />
      <div className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <button
              type="button"
              className="dash-hamburger"
              onClick={handleHamburgerClick}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="dash-title">{title}</h1>
              {subtitle && <p className="dash-subtitle">{subtitle}</p>}
            </div>
          </div>
          <div className="dash-topbar-actions">
            <div className="dash-search">
              <Search size={16} />
              <input type="text" placeholder="Search..." />
            </div>
            <button type="button" className="dash-bell">
              <Bell size={18} />
              <span className="dash-bell-dot" />
            </button>
            <div
              className="dash-avatar-sm"
              onClick={() => navigate('/dashboard/rto-profile')}
              style={{ cursor: 'pointer' }}
              title="View profile"
            >
              {(storedUser.name || 'A')[0]}
            </div>
          </div>
        </header>
        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}