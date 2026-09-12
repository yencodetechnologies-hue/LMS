import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Car,FileText,
  LogOut, ChevronDown, ChevronRight, X, ShoppingBag, Users,
} from 'lucide-react';
import '../styles/dashboard.css';

const rtoSubItems = [
  { label: 'RTO', path: '/dashboard/rto' },
  // { label: 'Teacher', path: '/dashboard/rto/teacher' },
];

export default function Sidebar({ isOpen, onClose, collapsed }) {
  const navigate = useNavigate();
  const [rtoOpen, setRtoOpen] = useState(false);

  // Retrieve the stored user object from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userDetails') || '{}');
  const userRole = (storedUser.role || '').toLowerCase();

  // Dynamically derive rtoNumber and courseId from stored user data or fallback to defaults
  const rtoNumber = storedUser.rtoNumber || 'RTO-40291';
  const courseId = (storedUser.courses && storedUser.courses[0]) || '6aa396feaa9a5eeb9dba9ea4';
  const assessmentPath = `/assessment/knowledge/${rtoNumber}/${courseId}`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('cartItems');
    navigate('/login');
  };

  const linkClass = ({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`;
  const subLinkClass = ({ isActive }) => `sidebar-sublink ${isActive ? 'active' : ''}`;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''} ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logo-mark">LM</span>
          <span className="sidebar-logo-text">LMSystem</span>
          <button type="button" className="sidebar-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className={linkClass} onClick={onClose} title="Dashboard">
            <LayoutDashboard size={18} />
            <span className="sidebar-label">Dashboard</span>
          </NavLink>

          {/* Conditional Navigation based on Role */}
          {userRole === 'admin' ? (
            // --- ADMIN MENU ---
            <>
              <NavLink to="/dashboard/courses" className={linkClass} onClick={onClose} title="Courses">
                <BookOpen size={18} />
                <span className="sidebar-label">Courses</span>
              </NavLink>

              <button
                type="button"
                className={`sidebar-link sidebar-link-toggle ${rtoOpen ? 'open' : ''}`}
                onClick={() => setRtoOpen(!rtoOpen)}
                title="RTO"
              >
                <Car size={18} />
                <span className="sidebar-label">RTO</span>
                {!collapsed && (rtoOpen ? <ChevronDown size={16} className="chev" /> : <ChevronRight size={16} className="chev" />)}
              </button>

              {rtoOpen && !collapsed && (
                <div className="sidebar-submenu">
                  {rtoSubItems.map((item) => (
                    <NavLink key={item.path} to={item.path} className={subLinkClass} onClick={onClose}>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}

              {/* <NavLink to="/dashboard/questions" className={linkClass} onClick={onClose} title="Questions">
                <HelpCircle size={18} />
                <span className="sidebar-label">Questions</span>
              </NavLink>

              <NavLink to="/dashboard/reports" className={linkClass} onClick={onClose} title="Reports">
                <FileText size={18} />
                <span className="sidebar-label">Reports</span>
              </NavLink>

              <NavLink to="/dashboard/settings" className={linkClass} onClick={onClose} title="Settings">
                <Settings size={18} />
                <span className="sidebar-label">Settings</span>
              </NavLink> */}
            </>
          ) : userRole === 'student' ? (
            // --- STUDENT MENU ---
            <>
              <NavLink to={assessmentPath} className={linkClass} onClick={onClose} title="Assessment">
                <BookOpen size={18} />
                <span className="sidebar-label">Assessment</span>
              </NavLink>

              {/* <NavLink to="/dashboard/submissions" className={linkClass} onClick={onClose} title="My Submissions">
                <CheckSquare size={18} />
                <span className="sidebar-label">My Submissions</span>
              </NavLink>

              <NavLink to="/dashboard/settings" className={linkClass} onClick={onClose} title="Settings">
                <Settings size={18} />
                <span className="sidebar-label">Settings</span>
              </NavLink> */}
            </>
          ) : userRole === 'teacher' ? (
            // --- TEACHER MENU (Including Student management view) ---
            <>
              {/* <NavLink to="/dashboard/rto/student" className={linkClass} onClick={onClose} title="Student">
                <Users size={18} />
                <span className="sidebar-label">Student</span>
              </NavLink> */}
                <NavLink to="/dashboard/student-list" className={linkClass} onClick={onClose} title="My Student">
                <Users size={18} />
                <span className="sidebar-label">Student List</span>
              </NavLink>

              {/* <NavLink to="/dashboard/teacher-list" className={linkClass} onClick={onClose} title="Teachers">
  <Users size={18} />
  <span className="sidebar-label">Teachers</span>
</NavLink> */}

               <NavLink to={assessmentPath} className={linkClass} onClick={onClose} title="Assessment">
                <BookOpen size={18} />
                <span className="sidebar-label">Assessment</span>
              </NavLink>


              {/* <NavLink to="/dashboard/settings" className={linkClass} onClick={onClose} title="Settings">
                <Settings size={18} />
                <span className="sidebar-label">Settings</span>
              </NavLink> */}
            </>
          ) : (
            // --- RTO MENU (Buyed Course Details & Specific Views) ---
            <>
              <NavLink to="/dashboard/my-courses" className={linkClass} onClick={onClose} title="Purchased Courses">
                <ShoppingBag size={18} />
                <span className="sidebar-label">Purchased Courses</span>
              </NavLink>

              <NavLink to="/dashboard/rto-profile" className={linkClass} onClick={onClose} title="RTO Profile">
                <FileText size={18} />
                <span className="sidebar-label">RTO Profile</span>
              </NavLink>

              <NavLink to="/dashboard/rto/student" className={linkClass} onClick={onClose} title="Student">
                <Users size={18} />
                <span className="sidebar-label">Student</span>
              </NavLink>

              <NavLink to="/dashboard/rto/teacher" className={linkClass} onClick={onClose} title="Teacher">
                <Users size={18} />
                <span className="sidebar-label">Teacher</span>
              </NavLink>

              {/* <NavLink to="/dashboard/settings" className={linkClass} onClick={onClose} title="Settings">
                <Settings size={18} />
                <span className="sidebar-label">Settings</span>
              </NavLink> */}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{(storedUser.name || 'A')[0]}</div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{storedUser.name || 'User'}</p>
              <p className="sidebar-user-role">{storedUser.role || 'user'}</p>
            </div>
          </div>
          <button type="button" className="sidebar-logout" onClick={handleLogout} title="Log out">
            <LogOut size={16} />
            <span className="sidebar-label">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}