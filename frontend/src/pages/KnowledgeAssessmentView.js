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

// Formats a Date (or date-like value) as e.g. "12 September 2026"
const formatDisplayDate = (value) => {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Parses a data-correct-answer attribute value (e.g. '[1]', '1', '"" ') into
// an array of numeric option indices. Returns [] if there's no valid answer.
function parseCorrectAnswerIndices(rawAttr) {
  if (!rawAttr) return [];
  const trimmed = rawAttr.trim();
  if (trimmed === '' || trimmed === '""') return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.map((v) => parseInt(v, 10)).filter((n) => !isNaN(n));
    const num = parseInt(parsed, 10);
    return isNaN(num) ? [] : [num];
  } catch {
    const num = parseInt(trimmed, 10);
    return isNaN(num) ? [] : [num];
  }
}

// Maps a submission status number to a human-readable result label for the declaration table
function getResultLabel(status) {
  switch (status) {
    case STATUS_APPROVED: return 'Satisfactory';
    case STATUS_REATTEMPT: return 'Not Yet Satisfactory';
    case STATUS_SUBMITTED: return 'Pending Assessment';
    default: return '';
  }
}

// The stored HTML is a print-style, multi-page document: each page is a
// .word-a4-sheet div with fixed A4 width/height and page-break CSS, and every
// page after the first starts with a "<Title> — Page N (Continuation)" label.
// This flattens all pages into one continuous scrollable block for on-screen display.
function flattenPagedAssessmentHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const sheets = Array.from(doc.querySelectorAll('.word-a4-sheet'));
  if (sheets.length === 0) return html; // not a paged document — leave as-is

  const container = doc.createElement('div');
  container.className = 'flattened-assessment-pages';

  sheets.forEach((sheet, sheetIdx) => {
    // Remove the "<Title> — Page N (Continuation)" banner some pages start with
    Array.from(sheet.children).forEach((child) => {
      const text = child.textContent.trim();
      if (/—\s*Page\s*\d+(\s*\(Continuation\))?/i.test(text) && text.length < 80) {
        child.remove();
      }
    });

    // Only keep the masthead (logo/institute/title) on the first page
    if (sheetIdx > 0) {
      const masthead = sheet.querySelector('.word-masthead');
      if (masthead) masthead.remove();
    }

    sheet.removeAttribute('style');
    sheet.classList.remove('word-a4-sheet');
    sheet.classList.add('assessment-page-block');

    while (sheet.firstChild) {
      container.appendChild(sheet.firstChild);
    }
  });

  return container.innerHTML;
}

// Plain text-field bindings (name, ID, date, assessor name, attempt, result)
function bindStudentDetailsIntoHtml(html, values) {
  const labelToValue = {
    'student name': values.studentName,
    'full name': values.studentName,
    'candidate name': values.studentName,
    'student id': values.studentId,
    'date of assessment': values.date,
    'assessor name': values.assessorName,
    'attempt': values.attemptNumber,
    'result': values.resultLabel,
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

// Builds a complete "Student declaration" section — heading, declaration text,
// and Student/Assessor signature+date tables with real drawable canvases —
// and appends it to the end of the assessment HTML (after the Assessor
// Feedback section, which reorganizeAssessmentHtml builds and appends earlier
// in the pipeline). The source template has no such section at all, so this
// constructs it entirely rather than trying to match/patch markup that
// doesn't exist.
function appendSignatureDeclarationSection(html, { studentDateText, assessorDateText, isTeacherLoggedIn, disableStudentSignature }) {
  const declarationHtml = `
    <div class="signature-declaration-section">
      <h3 class="doc-h3" style="font-size:11pt; margin:0 0 0.2rem 0; color:#0f172a; border-bottom:1px solid #cbd5e1; padding-bottom:0.15rem;">Student declaration</h3>
      <p class="doc-description" style="margin:0 0 0.5rem 0; font-size:9.5pt; line-height:1.4;">I declare that the answers in this assessment are my own work, that I have not received assistance from any other person, and that I have not used unauthorised materials. I understand that the RTO may take action under its academic misconduct policy if this declaration is found to be false.</p>

      <strong style="display:block; margin-bottom:0.3rem; font-size:9.5pt;">Student</strong>
      <table class="doc-word-table" style="width:100%; border-collapse:collapse; font-size:8.5pt; margin-bottom:1rem;">
        <thead>
          <tr>
            <th style="border:1px solid #94a3b8; padding:0.3rem 0.4rem; text-align:left; background:#f8fafc;">Student signature</th>
            <th style="border:1px solid #94a3b8; padding:0.3rem 0.4rem; text-align:left; background:#f8fafc;">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border:1px solid #94a3b8; padding:0.3rem 0.4rem; text-align:left;">
              <div class="signature-pad-wrapper${disableStudentSignature ? ' signature-pad-disabled' : ''}">
                <canvas class="student-signature-canvas" width="320" height="90"></canvas>
                ${!disableStudentSignature ? '<button type="button" class="signature-clear-btn" data-target="student">Clear</button>' : ''}
              </div>
            </td>
            <td style="border:1px solid #94a3b8; padding:0.3rem 0.4rem; text-align:left;" class="student-signature-date-cell">${escHtml(studentDateText)}</td>
          </tr>
        </tbody>
      </table>

      <h3 class="doc-h3" style="font-size:11pt; margin:0 0 0.2rem 0; color:#0f172a; border-bottom:1px solid #cbd5e1; padding-bottom:0.15rem;">Assessor use — outcome</h3>
      <strong style="display:block; margin:0.5rem 0 0.3rem 0; font-size:9.5pt;">Assessor</strong>
      <table class="doc-word-table" style="width:100%; border-collapse:collapse; font-size:8.5pt;">
        <thead>
          <tr>
            <th style="border:1px solid #94a3b8; padding:0.3rem 0.4rem; text-align:left; background:#f8fafc;">Assessor Signature</th>
            <th style="border:1px solid #94a3b8; padding:0.3rem 0.4rem; text-align:left; background:#f8fafc;">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border:1px solid #94a3b8; padding:0.3rem 0.4rem; text-align:left;">
              <div class="signature-pad-wrapper${!isTeacherLoggedIn ? ' signature-pad-disabled' : ''}">
                <canvas class="assessor-signature-canvas" width="320" height="90"></canvas>
                ${isTeacherLoggedIn ? '<button type="button" class="signature-clear-btn" data-target="assessor">Clear</button>' : ''}
              </div>
            </td>
            <td style="border:1px solid #94a3b8; padding:0.3rem 0.4rem; text-align:left;" class="assessor-signature-date-cell">${escHtml(assessorDateText)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  return html + declarationHtml;
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
      //  answerEl.className = 'correct-answer-display';
        // answerEl.innerHTML = `<strong>Correct answer:</strong> ${escHtml(correctAnswer)}`;
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

// ===== Signature canvas drawing logic (vanilla DOM, attached after render) =====

function setupSignatureCanvas(canvas, existingImageUrl, disabled) {
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#1e293b';

  if (existingImageUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // required to paint a Cloudinary (cross-origin) image onto canvas
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.dataset.hasSignature = 'true';
    };
    img.onerror = () => {
      console.error('Failed to load existing signature image:', existingImageUrl);
    };
    img.src = existingImageUrl;
  }

  if (disabled) return () => {};

  let drawing = false;
  let last = null;

  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const start = (e) => {
    e.preventDefault();
    drawing = true;
    last = getPos(e);
  };
  const move = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    last = pos;
    canvas.dataset.hasSignature = 'true';
  };
  const end = () => {
    drawing = false;
    last = null;
  };

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);
  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end);

  return () => {
    canvas.removeEventListener('mousedown', start);
    canvas.removeEventListener('mousemove', move);
    window.removeEventListener('mouseup', end);
    canvas.removeEventListener('touchstart', start);
    canvas.removeEventListener('touchmove', move);
    canvas.removeEventListener('touchend', end);
  };
}

function readSignatureDataUrl(container, selector) {
  const canvas = container?.querySelector(selector);
  if (!canvas || canvas.dataset.hasSignature !== 'true') return '';
  return canvas.toDataURL('image/png');
}

const ASSESSMENT_CONTENT_STYLES = `
  /* ===== Base container ===== */
  .assessment-html-container {
    max-width: 100%;
    line-height: 1.55;
    color: #1e293b;
  }
  .assessment-html-container p,
  .assessment-html-container h3,
  .assessment-html-container h4 { margin: 0 0 6px 0; }
  .assessment-html-container > * + * { margin-top: 14px; }
  .assessment-html-container hr { margin: 10px 0; opacity: 0.35; border: none; border-top: 1px solid #cbd5e1; }
  .assessment-html-container h2,
  .assessment-html-container h3,
  .assessment-html-container h4 { margin-top: 20px; margin-bottom: 8px; }

  /* Flattened page sections (was: separate .word-a4-sheet print pages) */
  .assessment-html-container .assessment-page-block {
    display: block;
  }
  .assessment-html-container .assessment-page-block + .assessment-page-block {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px dashed #cbd5e1;
  }

  /* ===== Question / block nodes ===== */
  .assessment-html-container .paper-question-node {
    display: block;
    padding: 10px 0;
  }
  .assessment-html-container .paper-question-p {
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 8px;
    display: block;
  }

  /* ===== Text response inputs ===== */
  .assessment-html-container textarea,
  .assessment-html-container input[type="text"],
  .assessment-html-container input[type="email"],
  .assessment-html-container input[type="date"] {
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin-top: 4px;
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    font-family: inherit;
    font-size: 0.9rem;
    color: #1e293b;
    background: #fff;
  }
  .assessment-html-container textarea {
    min-height: 80px;
    resize: vertical;
  }
  .assessment-html-container textarea:focus,
  .assessment-html-container input[type="text"]:focus {
    outline: none;
    border-color: #6b213a;
    box-shadow: 0 0 0 2px rgba(107, 33, 58, 0.12);
  }

  /* ===== Radio / checkbox option rows ===== */
  .assessment-html-container input[type="radio"],
  .assessment-html-container input[type="checkbox"] {
    margin: 0 6px 0 0;
    vertical-align: middle;
    flex-shrink: 0;
  }
  .assessment-html-container label {
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 4px 0;
    font-size: 0.9rem;
    color: #334155;
    cursor: pointer;
  }
  .assessment-html-container .paper-question-node > div:has(input[type="radio"]),
  .assessment-html-container .paper-question-node > div:has(input[type="checkbox"]) {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 4px;
  }

  /* ===== Answer highlighting (teacher view) ===== */
  .assessment-html-container .paper-option-choice.opt-correct {
    border: 1px solid #22c55e;
    background: #ecfdf5;
    border-radius: 4px;
    padding: 4px 8px;
  }
  .assessment-html-container .paper-option-choice.opt-incorrect-selected {
    border: 1px solid #ef4444;
    background: #fef2f2;
    border-radius: 4px;
    padding: 4px 8px;
  }
  .assessment-html-container .student-response-badge {
    font-size: 8pt; font-weight: 600; color: #475569;
    background: #f1f5f9; border: 1px solid #cbd5e1;
    padding: 1px 6px; border-radius: 4px;
    text-transform: uppercase; letter-spacing: 0.02em;
    float: right;
  }
  .assessment-html-container .no-answer-note {
    margin-top: 6px;
    font-size: 8.5pt;
    font-weight: 600;
    color: #92400e;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 4px;
    padding: 3px 8px;
    display: inline-block;
  }

  /* ===== Tables ===== */
  .assessment-html-container table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    table-layout: fixed;
  }
  .assessment-html-container table td,
  .assessment-html-container table th {
    border: 1px solid #94a3b8;
    padding: 0.45rem 0.6rem;
    text-align: left;
    vertical-align: middle;
    word-break: break-word;
    font-size: 0.88rem;
  }
  .assessment-html-container table th {
    background: #f1f5f9;
    font-weight: 700;
    color: #0f172a;
  }
  .assessment-html-container table input[type="text"] {
    margin-top: 0;
    border: none;
    border-radius: 0;
    padding: 2px 4px;
    background: transparent;
    width: 100%;
  }
  .assessment-html-container table input[type="text"]:focus {
    box-shadow: none;
    background: #f8fafc;
  }
  .assessment-html-container table input[type="text"]:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }

  /* ===== Signature pad (declaration section) ===== */
  .assessment-html-container .signature-declaration-section {
    margin-top: 24px;
  }
  .assessment-html-container .signature-pad-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .assessment-html-container .student-signature-canvas,
  .assessment-html-container .assessor-signature-canvas {
    width: 100%;
    max-width: 320px;
    height: 90px;
    background: #fff;
    border: 1px dashed #cbd5e1;
    border-radius: 4px;
    cursor: crosshair;
    touch-action: none;
  }
  .assessment-html-container .signature-pad-disabled .student-signature-canvas,
  .assessment-html-container .signature-pad-disabled .assessor-signature-canvas {
    background: #f8fafc;
    cursor: not-allowed;
    border-style: solid;
  }
  .assessment-html-container .signature-clear-btn {
    padding: 4px 12px;
    font-size: 0.78rem;
    font-weight: 600;
    color: #6b213a;
    background: #fff;
    border: 1px solid #6b213a;
    border-radius: 4px;
    cursor: pointer;
    width: auto;
  }
  .assessment-html-container .signature-clear-btn:hover {
    background: #6b213a;
    color: #fff;
  }

  /* ===== Locked / disabled state ===== */
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
    padding: 10px 0.5rem;
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

  /* ===== Assessor feedback section ===== */
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

  /* ===== Responsive: stack tables on narrow screens ===== */
  @media (max-width: 640px) {
    .assessment-html-container table,
    .assessment-html-container tbody,
    .assessment-html-container tr,
    .assessment-html-container td {
      display: block;
      width: 100%;
    }
    .assessment-html-container table td {
      border-top: none;
    }
    .assessment-html-container table tr {
      border: 1px solid #94a3b8;
      margin-bottom: 6px;
      border-radius: 4px;
      overflow: hidden;
    }
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
  const signatureCleanupRef = useRef([]);

  const disableTextResponses = !isTeacherLoggedIn && isAlreadySubmitted && submissionStatus !== STATUS_REATTEMPT;

  // Dynamic declaration-table values
  const attemptNumber = existingSubmission?.attemptNumber
    || (submissionStatus === STATUS_REATTEMPT || submissionStatus === STATUS_SUBMITTED || submissionStatus === STATUS_APPROVED ? 1 : '');
  const resultLabel = getResultLabel(submissionStatus);
  const assessorNameValue = isTeacherLoggedIn
    ? (storedUser.name || '')
    : (existingSubmission?.reviewedBy?.teacherName || '');

  // Real signed dates come from the backend (server-stamped), not "today" —
  // only show a date once that side has actually signed.
  const studentDateText = formatDisplayDate(existingSubmission?.studentSignedDate);
  const assessorDateText = formatDisplayDate(existingSubmission?.assessorSignedDate);

  const rawHtmlContent = useMemo(() => {
    let html = courseData?.knowledgeAssessment?.html || '<p>No knowledge assessment content available.</p>';

    html = flattenPagedAssessmentHtml(html);

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

    html = bindStudentDetailsIntoHtml(html, {
      ...studentForm,
      assessorName: assessorNameValue,
      attemptNumber,
      resultLabel,
    });

    // reorganizeAssessmentHtml builds and appends the "Assessor Feedback"
    // section first — the declaration section is appended AFTER this call,
    // so it always renders below Assessor Feedback in the final output.
    html = reorganizeAssessmentHtml(html, userRole);

    html = appendSignatureDeclarationSection(html, {
      studentDateText,
      assessorDateText,
      isTeacherLoggedIn,
      disableStudentSignature: disableTextResponses,
    });

    return html;
  }, [courseData, rtoData, rtoNumber, disableTextResponses, studentForm, userRole, assessorNameValue, attemptNumber, resultLabel, isTeacherLoggedIn, studentDateText, assessorDateText]);

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

  // Populates the student's previously-submitted answers into the rendered
  // question inputs, and — for teachers only — highlights each option:
  // green border on the correct option (always shown), red border on any
  // option the student actually selected that was wrong, and a
  // "Did not select an option" note when the student left it blank.
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
      const hasAnswer = !(studentSelection === undefined || studentSelection === null || studentSelection === 'No answer provided');

      const textInput = node.querySelector('textarea, input[type="text"]');
      const checkableInputs = node.querySelectorAll('input[type="checkbox"], input[type="radio"]');

      const selectedValues = hasAnswer
        ? (Array.isArray(studentSelection) ? studentSelection : [studentSelection]).map((v) => String(v).trim())
        : [];

      if (textInput && hasAnswer) {
        textInput.value = studentSelection;
      } else if (checkableInputs.length > 0) {
        checkableInputs.forEach((input) => {
          const inputLabel = (input.value || input.nextElementSibling?.innerText || '').trim();
          if (selectedValues.includes(inputLabel)) {
            input.checked = true;
          }
        });

        // Teacher-only answer highlighting
        if (isTeacherLoggedIn) {
          const correctIndices = parseCorrectAnswerIndices(node.getAttribute('data-correct-answer'));

          checkableInputs.forEach((input) => {
            const optionChoice = input.closest('.paper-option-choice');
            if (!optionChoice) return;

            const optionIndex = parseInt(input.value, 10);
            const isCorrectOption = !isNaN(optionIndex) && correctIndices.includes(optionIndex);
            const isSelectedByStudent = hasAnswer && input.checked;

            if (isCorrectOption) {
              optionChoice.classList.add('opt-correct');
            }
            if (isSelectedByStudent && !isCorrectOption) {
              optionChoice.classList.add('opt-incorrect-selected');
            }
          });

          if (!hasAnswer) {
            const optionsList = node.querySelector('.paper-options-list');
            if (optionsList && !node.querySelector('.no-answer-note')) {
              const noteEl = document.createElement('div');
              noteEl.className = 'no-answer-note';
              noteEl.textContent = 'Did not select an option';
              optionsList.insertAdjacentElement('afterend', noteEl);
            }
          }
        }
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
  }, [existingSubmission, isTeacherLoggedIn]);

  const setupSignaturePads = useCallback(() => {
    const container = assessmentContainerRef.current;
    if (!container) return;

    signatureCleanupRef.current.forEach((cleanup) => cleanup && cleanup());
    signatureCleanupRef.current = [];

    const studentCanvas = container.querySelector('.student-signature-canvas');
    if (studentCanvas) {
      const cleanup = setupSignatureCanvas(
        studentCanvas,
        existingSubmission?.studentSignature || '',
        disableTextResponses
      );
      signatureCleanupRef.current.push(cleanup);
    }

    const assessorCanvas = container.querySelector('.assessor-signature-canvas');
    if (assessorCanvas) {
      const cleanup = setupSignatureCanvas(
        assessorCanvas,
        existingSubmission?.assessorSignature || '',
        !isTeacherLoggedIn
      );
      signatureCleanupRef.current.push(cleanup);
    }

    container.querySelectorAll('.signature-clear-btn').forEach((btn) => {
      const handler = () => {
        const target = btn.getAttribute('data-target');
        const canvas = container.querySelector(`.${target}-signature-canvas`);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.dataset.hasSignature = 'false';
      };
      btn.addEventListener('click', handler);
      signatureCleanupRef.current.push(() => btn.removeEventListener('click', handler));
    });
  }, [existingSubmission, disableTextResponses, isTeacherLoggedIn]);

  useEffect(() => {
    const timer = setTimeout(() => {
      populateSubmissionDataIntoDom();
      setupSignaturePads();
    }, 50);
    return () => {
      clearTimeout(timer);
      signatureCleanupRef.current.forEach((cleanup) => cleanup && cleanup());
      signatureCleanupRef.current = [];
    };
  }, [rawHtmlContent, existingSubmission, populateSubmissionDataIntoDom, setupSignaturePads]);

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
    const assessorSignature = readSignatureDataUrl(assessmentContainerRef.current, '.assessor-signature-canvas');

    if (!assessorSignature) {
      alert('Please sketch your signature in the Assessor Signature box before submitting your decision.');
      return;
    }

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
            assessorSignature, // base64 PNG — backend uploads to Cloudinary and stores the URL
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

    const studentSignature = readSignatureDataUrl(assessmentContainerRef.current, '.student-signature-canvas');

    if (!studentSignature) {
      alert('Please sketch your signature in the Student Signature box to declare and confirm your submission.');
      return;
    }

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
      status: STATUS_SUBMITTED,
      studentSignature, // base64 PNG — backend uploads to Cloudinary and stores the URL + server-stamped date
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
      statusBanner = <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>✅ Test passed .</div>;
    } else if (submissionStatus === STATUS_REATTEMPT) {
      statusBanner = <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>🔁 Reattempt Required. Update your answers below and resubmit.</div>;
    } else {
      statusBanner = <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}></div>;
    }
  } else {
    if (submissionStatus === STATUS_APPROVED) {
      statusBanner = <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>✅ Approved (Satisfactory)</div>;
    } else if (submissionStatus === STATUS_REATTEMPT) {
      statusBanner = <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>🔁 Reattempt Requested</div>;
    } else if (submissionStatus === STATUS_SUBMITTED) {
      statusBanner = <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>⏳ Submitted / Pending Your Verification</div>;
    } else {
      statusBanner = <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>📝 Initial / In Progress</div>;
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