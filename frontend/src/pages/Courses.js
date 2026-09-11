import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  FileText,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import CourseModal from '../components/CourseModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { API_URL } from '../data/service';

import '../styles/Courses.css';

const ITEMS_PER_PAGE = 5;

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewModalCourse, setViewModalCourse] = useState(null); // Course currently shown in popup modal
  const [saving, setSaving] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

const fetchCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/courses`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load courses');
      setCourses(data.courses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses based on search
  const filteredCourses = courses.filter(
    (c) =>
      (c.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.category || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  // Reset to page 1 whenever search input changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE) || 1;
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openAddModal = () => {
    setEditingCourse(null);
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const isEdit = Boolean(editingCourse);
      const url = isEdit ? `${API_URL}/api/courses/${editingCourse._id}` : `${API_URL}/api/courses`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save course');

      if (isEdit) {
        setCourses((prev) => prev.map((c) => (c._id === data.course._id ? data.course : c)));
        if (viewModalCourse?._id === data.course._id) {
          setViewModalCourse(data.course);
        }
      } else {
        setCourses((prev) => [data.course, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/api/courses/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete course');

      setCourses((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      if (viewModalCourse?._id === deleteTarget._id) {
        setViewModalCourse(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteTarget(null);
    }
  };

  const toggleStatus = async (course) => {
    try {
      const res = await fetch(`${API_URL}/api/courses/${course._id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');

      setCourses((prev) => prev.map((c) => (c._id === data.course._id ? data.course : c)));
      if (viewModalCourse?._id === course._id) {
        setViewModalCourse(data.course);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <DashboardLayout title="Courses" subtitle="Manage the courses offered across your institute.">
      <div className="dash-panel">
        {/* Top Actions */}
        <div className="course-toolbar">
          <div className="dash-search course-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by course name, category, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="button" className="btn-primary" onClick={openAddModal}>
            <Plus size={16} />
            Add Course
          </button>
        </div>

        {error && <div className="auth-alert">{error}</div>}

        {/* ================= TABLE LIST ================= */}
        {loading ? (
          <div className="table-loading">
            <Loader2 size={20} className="spin-icon" /> Loading courses...
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Duration</th>
                    <th>Fee (₹)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCourses.map((course) => (
                    <tr key={course._id}>
                      <td style={{ width: '60px' }}>
                        {course.image ? (
                          <img
                            src={course.image}
                            alt={course.title}
                            className="table-row-thumbnail"
                          />
                        ) : (
                          <div className="table-thumbnail-placeholder">
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </td>
                      <td>
                        <p className="course-name">{course.title}</p>
                        <p className="course-desc">
                          {course.description
                            ? course.description.slice(0, 60) + (course.description.length > 60 ? '...' : '')
                            : 'No description'}
                        </p>
                      </td>
                      <td>{course.category}</td>
                      <td>{course.duration}</td>
                      <td>₹{course.fee}</td>
                      <td>
                        <button
                          type="button"
                          className={`status-toggle ${course.status}`}
                          onClick={() => toggleStatus(course)}
                          title="Click to toggle status"
                        >
                          <span className="status-toggle-dot" />
                          {course.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td>
                        <div className="row-actions">
                          {/* VIEW DETAILS POPUP BUTTON */}
                          <button
                            type="button"
                            className="icon-btn icon-btn-view"
                            onClick={() => setViewModalCourse(course)}
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Compliance Documents Button */}
                          <button
                            type="button"
                            className="icon-btn icon-btn-manage"
                            onClick={() => navigate(`/courses/${course._id}/documents`)}
                            title="Manage Documents"
                          >
                            <FileText size={15} />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            className="icon-btn"
                            onClick={() => openEditModal(course)}
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            className="icon-btn icon-btn-danger"
                            onClick={() => setDeleteTarget(course)}
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredCourses.length === 0 && (
                    <tr>
                      <td colSpan={7} className="table-empty">
                        {search ? `No courses match "${search}".` : 'No courses yet — add your first one.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ================= PAGINATION BAR ================= */}
            {filteredCourses.length > 0 && (
              <div className="pagination-wrapper">
                <div className="pagination-info">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredCourses.length)} of{' '}
                  {filteredCourses.length} courses
                </div>

                <div className="pagination-controls">
                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        className={`pagination-number-btn ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= VIEW DETAILS POPUP MODAL ================= */}
      {viewModalCourse && (
        <div className="modal-overlay" onClick={() => setViewModalCourse(null)}>
          <div className="modal-box course-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Course Details</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setViewModalCourse(null)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-view-body">
              {/* Image banner / placeholder */}
              <div className="modal-view-image-wrap">
                {viewModalCourse.image ? (
                  <img
                    src={viewModalCourse.image}
                    alt={viewModalCourse.title}
                    className="modal-view-thumbnail"
                  />
                ) : (
                  <div className="modal-view-placeholder">
                    <ImageIcon size={40} />
                    <span>No image uploaded for this course</span>
                  </div>
                )}
              </div>

              {/* Title & Status */}
              <div className="modal-view-title-row">
                <h3>{viewModalCourse.title}</h3>
                <span className={`status-pill ${viewModalCourse.status}`}>
                  {viewModalCourse.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Description */}
              <p className="modal-view-description">
                {viewModalCourse.description || 'No description provided.'}
              </p>

              {/* Key Details Grid */}
              <div className="modal-view-grid">
                <div className="modal-view-item">
                  <span className="modal-view-label">Category</span>
                  <span className="modal-view-value">{viewModalCourse.category}</span>
                </div>
                <div className="modal-view-item">
                  <span className="modal-view-label">Duration</span>
                  <span className="modal-view-value">{viewModalCourse.duration}</span>
                </div>
                <div className="modal-view-item">
                  <span className="modal-view-label">Fee</span>
                  <span className="modal-view-value">₹{viewModalCourse.fee}</span>
                </div>
                <div className="modal-view-item">
                  <span className="modal-view-label">Course ID</span>
                  <span className="modal-view-value font-mono">{viewModalCourse._id}</span>
                </div>
              </div>

              {/* Assessment link (if published) */}
              {/* {viewModalCourse.assessment?.slug && (
                <div className="modal-view-link-card">
                  <span className="modal-view-label">Published Knowledge Assessment</span>
                  <a
                    href={`/assessment/${viewModalCourse.assessment.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    /assessment/{viewModalCourse.assessment.slug}
                    <ExternalLink size={13} />
                  </a>
                </div>
              )} */}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setViewModalCourse(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  const toEdit = viewModalCourse;
                  setViewModalCourse(null);
                  openEditModal(toEdit);
                }}
              >
                <Pencil size={14} /> Edit Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Course Modal */}
      {modalOpen && (
        <CourseModal
          course={editingCourse}
          saving={saving}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete this course?"
          message={`"${deleteTarget.title}" will be permanently removed. This can't be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </DashboardLayout>
  );
}