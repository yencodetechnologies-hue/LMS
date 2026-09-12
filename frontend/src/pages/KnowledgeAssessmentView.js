import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../data/service';
import '../styles/knowledgeAssessmentview.css';
import DashboardLayout from '../components/DashboardLayout';

// Submission status codes (matches backend StudentSubmission.status)
const STATUS_INITIAL = 0;
const STATUS_APPROVED = 1;
const STATUS_REATTEMPT = 2;
const STATUS_SUBMITTED = 3;

const isAssessorOnlyNode = (node) => {
  const promptText = (node.querySelector('.paper-question-p')?.innerText || '')
    .trim()
    .toLowerCase()
    .replace(/:$/, '');
  return promptText === 'assessor result' || promptText === 'feedback' || promptText === 'overall outcome';
};

const escHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const TD_OPEN = '<td style="border:1px solid #94a3b8; padding:0.3rem 0.4rem; text-align:left;">';
const TD_EMPTY = `${TD_OPEN}</td>`;

function bindStudentDetailsIntoHtml(html, values) {
  const labelToValue = {
    'student name': values.studentName,
    'full name': values.studentName,
    'candidate name': values.studentName,
    'student id': values.studentId,
    'date of assessment': values.date,
  };

  let result = html;
  Object.entries(labelToValue).forEach(([label, value]) => {
    if (!value) return;
    const labelPattern = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(${escapeRegExp(TD_OPEN)}\\s*${labelPattern}\\s*<\\/td>)${escapeRegExp(TD_EMPTY)}`,
      'gi'
    );
    result = result.replace(regex, `$1${TD_OPEN}${escHtml(value)}</td>`);
  });
  return result;
}

function reorganizeAssessmentHtml(html, role) {
  const isStudent = role === 'student';
  const isTeacher = role === 'teacher';

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="__root">${html}</div>`, 'text/html');
  const root = doc.getElementById('__root');

  if (!root) return html;

  const allNodes = Array.from(root.querySelectorAll('.paper-question-node'));
  const assessorNodes = [];

  allNodes.forEach((node) => {
    const label = (node.querySelector('.paper-question-p')?.textContent || '')
      .trim()
      .toLowerCase()
      .replace(/:$/, '');
    const isAssessorBlock = label === 'assessor result' || label === 'feedback' || label === 'overall outcome';

    const shouldLock = isStudent ? isAssessorBlock : !isAssessorBlock;
    if (shouldLock) {
      node.classList.add('locked-block', isAssessorBlock ? 'assessor-only-block' : 'student-question-block');
      node.querySelectorAll('input, textarea').forEach((el) => {
        el.setAttribute('disabled', 'disabled');
        el.classList.add('locked-field');
      });
    }

    if (isTeacher && !isAssessorBlock) {
      const correctAnswer = node.getAttribute('data-correct-answer');
      if (correctAnswer && correctAnswer.trim()) {
        const answerEl = doc.createElement('div');
        answerEl.className = 'correct-answer-display';
        answerEl.innerHTML = `<strong>Correct answer:</strong> ${escHtml(correctAnswer)}`;
        node.appendChild(answerEl);
      }
    }

    if (isAssessorBlock) assessorNodes.push(node);
  });

  if (assessorNodes.length > 0) {
    const section = doc.createElement('div');
    section.className = 'assessor-feedback-section';

    const heading = doc.createElement('div');
    heading.className = 'assessor-feedback-heading';
    heading.textContent = 'Assessor Feedback';
    section.appendChild(heading);

    assessorNodes.forEach((node) => section.appendChild(node));
    root.appendChild(section);
  }

  return root.innerHTML;
}

const ASSESSMENT_CONTENT_STYLES = `
  .assessment-html-container p,
  .assessment-html-container h3,
  .assessment-html-container h4 { margin: 0 0 6px 0; }
  .assessment-html-container > * + * { margin-top: 10px; }
  .assessment-html-container textarea { margin-top: 4px; }
  .assessment-html-container hr { margin: 10px 0; opacity: 0.4; }
  .assessment-html-container .locked-field {
    background: #f1f5f9 !important;
    color: #94a3b8 !important;
    cursor: not-allowed !important;
    opacity: 0.55;
    pointer-events: none;
  }
  .assessment-html-container .locked-block {
    background: #f8fafc;
    border-radius: 6px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    position: relative;
  }
  .assessment-html-container .assessor-only-block::after {
    content: "Assessor use only";
    position: absolute; top: 0.4rem; right: 0.5rem;
    font-size: 8pt; font-weight: 600; color: #b8285a;
    background: #fdf2f6; border: 1px solid #f3c9d8;
    padding: 1px 6px; border-radius: 4px;
    text-transform: uppercase; letter-spacing: 0.02em;
  }
  .assessment-html-container .student-question-block::after {
    content: "Student response";
    position: absolute; top: 0.4rem; right: 0.5rem;
    font-size: 8pt; font-weight: 600; color: #475569;
    background: #f1f5f9; border: 1px solid #cbd5e1;
    padding: 1px 6px; border-radius: 4px;
    text-transform: uppercase; letter-spacing: 0.02em;
  }
  .assessment-html-container .feedback-saved-banner {
    font-size: 8pt; color: #065f46; background: #ecfdf5;
    border: 1px solid #a7f3d0; padding: 2px 6px; border-radius: 4px;
    display: inline-block; margin-top: 4px;
  }
  .assessment-html-container .assessor-feedback-section {
    margin-top: 24px; padding: 16px; border: 1px solid #f3c9d8;
    border-radius: 10px; background: #fffafc;
  }
  .assessment-html-container .assessor-feedback-heading {
    font-size: 10.5pt; font-weight: 700; color: #b8285a;
    text-transform: uppercase; letter-spacing: 0.04em;
    margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f3c9d8;
  }
  .assessment-html-container .assessor-feedback-section .paper-question-node {
    margin-bottom: 14px;
  }
  .assessment-html-container .assessor-feedback-section .paper-question-node:last-child {
    margin-bottom: 0;
  }
  .assessment-html-container .correct-answer-display {
    margin-top: 8px; padding: 8px 10px; background: #ecfdf5;
    border: 1px solid #a7f3d0; border-radius: 6px; font-size: 9.5pt; color: #065f46;
  }
  .assessment-html-container .correct-answer-display strong {
    color: #047857;
  }
`;

export default function KnowledgeAssessmentView() {
  const { rtoNumber, courseId } = useParams();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = storedUser.role || 'student';
  const isStudentLoggedIn = userRole === 'student';
  const isTeacherLoggedIn = userRole === 'teacher';

  const reviewingStudent = isTeacherLoggedIn
    ? JSON.parse(localStorage.getItem('reviewingStudent') || 'null')
    : null;
  const targetStudentId = isTeacherLoggedIn
    ? reviewingStudent?.studentId
    : storedUser.studentId;

  const hasUserCredentials = Boolean(storedUser.name && (storedUser.id || storedUser.studentId));
  const [step, setStep] = useState((isTeacherLoggedIn || (isStudentLoggedIn && hasUserCredentials)) ? 'assessment' : 'form');

  const [loading, setLoading] = useState(true);
  const [rtoData, setRtoData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState('');

  const [studentForm, setStudentForm] = useState({
    studentName: isTeacherLoggedIn ? (reviewingStudent?.studentName || '') : (storedUser.name || ''),
    studentId: isTeacherLoggedIn ? (reviewingStudent?.studentId || '') : (storedUser.id || storedUser.studentId || ''),
    studentEmail: isTeacherLoggedIn ? (reviewingStudent?.studentEmail || '') : (storedUser.email || ''),
    role: userRole,
    date: new Date().toISOString().split('T')[0]
  });

  const [submitting, setSubmitting] = useState(false);
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  const assessmentContainerRef = useRef(null);

  const disableTextResponses = !isTeacherLoggedIn && isAlreadySubmitted && submissionStatus !== STATUS_REATTEMPT;

  const rawHtmlContent = useMemo(() => {
    let html = courseData?.knowledgeAssessment?.html || '<p>No knowledge assessment content available.</p>';

    const dynamicInstituteName = rtoData?.instituteName || '[RTO_LEGAL_NAME]';
    const dynamicRtoId = rtoData?.rtoNumber || rtoNumber;
    const dynamicLogoHtml = rtoData?.logo
      ? `<img src="${rtoData.logo}" alt="RTO Logo" style="max-height: 40px; max-width: 100px; object-fit: contain;" />`
      : '[LOGO]';

    html = html
      .replace(/\[RTO_LEGAL_NAME\]/g, dynamicInstituteName)
      .replace(/\[RTO_ID\]/g, dynamicRtoId)
      .replace(/\[LOGO\]/g, dynamicLogoHtml);

    html = html.replace(
      /<div class="paper-text-response-box"[^>]*>([\s\S]*?)<\/div>/g,
      '<textarea class="student-answer-textarea" placeholder="Write your answer here..." ' + (disableTextResponses ? 'disabled' : '') + '></textarea>'
    );

    html = bindStudentDetailsIntoHtml(html, studentForm);
    html = reorganizeAssessmentHtml(html, userRole);

    return html;
  }, [courseData, rtoData, rtoNumber, disableTextResponses, studentForm, userRole]);

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

  useEffect(() => {
    const fetchExistingSubmission = async () => {
      if (!targetStudentId || !rtoNumber || !courseId) return;

      try {
        const response = await fetch(
          `${API_URL}/api/students/submission/${rtoNumber}/${courseId}/${targetStudentId}`
        );
        if (response.status === 404) {
          setExistingSubmission(null);
          setSubmissionStatus(STATUS_INITIAL);
          return;
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load submission status');

        const submission = data.submission;
        setExistingSubmission(submission);

        if (submission?.student) {
          setStudentForm((prev) => ({
            ...prev,
            studentName: submission.student.studentName || prev.studentName,
            studentId: submission.student.studentId || prev.studentId,
            studentEmail: submission.student.studentEmail || prev.studentEmail,
            date: submission.student.date || prev.date,
          }));
        }

        const rawStatus = submission?.status;
        const parsedStatus = [STATUS_INITIAL, STATUS_APPROVED, STATUS_REATTEMPT, STATUS_SUBMITTED].includes(Number(rawStatus))
          ? Number(rawStatus)
          : STATUS_INITIAL;

        setSubmissionStatus(parsedStatus);
      } catch (err) {
        console.error('Error checking existing submission:', err);
        setExistingSubmission(null);
        setSubmissionStatus(STATUS_INITIAL);
      }
    };

    if (step === 'assessment') {
      fetchExistingSubmission();
    }
  }, [step, rtoNumber, courseId, targetStudentId]);

  useEffect(() => {
    if (isTeacherLoggedIn) return;
    if (submissionStatus === STATUS_SUBMITTED || submissionStatus === STATUS_APPROVED) {
      setIsAlreadySubmitted(true);
    } else {
      setIsAlreadySubmitted(false);
    }
  }, [submissionStatus, isTeacherLoggedIn]);

  const populateSubmissionDataIntoDom = useCallback(() => {
    if (!assessmentContainerRef.current || !existingSubmission) return;

    const container = assessmentContainerRef.current;
    const allNodes = Array.from(container.querySelectorAll('.paper-question-node'));

    const questionNodes = allNodes.filter((node) => !isAssessorOnlyNode(node));
    const previousResponses = existingSubmission.responses || [];

    questionNodes.forEach((node, idx) => {
      const targetIndex = idx + 1;
      const prevResp = previousResponses.find((r) => r.questionIndex === targetIndex || r.questionIndex === idx) || previousResponses[idx];
      
      if (!prevResp) return;
      const studentSelection = prevResp.studentSelection;
      if (studentSelection === undefined || studentSelection === null || studentSelection === 'No answer provided') return;

      const textInput = node.querySelector('textarea, input[type="text"]');
      const checkableInputs = node.querySelectorAll('input[type="checkbox"], input[type="radio"]');

      if (textInput) {
        textInput.value = studentSelection;
      } else if (checkableInputs.length > 0) {
        const selectedValues = Array.isArray(studentSelection) ? studentSelection : [studentSelection];
        checkableInputs.forEach((input) => {
          const inputLabel = (input.value || input.nextElementSibling?.innerText || '').trim();
          if (selectedValues.some(val => String(val).trim() === inputLabel)) {
            input.checked = true;
          }
        });
      }
    });

    const assessorNodes = allNodes.filter((node) => isAssessorOnlyNode(node));
    const previousFeedback = existingSubmission.teacherFeedback || [];

    assessorNodes.forEach((node, idx) => {
      const targetIndex = idx + 1;
      const labelText = (node.querySelector('.paper-question-p')?.innerText || '').trim().toLowerCase().replace(/:$/, '');
      
      const prevEntry = previousFeedback.find((f) => f.assessorIndex === targetIndex || f.assessorIndex === idx || (f.label && labelText.includes(f.label.toLowerCase())));
      
      if (!prevEntry || prevEntry.value === undefined || prevEntry.value === null) return;

      const textInput = node.querySelector('textarea, input[type="text"]');
      const checkableInputs = node.querySelectorAll('input[type="checkbox"], input[type="radio"]');

      if (textInput) {
        textInput.value = prevEntry.value;
      } else if (checkableInputs.length > 0) {
        const selectedValues = Array.isArray(prevEntry.value) ? prevEntry.value : [prevEntry.value];
        checkableInputs.forEach((input) => {
          const inputLabel = (input.value || input.nextElementSibling?.innerText || '').trim();
          if (selectedValues.some(val => String(val).trim() === inputLabel)) {
            input.checked = true;
          }
        });
      }
    });
  }, [existingSubmission]);

  useEffect(() => {
    const timer = setTimeout(() => {
      populateSubmissionDataIntoDom();
    }, 50);
    return () => clearTimeout(timer);
  }, [rawHtmlContent, existingSubmission, populateSubmissionDataIntoDom]);

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

    setSubmitting(true);
    try {
      const initialPayload = {
        student: studentForm,
        rtoId: rtoNumber,
        courseId: courseId,
        responses: [],
        status: STATUS_INITIAL
      };

      const response = await fetch(`${API_URL}/api/students/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialPayload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to initialize submission');

      if (data.submission) {
        setExistingSubmission(data.submission);
        setSubmissionStatus(data.submission.status ?? STATUS_INITIAL);
      }

      const newUserObj = {
        ...storedUser,
        id: studentForm.studentId,
        name: studentForm.studentName,
        email: studentForm.studentEmail,
        role: 'student',
        rtoNumber: rtoNumber || storedUser.rtoNumber
      };
      localStorage.setItem('user', JSON.stringify(newUserObj));

      setStep('assessment');
    } catch (err) {
      alert('Error initializing assessment: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading Knowledge Assessment Portal...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  const collectTeacherFeedback = () => {
    if (!assessmentContainerRef.current) return [];

    const container = assessmentContainerRef.current;
    const assessorNodes = Array.from(container.querySelectorAll('.paper-question-node'))
      .filter((node) => isAssessorOnlyNode(node));

    const teacherFeedback = [];

    assessorNodes.forEach((node, idx) => {
      const assessorIndex = idx + 1;
      const label = (node.querySelector('.paper-question-p')?.innerText || '')
        .trim()
        .replace(/:$/, '');
      const normalizedLabel = /assessor result/i.test(label)
        ? 'Assessor result'
        : /overall outcome/i.test(label)
          ? 'Overall outcome'
          : 'Feedback';

      const textInput = node.querySelector('textarea, input[type="text"]');
      const checkedOptions = node.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked');

      let value = null;
      if (textInput) {
        value = textInput.value;
      } else if (checkedOptions.length > 0) {
        const values = Array.from(checkedOptions).map(opt => opt.value || opt.nextElementSibling?.innerText);
        value = checkedOptions.length === 1 && node.querySelector('input[type="radio"]') ? values[0] : values;
      }

      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) return;

      teacherFeedback.push({ assessorIndex, label: normalizedLabel, value });
    });

    return teacherFeedback;
  };

  const handleTeacherDecision = async (finalStatus) => {
    if (!existingSubmission?._id) {
      alert('No student submission found to attach feedback to.');
      return;
    }

    const teacherFeedback = collectTeacherFeedback();

    setSubmitting(true);
    try {
      const response = await fetch(
        `${API_URL}/api/students/submissions/${existingSubmission._id}/feedback`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teacherFeedback,
            status: finalStatus,
            reviewedBy: { teacherId: storedUser.id, teacherName: storedUser.name }
          })
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save feedback');

      setExistingSubmission(data.submission);
      if (data.submission?.status !== undefined) setSubmissionStatus(Number(data.submission.status));
      setFeedbackSaved(true);
    } catch (err) {
      alert('Error saving feedback: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAssessment = async () => {
    if (isAlreadySubmitted && submissionStatus !== STATUS_REATTEMPT) {
      alert('You cannot submit right now. Your assessment is either pending review or already approved.');
      navigate('/dashboard');
      return;
    }

    if (!assessmentContainerRef.current) return;

    const container = assessmentContainerRef.current;
    const questionNodes = Array.from(container.querySelectorAll('.paper-question-node'))
      .filter((node) => !isAssessorOnlyNode(node));

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
      responses,
      status: STATUS_SUBMITTED
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
              <input type="text" name="studentName" value={studentForm.studentName} required onChange={handleInputChange} placeholder="Enter your full name" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Student ID *</label>
              <input type="text" name="studentId" value={studentForm.studentId} required onChange={handleInputChange} placeholder="Enter your student ID" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Email Address *</label>
              <input type="email" name="studentEmail" value={studentForm.studentEmail} required onChange={handleInputChange} placeholder="student@example.com" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
            <button type="submit" className="btn-start-assessment" disabled={submitting} style={{ width: '100%', padding: '12px', background: '#6b213a', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Initializing...' : 'Continue to Assessment'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  let statusBanner = null;
  if (!isTeacherLoggedIn) {
    if (submissionStatus === STATUS_SUBMITTED) {
      statusBanner = <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>⏳ Assessment submitted successfully (Status 3: Pending Review).</div>;
    } else if (submissionStatus === STATUS_APPROVED) {
      statusBanner = <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>✅ Test passed (Status 1: Approved).</div>;
    } else if (submissionStatus === STATUS_REATTEMPT) {
      statusBanner = <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>🔁 Reattempt Required (Status 2). Update your answers below and resubmit.</div>;
    } else {
      statusBanner = <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>📝 Initial Draft (Status 0).</div>;
    }
  } else {
    if (submissionStatus === STATUS_APPROVED) {
      statusBanner = <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>✅ Status 1: Approved (Satisfactory)</div>;
    } else if (submissionStatus === STATUS_REATTEMPT) {
      statusBanner = <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>🔁 Status 2: Reattempt Requested</div>;
    } else if (submissionStatus === STATUS_SUBMITTED) {
      statusBanner = <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>⏳ Status 3: Submitted / Pending Your Verification</div>;
    } else {
      statusBanner = <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>📝 Status 0: Initial / In Progress</div>;
    }
  }

  return (
    <DashboardLayout>
      <style>{ASSESSMENT_CONTENT_STYLES}</style>
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
              <span>
                <strong>{isTeacherLoggedIn ? 'Grading:' : 'Candidate:'}</strong> {studentForm.studentName} ({studentForm.studentId})
              </span>
            </div>
          </header>

          <main className="portal-content-body">
            {statusBanner}

            {(!isTeacherLoggedIn || existingSubmission) && (
              <div
                ref={assessmentContainerRef}
                className={`assessment-html-container editable-assessment-view ${(!isTeacherLoggedIn && isAlreadySubmitted && submissionStatus !== STATUS_REATTEMPT) ? 'disabled-assessment-view' : ''}`}
                dangerouslySetInnerHTML={{ __html: rawHtmlContent }}
              />
            )}

            {!isTeacherLoggedIn && (
              <div className="assessment-footer-actions">
                <button
                  className="btn-submit-exam"
                  onClick={handleSubmitAssessment}
                  disabled={submitting || (isAlreadySubmitted && submissionStatus !== STATUS_REATTEMPT)}
                  style={{ opacity: (isAlreadySubmitted && submissionStatus !== STATUS_REATTEMPT) ? 0.6 : 1, cursor: (isAlreadySubmitted && submissionStatus !== STATUS_REATTEMPT) ? 'not-allowed' : 'pointer' }}
                >
                  {submitting
                    ? 'Submitting Responses...'
                    : submissionStatus === STATUS_REATTEMPT
                      ? 'Resubmit Assessment Responses'
                      : submissionStatus === STATUS_SUBMITTED
                        ? 'Pending Review'
                        : submissionStatus === STATUS_APPROVED
                          ? 'Already Approved'
                          : 'Submit Assessment Responses'}
                </button>
              </div>
            )}

            {isTeacherLoggedIn && existingSubmission && (
              <div className="assessment-footer-actions teacher-decision-actions">
                <button
                  className="btn-approve"
                  onClick={() => handleTeacherDecision(STATUS_APPROVED)}
                  disabled={submitting}
                  style={{ cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                  {submitting ? 'Saving...' : 'Approve'}
                </button>
                <button
                  className="btn-reattempt"
                  onClick={() => handleTeacherDecision(STATUS_REATTEMPT)}
                  disabled={submitting}
                  style={{ cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                  {submitting ? 'Saving...' : 'Request Reattempt'}
                </button>
                {feedbackSaved && <span className="feedback-saved-banner" style={{ marginLeft: '10px' }}>Saved ✓</span>}
              </div>
            )}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}