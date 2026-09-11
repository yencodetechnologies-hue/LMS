import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/service';
import DashboardLayout from '../components/DashboardLayout';
import { Search, Eye, X, CheckCircle2, Clock } from 'lucide-react';
import '../styles/dashboard.css';
import '../styles/RtoUserList.css';
import '../styles/RtoStudentManagement.css';

export default function RtoStudentManagement() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'approve' | 'reattempt', submissionId: string } | null
  const [errorAlert, setErrorAlert] = useState(null); // string | null
  const itemsPerPage = 8;

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRtoNum = storedUser.rtoNumber || '';

  const fetchStudentSubmissions = async () => {
    try {
      if (!userRtoNum) {
        throw new Error('No RTO Number found in user session.');
      }

      const response = await fetch(`${API_URL}/api/students/submissions/rto/${userRtoNum}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch student submissions');

      setSubmissions(data.submissions || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentSubmissions();
  }, [userRtoNum]);

  const handleVerifySubmission = async (submissionId, status) => {
    try {
      const response = await fetch(`${API_URL}/api/students/submissions/${submissionId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update submission status');

      setConfirmAction(null);
      setSelectedSubmission(null);
      fetchStudentSubmissions();
    } catch (err) {
      setConfirmAction(null);
      setErrorAlert(err.message);
    }
  };

  const filteredSubmissions = submissions.filter((item) => {
    const query = searchTerm.toLowerCase();
    const student = item.student || {};
    return (
      (student.studentName && student.studentName.toLowerCase().includes(query)) ||
      (student.studentEmail && student.studentEmail.toLowerCase().includes(query)) ||
      (student.studentId && student.studentId.toLowerCase().includes(query))
    );
  });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage) || 1;
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <DashboardLayout><div className="dashboard-loading">Loading Student Submissions...</div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="dashboard-error">Error: {error}</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="dashboard-content-wrapper rto-users-wrapper">
        <div className="rto-header-flex">
          <div className="rto-title-area">
            <h1>Student Submissions Management</h1>
            <p>Review student assessment results for RTO Number: <strong>{userRtoNum}</strong></p>
          </div>

          <div className="rto-search-box">
            <Search size={18} />
            <input
              type="text"
              className="rto-search-input"
              placeholder="Search by student name, email, ID..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        <div className="rto-table-card">
          <table className="rto-data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Email</th>
                <th>Submitted Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="rto-empty-cell">No student submissions found.</td>
                </tr>
              ) : (
                paginatedSubmissions.map((sub, idx) => (
                  <tr key={sub._id || idx}>
                    <td className="fw-medium">{sub.student?.studentName || 'N/A'}</td>
                    <td>{sub.student?.studentId || 'N/A'}</td>
                    <td>{sub.student?.studentEmail || 'N/A'}</td>
                    <td>{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'N/A'}</td>
                    <td className="text-center">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="rto-view-btn"
                        title="Review Assessment Details"
                      >
                        <Eye size={16} /> Review
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

        {selectedSubmission && (
          <div className="rto-modal-overlay">
            <div className="rto-modal-box rsm-review-modal">

              {/* Modal Header */}
              <div className="rsm-modal-header">
                <div>
                  <h2 className="rsm-modal-title">Assessment Review</h2>
                  <p className="rsm-modal-subtitle">
                    Candidate: <strong>{selectedSubmission.student?.studentName}</strong> ({selectedSubmission.student?.studentId})
                  </p>
                </div>
                <button onClick={() => setSelectedSubmission(null)} className="rsm-close-btn">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content / Questions Body */}
              <div className="rsm-modal-body">
                <div className="rsm-meta-bar">
                  <span><strong>Email:</strong> {selectedSubmission.student?.studentEmail}</span>
                  <span><strong>Submitted:</strong> {new Date(selectedSubmission.submittedAt).toLocaleDateString()}</span>
                </div>

                <h3 className="rsm-section-heading">Question Responses</h3>

                {selectedSubmission.responses && selectedSubmission.responses.length > 0 ? (
                  selectedSubmission.responses.map((resp, rIdx) => {
                    const course = selectedSubmission.courseId || {};
                    const allBlocks = course.knowledgeAssessment?.canvasBlocks || [];

                    // Only actual question blocks carry options/correctAnswer
                    const questionBlocks = allBlocks.filter((b) => b.type === 'question');

                    // Match the response to its source block: prefer instanceId,
                    // then exact question text, then fall back to positional order
                    const questionBlock =
                      questionBlocks.find((b) => resp.instanceId && b.instanceId === resp.instanceId) ||
                      questionBlocks.find((b) => resp.questionText && b.text?.trim() === resp.questionText?.trim()) ||
                      questionBlocks[rIdx];

                    const availableOptions = questionBlock?.options || resp.options || [];

                    // Resolve Student Answer text from index selection
                    let studentAnsText = 'No answer provided';
                    if (resp.studentSelection !== undefined && resp.studentSelection !== null && resp.studentSelection !== '' && resp.studentSelection !== 'No answer provided') {
                      const indices = Array.isArray(resp.studentSelection)
                        ? resp.studentSelection
                        : [resp.studentSelection];

                      studentAnsText = indices
                        .map(idx => {
                          const parsedIdx = parseInt(idx, 10);
                          return !isNaN(parsedIdx) && availableOptions[parsedIdx] !== undefined
                            ? availableOptions[parsedIdx]
                            : idx;
                        })
                        .join(', ');
                    }

                    // Resolve Correct Answer text — source of truth is the question
                    // block's own correctAnswer (a plain option index, or array for
                    // multi-select), NOT resp.correctAnswer's legacy "[0]" string
                    let correctAnsText = 'Teacher review required';
                    if (questionBlock && questionBlock.correctAnswer !== undefined && questionBlock.correctAnswer !== null) {
                      const correctIndices = Array.isArray(questionBlock.correctAnswer)
                        ? questionBlock.correctAnswer
                        : [questionBlock.correctAnswer];

                      correctAnsText = correctIndices
                        .map(idx => {
                          const parsedIdx = parseInt(idx, 10);
                          return !isNaN(parsedIdx) && availableOptions[parsedIdx] !== undefined
                            ? availableOptions[parsedIdx]
                            : idx;
                        })
                        .join(', ');
                    } else if (resp.correctAnswer && resp.correctAnswer !== '""') {
                      // Fallback to legacy string format e.g. "[0]" if block lookup failed
                      try {
                        const cleanVal = resp.correctAnswer.replace(/[\[\]"]/g, '');
                        if (cleanVal !== '') {
                          const correctIndices = cleanVal.split(',').map(i => parseInt(i.trim(), 10));
                          correctAnsText = correctIndices
                            .map(idx => (!isNaN(idx) && availableOptions[idx] !== undefined ? availableOptions[idx] : resp.correctAnswer))
                            .join(', ');
                        } else {
                          correctAnsText = resp.correctAnswer;
                        }
                      } catch (e) {
                        correctAnsText = resp.correctAnswer;
                      }
                    }

                    const isCorrect = studentAnsText.trim().toLowerCase() === correctAnsText.trim().toLowerCase();

                    return (
                      <div key={resp._id || rIdx} className="rsm-question-card">
                        <div className="rsm-question-header">
                          <span className="rsm-question-index">Question {resp.questionIndex || rIdx + 1}</span>
                          <span className={`rsm-verdict-badge ${resp.verdict === 'Satisfactory' ? 'rsm-verdict-satisfactory' : 'rsm-verdict-pending'}`}>
                            <Clock size={12} /> {resp.verdict || 'Pending Review'}
                          </span>
                        </div>

                        <p className="rsm-question-text">{resp.questionText}</p>

                        {/* Three Column View: Options, Student Answer, Correct Answer */}
                        <div className="rsm-answer-grid">

                          {/* Column 1: Options / Question Info */}
                          <div className="rsm-answer-col rsm-options-col">
                            <span className="rsm-col-label">Options:</span>
                            <div className="rsm-options-list">
                              {availableOptions.length > 0 ? (
                                availableOptions.map((opt, oIdx) => (
                                  <div key={oIdx}><strong>{oIdx}:</strong> {opt}</div>
                                ))
                              ) : (
                                <span>Standard Answer Field</span>
                              )}
                            </div>
                          </div>

                          {/* Column 2: Student Answer with Dynamic Color Styling */}
                          <div className={`rsm-answer-col ${isCorrect ? 'rsm-answer-correct' : 'rsm-answer-incorrect'}`}>
                            <span className="rsm-col-label">Student Answer:</span>
                            <span className="rsm-answer-value">{studentAnsText}</span>
                          </div>

                          {/* Column 3: Correct Answer */}
                          <div className="rsm-answer-col rsm-correct-col">
                            <span className="rsm-col-label">Correct Answer:</span>
                            <span className="rsm-answer-value">{correctAnsText}</span>
                          </div>

                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="rsm-empty-responses">No responses recorded.</p>
                )}
              </div>

              {/* Modal Footer with Verify Actions */}
              <div className="rsm-modal-footer">
                <span className="rsm-footer-note">Review responses thoroughly before marking candidate status.</span>
                <div className="rsm-footer-actions">
                  <button
                    onClick={() => setConfirmAction({ type: 'reattempt', submissionId: selectedSubmission._id })}
                    className="rsm-btn rsm-btn-reattempt"
                  >
                    Request Reattempt
                  </button>
                  <button
                    onClick={() => setConfirmAction({ type: 'approve', submissionId: selectedSubmission._id })}
                    className="rsm-btn rsm-btn-approve"
                  >
                    <CheckCircle2 size={16} /> Approve
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {confirmAction && (
          <div className="rto-modal-overlay rsm-confirm-overlay">
            <div className="rto-modal-box rsm-confirm-modal">
              <h3 className="rsm-confirm-title">
                {confirmAction.type === 'approve' ? 'Approve this submission?' : 'Request a reattempt?'}
              </h3>
              <p className="rsm-confirm-message">
                {confirmAction.type === 'approve'
                  ? 'This will mark the candidate as Satisfactory and complete their assessment review.'
                  : 'This will notify the candidate to resubmit their assessment responses.'}
              </p>
              <div className="rsm-confirm-actions">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="rsm-btn rsm-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerifySubmission(confirmAction.submissionId, confirmAction.type === 'approve' ? 1 : 2)}
                  className={`rsm-btn ${confirmAction.type === 'approve' ? 'rsm-btn-confirm-approve' : 'rsm-btn-confirm-reattempt'}`}
                >
                  {confirmAction.type === 'approve' ? 'Yes, Approve' : 'Yes, Request Reattempt'}
                </button>
              </div>
            </div>
          </div>
        )}

        {errorAlert && (
          <div className="rto-modal-overlay rsm-alert-overlay">
            <div className="rto-modal-box rsm-alert-modal">
              <h3 className="rsm-alert-title">Something went wrong</h3>
              <p className="rsm-alert-message">{errorAlert}</p>
              <div className="rsm-alert-actions">
                <button
                  onClick={() => setErrorAlert(null)}
                  className="rsm-btn rsm-btn-confirm-approve"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}