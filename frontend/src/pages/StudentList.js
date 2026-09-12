import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../data/service';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/StudentList.css';

const PAGE_SIZE = 10;

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const teacherId = user?.id;

      if (!teacherId) {
        setError('Teacher id not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/students/${teacherId}/students`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load students.');
        }
        setStudents(data.students || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load students.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter((s) =>
      (s.studentName || '').toLowerCase().includes(term) ||
      (s.studentEmail || '').toLowerCase().includes(term) ||
      (s.courseNames || []).join(', ').toLowerCase().includes(term)
    );
  }, [students, search]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleReview = (student) => {
    if (!student.rtoId || !student.courseId || !student.studentId) {
      alert('No assessment record found to review for this student.');
      return;
    }
    localStorage.setItem(
      'reviewingStudent',
      JSON.stringify({
        studentId: student.studentId,
        studentName: student.studentName,
        studentEmail: student.studentEmail
      })
    );
    navigate(`/assessment/knowledge/${student.rtoId}/${student.courseId}`);
  };

  if (loading) return <div className="student-list-message">Loading students...</div>;
  if (error) return <div className="student-list-message student-list-error">{error}</div>;

  return (
    <DashboardLayout>
      <style>{`
        .student-list-container {
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: inherit;
        }
        .student-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 15px;
        }
        .student-list-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .student-list-search {
          padding: 10px 16px;
          font-size: 0.95rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          width: 300px;
          max-width: 100%;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .student-list-search:focus {
          border-color: #6b213a;
          box-shadow: 0 0 0 3px rgba(107, 33, 58, 0.1);
        }
        .student-list-table-wrapper {
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .student-list-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.95rem;
          color: #334155;
        }
        .student-list-table th {
          background-color: #f8fafc;
          color: #475569;
          font-weight: 600;
          padding: 14px 16px;
          border-bottom: 1px solid #e2e8f0;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }
        .student-list-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .student-list-table tbody tr:last-child td {
          border-bottom: none;
        }
        .student-list-table tbody tr:hover {
          background-color: #f8fafc;
        }
        .review-btn {
          background-color: #6b213a;
          color: #ffffff;
          border: none;
          padding: 6px 14px;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }
        .review-btn:hover {
          background-color: #52192c;
        }
        .review-btn:active {
          transform: scale(0.98);
        }
        .student-list-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        .pagination-info {
          font-size: 0.9rem;
          color: #64748b;
        }
        .pagination-controls {
          display: flex;
          gap: 6px;
        }
        .pagination-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 6px 12px;
          font-size: 0.85rem;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pagination-btn:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #94a3b8;
        }
        .pagination-btn.active {
          background: #6b213a;
          color: #ffffff;
          border-color: #6b213a;
        }
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .student-list-empty {
          text-align: center;
          padding: 40px;
          color: #64748b;
          font-size: 1rem;
          background: #ffffff;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }
      `}</style>
      <div className="student-list-container">
        <div className="student-list-header">
          <h2 className="student-list-title">My Students</h2>
          <input
            type="text"
            className="student-list-search"
            placeholder="Search by name, email, or course..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {filteredStudents.length === 0 ? (
          <p className="student-list-empty">No students found.</p>
        ) : (
          <>
            <div className="student-list-table-wrapper">
              <table className="student-list-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    {/* <th>Courses</th> */}
                    <th>Submissions</th>
                    <th>Last Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((s, index) => {
                    const serialNumber = (currentPage - 1) * PAGE_SIZE + index + 1;
                    return (
                      <tr key={s.studentId || index}>
                        <td style={{ fontWeight: 600, color: '#64748b' }}>{serialNumber}</td>
                        <td style={{ fontWeight: 500 }}>{s.studentName}</td>
                        <td>{s.studentEmail}</td>
                        {/* <td>{(s.courseNames || []).join(', ') || '-'}</td> */}
                        <td>{s.totalSubmissions}</td>
                        <td>{s.lastSubmissionDate}</td>
                        <td>
                          <button className="review-btn" onClick={() => handleReview(s)}>
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="student-list-pagination">
              <span className="pagination-info">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredStudents.length)} of {filteredStudents.length}
              </span>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentList;