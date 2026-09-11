import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/service';
import DashboardLayout from '../components/DashboardLayout';
import { Search, Eye, Edit, Trash2, Plus, X } from 'lucide-react';
import '../styles/dashboard.css';
import '../styles/RtoTeacherManagement.css';

export default function RtoTeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [modalMode, setModalMode] = useState(null); // 'add', 'edit', 'view'
  const [currentTeacher, setCurrentTeacher] = useState({ name: '', email: '', phone: '', rtoNumber: '' });
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teachersRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/api/rto/teachers`),
        fetch(`${API_URL}/api/orders/users`) // Fetches data from the Order table
      ]);

      const teachersData = await teachersRes.json();
      const ordersData = await ordersRes.json();

      if (!teachersRes.ok) throw new Error(teachersData.message || 'Failed to fetch teachers');
      if (!ordersRes.ok) throw new Error(ordersData.message || 'Failed to fetch orders data');

      setTeachers(teachersData.teachers || teachersData);
      setOrders(ordersData.users || ordersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = modalMode === 'edit' 
        ? `${API_URL}/api/rto/teachers/${selectedId}` 
        : `${API_URL}/api/rto/teachers`;
      const method = modalMode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTeacher)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Operation failed');

      setModalMode(null);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      const response = await fetch(`${API_URL}/api/rto/teachers/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Delete failed');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredTeachers = teachers.filter((item) => {
    const query = searchTerm.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.email && item.email.toLowerCase().includes(query)) ||
      (item.rtoNumber && item.rtoNumber.toLowerCase().includes(query))
    );
  });

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage) || 1;
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <DashboardLayout><div className="dashboard-loading">Loading Teachers...</div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="dashboard-error">Error: {error}</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="dashboard-content-wrapper teacher-management-wrapper">
        <div className="teacher-header-flex">
          <div className="teacher-title-area">
            <h1>Teacher Management</h1>
            <p>Manage RTO teachers, assign RTO numbers, and update credentials.</p>
          </div>
          
          <div className="teacher-actions-bar">
            <div className="teacher-search-box">
              <Search size={18} />
              <input 
                type="text" 
                className="teacher-search-input"
                placeholder="Search teacher..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <button 
              className="teacher-add-btn"
              onClick={() => { 
                setCurrentTeacher({ 
                  name: '', 
                  email: '', 
                  phone: '', 
                  rtoNumber: orders.length > 0 ? orders[0].rtoNumber : '' 
                }); 
                setModalMode('add'); 
              }}
            >
              <Plus size={18} /> Add Teacher
            </button>
          </div>
        </div>

        <div className="teacher-table-card">
          <table className="teacher-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>RTO Number</th>
                <th className="text-center" style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTeachers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted" style={{ textAlign: 'center', padding: '2rem' }}>No teachers found.</td>
                </tr>
              ) : (
                paginatedTeachers.map((t, idx) => (
                  <tr key={t._id || idx}>
                    <td className="fw-medium">{t.name}</td>
                    <td>{t.email}</td>
                    <td>{t.phone || 'N/A'}</td>
                    <td>{t.rtoNumber || 'N/A'}</td>
                    <td className="text-center">
                      <div className="action-icon-btns">
                        <button title="View" className="icon-action-btn view" onClick={() => { setCurrentTeacher(t); setModalMode('view'); }}>
                          <Eye size={18} />
                        </button>
                        <button title="Edit" className="icon-action-btn edit" onClick={() => { setCurrentTeacher(t); setSelectedId(t._id); setModalMode('edit'); }}>
                          <Edit size={18} />
                        </button>
                        <button title="Delete" className="icon-action-btn delete" onClick={() => handleDelete(t._id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="rto-pagination-bar" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <span>Page {currentPage} of {totalPages}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="rto-page-btn">Previous</button>
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="rto-page-btn">Next</button>
              </div>
            </div>
          )}
        </div>

        {/* Modal for Add / Edit / View */}
        {modalMode && (
          <div className="teacher-modal-overlay">
            <div className="teacher-modal-box">
              <button onClick={() => setModalMode(null)} className="teacher-modal-close"><X size={20} /></button>
              <h2 className="teacher-modal-title">
                {modalMode === 'add' ? 'Add New Teacher' : modalMode === 'edit' ? 'Edit Teacher Details' : 'Teacher Profile'}
              </h2>

              {modalMode === 'view' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <p><strong>Name:</strong> {currentTeacher.name}</p>
                  <p><strong>Email:</strong> {currentTeacher.email}</p>
                  <p><strong>Phone:</strong> {currentTeacher.phone || 'N/A'}</p>
                  <p><strong>RTO Number:</strong> {currentTeacher.rtoNumber || 'N/A'}</p>
                  <div className="teacher-modal-footer">
                    <button onClick={() => setModalMode(null)} className="teacher-btn-submit">Close</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave}>
                  <div className="teacher-form-group">
                    <label>Full Name *</label>
                    <input type="text" required value={currentTeacher.name} onChange={(e) => setCurrentTeacher({...currentTeacher, name: e.target.value})} />
                  </div>
                  <div className="teacher-form-group">
                    <label>Email Address *</label>
                    <input type="email" required value={currentTeacher.email} onChange={(e) => setCurrentTeacher({...currentTeacher, email: e.target.value})} />
                  </div>
                  <div className="teacher-form-group">
                    <label>Phone Number</label>
                    <input type="text" value={currentTeacher.phone} onChange={(e) => setCurrentTeacher({...currentTeacher, phone: e.target.value})} />
                  </div>
                  <div className="teacher-form-group">
                    <label>RTO Number *</label>
                    <select 
                      required
                      value={currentTeacher.rtoNumber} 
                      onChange={(e) => setCurrentTeacher({...currentTeacher, rtoNumber: e.target.value})}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.9rem', outline: 'none', background: '#fff' }}
                    >
                      <option value="">Select RTO Number</option>
                      {orders.map((ord, i) => (
                        <option key={ord._id || i} value={ord.rtoNumber}>
                          {ord.rtoNumber} {ord.instituteName ? `(${ord.instituteName})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="teacher-modal-footer">
                    <button type="button" onClick={() => setModalMode(null)} className="teacher-btn-cancel">Cancel</button>
                    <button type="submit" className="teacher-btn-submit">Save Teacher</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}