import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/service';
import DashboardLayout from '../components/DashboardLayout';
import { Search, Eye, Edit, Trash2, Plus, X } from 'lucide-react';
import '../styles/dashboard.css';
import '../styles/RtoTeacherManagement.css';

export default function RtoTeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [modalMode, setModalMode] = useState(null); // 'add', 'edit', 'view'
  const [currentTeacher, setCurrentTeacher] = useState({ name: '', email: '', phone: '' });
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Retrieve rtoNumber from localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const rtoNumber = storedUser?.rtoNumber || localStorage.getItem('rtoNumber');

      const teachersRes = await fetch(`${API_URL}/api/rto/teachers`);
      const teachersData = await teachersRes.json();

      if (!teachersRes.ok) throw new Error(teachersData.message || 'Failed to fetch teachers');

      let allTeachers = teachersData.teachers || teachersData;

      // Filter teachers by RTO number from localStorage if it exists and user is an RTO role
      if (rtoNumber && storedUser?.role === 'rto') {
        allTeachers = allTeachers.filter(t => t.rtoNumber === rtoNumber);
      }

      setTeachers(allTeachers);
      setError('');
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
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const rtoNumber = storedUser?.rtoNumber || localStorage.getItem('rtoNumber');

      // Only send the fields the form actually manages. The server generates
      // and returns a temporary password on create — never send one from the client.
      const payload = {
        name: currentTeacher.name,
        email: currentTeacher.email,
        phone: currentTeacher.phone,
        rtoNumber: rtoNumber || currentTeacher.rtoNumber
      };

      const url = modalMode === 'edit'
        ? `${API_URL}/api/rto/teachers/${selectedId}`
        : `${API_URL}/api/rto/teachers`;
      const method = modalMode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Operation failed');

      setModalMode(null);

      if (modalMode === 'add' && data.temporaryPassword) {
        alert(`Teacher created. Temporary password: ${data.temporaryPassword}\nPlease share this securely and ask them to change it on first login.`);
      }

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
      (item.phone && item.phone.toLowerCase().includes(query))
    );
  });

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage) || 1;

  // Keep currentPage valid whenever filtering/deleting shrinks the result set.
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

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
            <p>Manage RTO teachers and update credentials.</p>
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
                  phone: ''
                });
                setSelectedId(null);
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
                <th style={{ width: '60px' }}>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th className="text-center" style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTeachers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted" style={{ textAlign: 'center', padding: '2rem' }}>No teachers found.</td>
                </tr>
              ) : (
                paginatedTeachers.map((t, idx) => {
                  const serialNumber = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                    <tr key={t._id || idx}>
                      <td>{serialNumber}</td>
                      <td className="fw-medium">{t.name}</td>
                      <td>{t.email}</td>
                      <td>{t.phone || 'N/A'}</td>
                      <td className="text-center">
                        <div className="action-icon-btns">
                          <button
                            title="View"
                            className="icon-action-btn view"
                            onClick={() => {
                              setCurrentTeacher({ name: t.name, email: t.email, phone: t.phone || '' });
                              setModalMode('view');
                            }}
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            title="Edit"
                            className="icon-action-btn edit"
                            onClick={() => {
                              // Only carry the fields the form actually edits —
                              // never copy the raw teacher record (which could include sensitive fields) into form state.
                              setCurrentTeacher({ name: t.name, email: t.email, phone: t.phone || '' });
                              setSelectedId(t._id);
                              setModalMode('edit');
                            }}
                          >
                            <Edit size={18} />
                          </button>
                          <button title="Delete" className="icon-action-btn delete" onClick={() => handleDelete(t._id)}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
                  <div className="teacher-modal-footer">
                    <button onClick={() => setModalMode(null)} className="teacher-btn-submit">Close</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave}>
                  <div className="teacher-form-group">
                    <label>Full Name *</label>
                    <input type="text" required value={currentTeacher.name} onChange={(e) => setCurrentTeacher({ ...currentTeacher, name: e.target.value })} />
                  </div>
                  <div className="teacher-form-group">
                    <label>Email Address *</label>
                    <input type="email" required value={currentTeacher.email} onChange={(e) => setCurrentTeacher({ ...currentTeacher, email: e.target.value })} />
                  </div>
                  <div className="teacher-form-group">
                    <label>Phone Number</label>
                    <input type="text" value={currentTeacher.phone} onChange={(e) => setCurrentTeacher({ ...currentTeacher, phone: e.target.value })} />
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