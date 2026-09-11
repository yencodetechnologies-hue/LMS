import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/service';
import DashboardLayout from '../components/DashboardLayout';
import { Search, Eye, X } from 'lucide-react';
import '../styles/dashboard.css';
import '../styles/RtoUserList.css';

export default function RtoUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders/users`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
        setUsers(data.users || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Only show users whose role is 'rto'
  const rtoOnlyUsers = users.filter(
    (item) => (item.role || '').toLowerCase() === 'rto'
  );

  const filteredUsers = rtoOnlyUsers.filter((item) => {
    const query = searchTerm.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.email && item.email.toLowerCase().includes(query)) ||
      (item.rtoNumber && item.rtoNumber.toLowerCase().includes(query)) ||
      (item.instituteName && item.instituteName.toLowerCase().includes(query))
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <DashboardLayout><div className="dashboard-loading">Loading RTO Users...</div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="dashboard-error">Error: {error}</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="dashboard-content-wrapper rto-users-wrapper">
        <div className="rto-header-flex">
          <div className="rto-title-area">
            <h1>RTO User Management</h1>
            <p>View and manage registered user and order profiles.</p>
          </div>
          
          <div className="rto-search-box">
            <Search size={18} />
            <input 
              type="text" 
              className="rto-search-input"
              placeholder="Search by name, email, RTO..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        <div className="rto-table-card">
          <table className="rto-data-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Institute Name</th>
                <th>RTO Number</th>
                <th>Role</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">No users found.</td>
                </tr>
              ) : (
                paginatedUsers.map((u, idx) => (
                  <tr key={u._id || idx}>
                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="fw-medium">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.instituteName || 'N/A'}</td>
                    <td>{u.rtoNumber || 'N/A'}</td>
                    <td>
                      <span className="rto-role-badge">
                        {u.role || 'Student'}
                      </span>
                    </td>
                    <td className="text-center">
                      <button 
                        onClick={() => setSelectedUser(u)}
                        className="rto-view-btn"
                      >
                        <Eye size={16} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="rto-pagination-bar">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="rto-page-btns">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                  disabled={currentPage === 1}
                  className="rto-page-btn"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                  className="rto-page-btn"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="rto-modal-overlay">
            <div className="rto-modal-box">
              <button 
                onClick={() => setSelectedUser(null)}
                className="rto-modal-close"
              >
                <X size={20} />
              </button>

              <h2 className="rto-modal-title">User Profile Details</h2>
              
              <div className="rto-modal-body">
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Institute Name:</strong> {selectedUser.instituteName || 'N/A'}</p>
                <p><strong>RTO Number:</strong> {selectedUser.rtoNumber || 'N/A'}</p>
                <p><strong>Role:</strong> {selectedUser.role || 'Student'}</p>
                <p><strong>Payment Status:</strong> {selectedUser.payStatus === 1 ? 'Paid / Active' : 'Pending'}</p>
                <p><strong>Registered Date:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}</p>
                <div>
                  <strong>Associated Courses:</strong> 
                  <ul className="rto-modal-courses-list">
                    {selectedUser.courses && selectedUser.courses.length > 0 ? (
                      selectedUser.courses.map((c, i) => (
                        <li key={i}>
                          {typeof c === 'object' && c !== null ? (
                            <>
                              <strong>{c.title || 'Untitled Course'}</strong> <br />
                              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                Category: {c.category || 'N/A'} | Duration: {c.duration || 'N/A'} | Fee: ${c.fee ?? '0'}
                              </span>
                            </>
                          ) : (
                            <span>Course ID: {c}</span>
                          )}
                        </li>
                      ))
                    ) : (
                      <li>No courses assigned</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="rto-modal-footer">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="rto-modal-close-btn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}