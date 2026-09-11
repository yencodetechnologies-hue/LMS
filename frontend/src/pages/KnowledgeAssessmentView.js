import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../data/service';
import '../styles/knowledgeAssessmentview.css';
import DashboardLayout from '../components/DashboardLayout';

// Submission status codes (matches backend StudentSubmission.status)
const STATUS_INITIAL = 0;     // form step done, no answers yet — editable
const STATUS_APPROVED = 1;    // RTO approved — locked
const STATUS_REATTEMPT = 2;   // RTO requested reattempt — editable
const STATUS_SUBMITTED = 3;   // student submitted answers — locked, pending review

export default function KnowledgeAssessmentView() {
  const { rtoNumber, courseId } = useParams();
  const navigate = useNavigate();

  // Retrieve the complete student object from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isStudentLoggedIn = storedUser.role === 'student';

  // If the user role is 'student', skip the manual form and go straight to assessment. Otherwise, start with the form.
  const [step, setStep] = useState(isStudentLoggedIn ? 'assessment' : 'form');
  const [loading, setLoading] = useState(true);
  const [rtoData, setRtoData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState('');

  const [studentForm, setStudentForm] = useState({
    studentName: storedUser.name || '',
    studentId: storedUser.id || storedUser.studentId || '',
    studentEmail: storedUser.email || '',
    role: storedUser.role || 'student',
    date: new Date().toISOString().split('T')[0]
  });

  const [submitting, setSubmitting] = useState(false);
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);

  // Existing submission info — used to show status banner and, on reattempt,
  // pre-fill the student's previously selected answers
  const [existingSubmission, setExistingSubmission] = useState(null); // full submission object | null
  const [submissionStatus, setSubmissionStatus] = useState(null); // null = not yet checked, 0/1/2/3 as above

  const assessmentContainerRef = useRef(null);

  // Fetch RTO + course data
  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/jobpack/${rtoNumber}/${courseId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load assessment data');

        setRtoData(data.order);
        setCourseData(data.course);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [rtoNumber, courseId]);

  // Fetch this student's existing submission (if any) for this course,
  // to determine initial / submitted / approved / reattempt status
  useEffect(() => {
    const fetchExistingSubmission = async () => {
      const currentStudentId = studentForm.studentId || storedUser.id;
      if (!currentStudentId || !rtoNumber || !courseId) return;

      try {
        const response = await fetch(
          `${API_URL}/api/students/submission/${rtoNumber}/${courseId}/${currentStudentId}`
        );
        if (response.status === 404) {
          // No submission yet — fresh attempt
          setExistingSubmission(null);
          setSubmissionStatus(null);
          return;
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load submission status');

        const submission = data.submission;
        setExistingSubmission(submission);

        const status = submission?.status;
        setSubmissionStatus(
          status === STATUS_APPROVED || status === STATUS_REATTEMPT || status === STATUS_SUBMITTED
            ? status
            : STATUS_INITIAL
        );
      } catch (err) {
        // If lookup fails, don't block the page — treat as no prior submission
        console.error('Error checking existing submission:', err);
        setExistingSubmission(null);
        setSubmissionStatus(null);
      }
    };

    if (step === 'assessment') {
      fetchExistingSubmission();
    }
  }, [step, rtoNumber, courseId, studentForm.studentId, storedUser.id]);

  // Lock the form when Submitted (pending review) or Approved; unlock for Reattempt or Initial
  useEffect(() => {
    if (submissionStatus === STATUS_SUBMITTED || submissionStatus === STATUS_APPROVED) {
      setIsAlreadySubmitted(true);
    } else if (
      submissionStatus === STATUS_REATTEMPT ||
      submissionStatus === STATUS_INITIAL ||
      submissionStatus === null
    ) {
      setIsAlreadySubmitted(false);
    }
  }, [submissionStatus]);

  // Pre-fill previously selected answers into the rendered assessment HTML
  // once it's mounted, when the student is on a reattempt
  useEffect(() => {
    if (submissionStatus !== STATUS_REATTEMPT) return;
    if (!existingSubmission?.responses?.length) return;
    if (!assessmentContainerRef.current) return;

    const container = assessmentContainerRef.current;
    const questionNodes = container.querySelectorAll('.paper-question-node');
    const previousResponses = existingSubmission.responses;

    questionNodes.forEach((node, idx) => {
      const prevResp = previousResponses.find((r) => r.questionIndex === idx + 1) || previousResponses[idx];
      if (!prevResp) return;

      const prevSelection = prevResp.studentSelection;
      if (prevSelection === undefined || prevSelection === null || prevSelection === 'No answer provided') return;

      const textInput = node.querySelector('textarea, input[type="text"]');
      const checkableInputs = node.querySelectorAll('input[type="checkbox"], input[type="radio"]');

      if (textInput) {
        textInput.value = prevSelection;
      } else if (checkableInputs.length > 0) {
        const selectedValues = Array.isArray(prevSelection) ? prevSelection : [prevSelection];
        checkableInputs.forEach((input) => {
          const inputLabel = input.value || input.nextElementSibling?.innerText;
          if (selectedValues.includes(inputLabel)) {
            input.checked = true;
          }
        });
      }
    });
  }, [submissionStatus, existingSubmission, courseData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!studentForm.studentName.trim() || !studentForm.studentId.trim() || !studentForm.studentEmail.trim()) {
      alert('Please fill out all required student details.');
      return;
    }

    try {
      // Initialize submission record in the database with URL parameters
      const initialPayload = {
        student: studentForm,
        rtoId: rtoNumber,
        courseId: courseId,
        responses: []
      };

      const response = await fetch(`${API_URL}/api/students/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialPayload)
      });

      if (response.ok) {
        const updatedCourses = storedUser.courses ? Array.from(new Set([...storedUser.courses, courseId])) : [courseId];
        const updatedUser = {
          ...storedUser,
          id: studentForm.studentId,
          name: studentForm.studentName,
          email: studentForm.studentEmail,
          role: 'student',
          rtoNumber: rtoNumber || storedUser.rtoNumber,
          courses: updatedCourses
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Error initializing student submission record:', err);
    }

    setStep('assessment');
  };

  if (loading) return <div className="dashboard-loading">Loading Knowledge Assessment Portal...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  let rawHtmlContent = courseData?.knowledgeAssessment?.html || '<p>No knowledge assessment content available.</p>';

  const dynamicInstituteName = rtoData?.instituteName || '[RTO_LEGAL_NAME]';
  const dynamicRtoId = rtoData?.rtoNumber || rtoNumber;
  const dynamicLogoHtml = rtoData?.logo
    ? `<img src="${rtoData.logo}" alt="RTO Logo" style="max-height: 40px; max-width: 100px; object-fit: contain;" />`
    : '[LOGO]';

  rawHtmlContent = rawHtmlContent
    .replace(/\[RTO_LEGAL_NAME\]/g, dynamicInstituteName)
    .replace(/\[RTO_ID\]/g, dynamicRtoId)
    .replace(/\[LOGO\]/g, dynamicLogoHtml);

  rawHtmlContent = rawHtmlContent.replace(
    /<div class="paper-text-response-box"[^>]*>([\s\S]*?)<\/div>/g,
    '<textarea class="student-answer-textarea" placeholder="Write your answer here..." ' + (isAlreadySubmitted ? 'disabled' : '') + '></textarea>'
  );

  rawHtmlContent = rawHtmlContent.replace(
    /<td style="border:1px solid #94a3b8; padding:0.3rem 0.4rem; text-align:left;"><\/td>/g,
    '<td><input type="text" class="table-cell-input" placeholder="Enter details..." ' + (isAlreadySubmitted ? 'disabled' : '') + ' /></td>'
  );

  const handleSubmitAssessment = async () => {
    if (isAlreadySubmitted) {
      alert('You cannot submit right now. Your assessment is either pending review or already approved.');
      navigate('/dashboard');
      return;
    }

    if (!assessmentContainerRef.current) return;

    const container = assessmentContainerRef.current;
    const questionNodes = container.querySelectorAll('.paper-question-node');

    let responses = [];

    questionNodes.forEach((node, idx) => {
      const questionText = node.querySelector('.paper-question-p')?.innerText || `Question ${idx + 1}`;
      const correctAnswerMeta = node.getAttribute('data-correct-answer') || '';

      let studentSelection = null;
      const textInput = node.querySelector('textarea, input[type="text"]');
      const checkedOptions = node.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked');

      if (textInput) {
        studentSelection = textInput.value;
      } else if (checkedOptions.length > 0) {
        studentSelection = Array.from(checkedOptions).map(opt => opt.value || opt.nextElementSibling?.innerText);
        if (checkedOptions.length === 1 && node.querySelector('input[type="radio"]')) {
          studentSelection = studentSelection[0];
        }
      }

      responses.push({
        questionIndex: idx + 1,
        questionText,
        studentSelection: studentSelection || 'No answer provided',
        correctAnswer: correctAnswerMeta,
        verdict: 'Pending Review'
      });
    });

    const submissionPayload = {
      student: studentForm,
      rtoId: rtoNumber,
      courseId: courseId,
      responses
    };

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/students/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit assessment');

      setIsAlreadySubmitted(true);
      setSubmissionStatus(STATUS_SUBMITTED);
      setExistingSubmission(data.submission || null);

      const updatedCourses = storedUser.courses ? Array.from(new Set([...storedUser.courses, courseId])) : [courseId];
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        id: studentForm.studentId,
        name: studentForm.studentName,
        email: studentForm.studentEmail,
        role: 'student',
        rtoNumber: rtoNumber,
        courses: updatedCourses
      }));

      alert('Assessment responses submitted successfully! Your submission is now pending review.');
      navigate('/dashboard');
    } catch (err) {
      alert('Error submitting assessment: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'form') {
    return (
      <div className="portal-page-wrapper">
        <div className="portal-login-card" style={{ maxWidth: '500px', margin: '40px auto', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div className="portal-header" style={{ marginBottom: '20px' }}>
            <h2>Registration Form</h2>
            <p>Please enter your details to begin the online knowledge assessment.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="portal-form">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Student Full Name *</label>
              <input
                type="text"
                name="studentName"
                required
                onChange={handleInputChange}
                placeholder="Enter your full name"
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Student ID *</label>
              <input
                type="text"
                name="studentId"
                required
                onChange={handleInputChange}
                placeholder="Enter your student ID"
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Email Address *</label>
              <input
                type="email"
                name="studentEmail"
                required
                onChange={handleInputChange}
                placeholder="student@example.com"
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
              />
            </div>

            <button type="submit" className="btn-start-assessment" style={{ width: '100%', padding: '12px', background: '#6b213a', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Status banner content
  let statusBanner = null;
  if (submissionStatus === STATUS_SUBMITTED) {
    statusBanner = (
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>
        ⏳Assessment submitted successfully. Please wait for your RTO assessor to review it.
      </div>
    );
  } else if (submissionStatus === STATUS_APPROVED) {
    statusBanner = (
      <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>
        ✅ Approved: Your assessment has been reviewed and marked Satisfactory. No further action is needed.
      </div>
    );
  } else if (submissionStatus === STATUS_REATTEMPT) {
    statusBanner = (
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>
        🔁 Reattempt Required: Your assessor has requested you review and resubmit your answers. Your previous responses are shown below — update them and submit again.
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="portal-page-wrapper">
        <div className="portal-main-container">
          <header className="portal-top-bar">
            <div className="portal-brand">
              {rtoData?.logo ? (
                <img src={rtoData.logo} alt="RTO Logo" className="portal-logo" />
              ) : (
                <div className="portal-logo-placeholder">[LOGO]</div>
              )}
              <div>
                <h2>{rtoData?.instituteName || 'RTO Institute'}</h2>
                <span className="portal-rto-badge">RTO ID: {rtoData?.rtoNumber || rtoNumber}</span>
              </div>
            </div>

            <div className="portal-student-pill">
              <span><strong>Candidate:</strong> {studentForm.studentName} ({studentForm.studentId})</span>
              {!isStudentLoggedIn && (
                <button className="btn-switch-user" onClick={() => setStep('form')} style={{ marginLeft: '10px', padding: '4px 8px', cursor: 'pointer' }}>Change User</button>
              )}
            </div>
          </header>

          <main className="portal-content-body">
            {statusBanner}

            <div
              ref={assessmentContainerRef}
              className={`assessment-html-container editable-assessment-view ${isAlreadySubmitted ? 'disabled-assessment-view' : ''}`}
              dangerouslySetInnerHTML={{ __html: rawHtmlContent }}
            />

            <div className="student-submission-summary">
              <h3>Student Submission Details</h3>
              <p><strong>Name:</strong> {studentForm.studentName}</p>
              <p><strong>Student ID:</strong> {studentForm.studentId}</p>
              <p><strong>Email:</strong> {studentForm.studentEmail}</p>
              <p><strong>Date:</strong> {studentForm.date}</p>
            </div>

            <div className="assessment-footer-actions">
              <button
                className="btn-submit-exam"
                onClick={handleSubmitAssessment}
                disabled={submitting || isAlreadySubmitted}
                style={{ opacity: isAlreadySubmitted ? 0.6 : 1, cursor: isAlreadySubmitted ? 'not-allowed' : 'pointer' }}
              >
                {submitting
                  ? 'Submitting Responses...'
                  : submissionStatus === STATUS_SUBMITTED
                    ? 'Pending Review'
                    : submissionStatus === STATUS_APPROVED
                      ? 'Already Approved'
                      : submissionStatus === STATUS_REATTEMPT
                        ? 'Resubmit Assessment Responses'
                        : 'Submit Assessment Responses'}
              </button>
            </div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}