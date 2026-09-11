import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/service';
import '../styles/Mycourse.css';
import DashboardLayout from '../components/DashboardLayout';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const itemsPerPage = 5;

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/courses/my-courses`, {
          headers: authHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load purchased courses');
        setCourses(data.courses || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, []);

  const handleCopyLink = (url) => {
    if (!url) {
      alert('No link available');
      return;
    }
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const filteredCourses = courses.filter((item) => {
    const course = item.courseId || item;
    const title = course.title || course.name || '';
    const category = course.category || '';
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading your purchased courses...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  return (
    <DashboardLayout>
      <div className="my-courses-container">
        <div className="my-courses-header">
          <h1 className="my-courses-title">My Purchased Courses</h1>
          <input
            type="text"
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="my-courses-search"
          />
        </div>

        {courses.length === 0 ? (
          <p className="no-data-text">You have not purchased any courses yet.</p>
        ) : filteredCourses.length === 0 ? (
          <p className="no-data-text">No courses match your search criteria.</p>
        ) : (
          <div className="table-responsive">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Fee</th>
                  <th>Purchased Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentCourses.map((item, index) => {
                  const course = item.courseId || item;
                  const purchasedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A';

                  return (
                    <tr key={course._id || index}>
                      <td>
                        {course.image ? (
                          <img src={course.image} alt={course.title} className="course-thumbnail" />
                        ) : (
                          <div className="no-thumbnail">No Image</div>
                        )}
                      </td>
                      <td>
                        <div className="table-course-title">{course.title || course.name}</div>
                      </td>
                      <td>
                        <div><strong>Category:</strong> {course.category || 'N/A'}</div>
                      </td>
                      <td>
                        <div>${course.fee !== undefined ? course.fee : '0'}</div>
                      </td>
                      <td>{purchasedDate}</td>
                      <td>
                        <button 
                          className="btn-view" 
                          onClick={() => setSelectedCourse(item)}
                        >
                          View Content
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="pagination-container">
              <span className="pagination-info">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCourses.length)} of {filteredCourses.length} entries
              </span>
              <div className="pagination-controls">
                <button 
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span style={{ padding: '6px 12px', fontSize: '13px', alignSelf: 'center' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Modal View */}
        {selectedCourse && (() => {
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          const course = selectedCourse.courseId || selectedCourse;
          const rtoNumber = selectedCourse.rtoNumber || storedUser.rtoNumber || 'RTO-GENERAL';
          const courseId = course._id || '';

          // Generate URLs using rtoNumber and courseId
          const jobPackGeneratedUrl = `${window.location.origin}/jobpack/${rtoNumber}/${courseId}`;
          const knowledgeAnswerGeneratedUrl = `${window.location.origin}/knowledge-answer/${rtoNumber}/${courseId}`;
          const mappingDocGeneratedUrl = `${window.location.origin}/mapping-document/${rtoNumber}/${courseId}`;
          const practicalMarkingGeneratedUrl = `${window.location.origin}/practical-marking/${rtoNumber}/${courseId}`;
          const knowledgeAssessmentGeneratedUrl = `${window.location.origin}/assessment/knowledge/${rtoNumber}/${courseId}`;
          const practicalAssessmentGeneratedUrl = `${window.location.origin}/assessment/practical/${rtoNumber}/${courseId}`;

          const jobPackUrl = course.jobPackTemplateUrl || jobPackGeneratedUrl;
          const knowledgeAnswerUrl = course.knowledgeAnswerGuideUrl || knowledgeAnswerGeneratedUrl;
          const mappingDocUrl = course.mappingDocumentUrl || mappingDocGeneratedUrl;
          const practicalMarkingUrl = course.practicalAssessment?.practicalMarkingGuideUrl || course.practicalMarkingGuideUrl || practicalMarkingGeneratedUrl;
          const knowledgeAssessmentUrl = course.knowledgeAssessmentUrl || knowledgeAssessmentGeneratedUrl;
          const practicalAssessmentUrl = course.practicalAssessmentUrl || practicalAssessmentGeneratedUrl;

          return (
            <div className="course-modal-overlay" onClick={() => setSelectedCourse(null)}>
              <div className="course-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{course.title || course.name || 'Course Details'}</h2>
                  <button className="modal-close-btn" onClick={() => setSelectedCourse(null)}>×</button>
                </div>
                
                <div className="modal-body">
                  <div className="modal-section">
                    <h3>General Information</h3>
                    <p><strong>Category:</strong> {course.category || 'N/A'}</p>
                    <p><strong>Duration:</strong> {course.duration || 'N/A'} hours</p>
                    <p><strong>Fee:</strong> ${course.fee !== undefined ? course.fee : '0'}</p>
                    <p><strong>Status:</strong> {course.status || 'Active'}</p>
                    <p><strong>Description:</strong> {course.description || 'N/A'}</p>
                  </div>

                  <div className="modal-section">
                    <h3>Template & Resource URLs</h3>
                    
                    <div className="url-row">
                      <span className="url-label">Job Pack Template URL:</span>
                      <div className="url-input-group">
                        <input type="text" readOnly value={jobPackUrl} />
                        <button className="btn-copy" onClick={() => handleCopyLink(jobPackUrl)}>Copy Link</button>
                      </div>
                    </div>

                    <div className="url-row">
                      <span className="url-label">Knowledge Answer Guide URL:</span>
                      <div className="url-input-group">
                        <input type="text" readOnly value={knowledgeAnswerUrl} />
                        <button className="btn-copy" onClick={() => handleCopyLink(knowledgeAnswerUrl)}>Copy Link</button>
                      </div>
                    </div>

                    <div className="url-row">
                      <span className="url-label">Mapping Document URL:</span>
                      <div className="url-input-group">
                        <input type="text" readOnly value={mappingDocUrl} />
                        <button className="btn-copy" onClick={() => handleCopyLink(mappingDocUrl)}>Copy Link</button>
                      </div>
                    </div>

                    <div className="url-row">
                      <span className="url-label">Practical Marking Guide URL:</span>
                      <div className="url-input-group">
                        <input type="text" readOnly value={practicalMarkingUrl} />
                        <button className="btn-copy" onClick={() => handleCopyLink(practicalMarkingUrl)}>Copy Link</button>
                      </div>
                    </div>

                    <div className="url-row">
                      <span className="url-label">Knowledge Assessment URL:</span>
                      <div className="url-input-group">
                        <input type="text" readOnly value={knowledgeAssessmentUrl} />
                        <button className="btn-copy" onClick={() => handleCopyLink(knowledgeAssessmentUrl)}>Copy Link</button>
                      </div>
                    </div>

                    <div className="url-row">
                      <span className="url-label">Practical Assessment URL:</span>
                      <div className="url-input-group">
                        <input type="text" readOnly value={practicalAssessmentUrl} />
                        <button className="btn-copy" onClick={() => handleCopyLink(practicalAssessmentUrl)}>Copy Link</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn-secondary" onClick={() => setSelectedCourse(null)}>Close</button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </DashboardLayout>
  );
}