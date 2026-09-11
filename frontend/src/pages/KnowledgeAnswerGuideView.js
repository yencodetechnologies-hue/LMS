import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../data/service';
import '../styles/knowledgeAnswerview.css';

export default function KnowledgeAnswerGuideView() {
  const { rtoNumber, courseId } = useParams();
  
  const queryParams = new URLSearchParams(window.location.search);
  const studentIdParam = queryParams.get('studentId');

  const [loading, setLoading] = useState(true);
  const [rtoData, setRtoData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnswerGuideAndSubmission = async () => {
      try {
        const rtoRes = await fetch(`${API_URL}/api/jobpack/${rtoNumber}/${courseId}`);
        const rtoResult = await rtoRes.json();
        if (!rtoRes.ok) throw new Error(rtoResult.message || 'Failed to load RTO data');

        setRtoData(rtoResult.order);
        setCourseData(rtoResult.course);

        const subUrl = studentIdParam 
          ? `${API_URL}/api/students/submission/${rtoNumber}/${courseId}/${studentIdParam}`
          : `${API_URL}/api/students/submission/${rtoNumber}/${courseId}`;
          
        const subRes = await fetch(subUrl);
        if (subRes.ok) {
          const subResult = await subRes.json();
          setSubmissionData(subResult.submission);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswerGuideAndSubmission();
  }, [rtoNumber, courseId, studentIdParam]);

  if (loading) return <div className="dashboard-loading">Loading Answer Guide & Evaluation...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  const dynamicInstituteName = rtoData?.instituteName || '[RTO_LEGAL_NAME]';
  const dynamicRtoId = rtoData?.rtoNumber || rtoNumber;
  const canvasBlocks = courseData?.knowledgeAssessment?.canvasBlocks || [];
  const responses = submissionData?.responses || [];

  return (
    <div className="ans-guide-sec">
      <div className="answer-guide-action-bar no-print" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <button className="btn-primary" onClick={() => window.print()} style={{ padding: '0.6rem 1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>
          Print / Save Answer Guide as PDF
        </button>
      </div>

      <div className="a4-document-sheet">
        <div className="doc-running-header">
          {courseData?.title || 'Course Assessment'} — Answer & Evaluation Guide
        </div>

        <div className="doc-masthead-banner">
          <div className="doc-banner-logo">
            {rtoData?.logo ? (
              <img src={rtoData.logo} alt="RTO Logo" style={{ maxHeight: '45px', maxWidth: '90px', objectFit: 'contain' }} />
            ) : (
              <span>[LOGO]</span>
            )}
          </div>
          <div className="doc-banner-content">
            <p className="doc-banner-subtitle">{dynamicInstituteName} (RTO ID: {dynamicRtoId})</p>
            <h1 className="doc-banner-heading">Knowledge Assessment — Answer & Evaluation Guide</h1>
          </div>
        </div>

        <h2 className="doc-unit-title-row">{courseData?.title || 'Course Assessment'} — Assessor Review Panel</h2>

        {submissionData && (
          <table className="doc-control-table">
            <tbody>
              <tr>
                <th colSpan="2" style={{ background: 'var(--ag-tint-th)' }}>Candidate Submission Record</th>
              </tr>
              <tr>
                <td style={{ width: '50%' }}><strong>Name:</strong> {submissionData.student.studentName}</td>
                <td style={{ width: '50%' }}><strong>Student ID:</strong> {submissionData.student.studentId}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong> {submissionData.student.studentEmail}</td>
                <td><strong>Submitted Date:</strong> {new Date(submissionData.submittedAt).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        )}

        <div className="doc-section-content">
          {responses.length === 0 ? (
            <p>No student responses found for this course and RTO.</p>
          ) : (
            responses.map((resp, idx) => {
              const matchedBlock = canvasBlocks.find(b => b.text === resp.questionText) || canvasBlocks[idx];
              const options = matchedBlock?.options || [];
              const correctKey = matchedBlock?.correctAnswer ?? resp.correctAnswer;

              return (
                <div key={idx} className="qa-benchmark-block">
                  <p className="qa-prompt-title">
                    {resp.questionIndex || idx + 1}. {resp.questionText}
                  </p>
                  
                  {matchedBlock?.knowledgeEvidence && (
                    <p className="qa-meta-ke">
                      Knowledge evidence: {matchedBlock.knowledgeEvidence}
                    </p>
                  )}

                  {options.length > 0 ? (
                    <table className="doc-grid-table doc-standard-table">
                      <thead>
                        <tr>
                          <th style={{ width: '8%' }}>Option</th>
                          <th style={{ width: '38%' }}>Option Text / Candidate Choice</th>
                          <th style={{ width: '15%' }}>Verdict</th>
                          <th style={{ width: '39%' }}>Note / Assessor Feedback</th>
                        </tr>
                      </thead>
                      <tbody>
                        {options.map((opt, optIdx) => {
                          const letter = String.fromCharCode(65 + optIdx);
                          const isCorrectOption = matchedBlock?.qType === 'single'
                            ? Number(correctKey) === optIdx
                            : (Array.isArray(correctKey) ? correctKey.map(Number).includes(optIdx) : false);

                          const isStudentSelected = Array.isArray(resp.studentSelection)
                            ? resp.studentSelection.includes(opt) || resp.studentSelection.includes(optIdx)
                            : resp.studentSelection === opt || Number(resp.studentSelection) === optIdx;

                          return (
                            <tr key={optIdx} style={{ background: isStudentSelected ? (isCorrectOption ? '#f0fdf4' : '#fef2f2') : 'transparent' }}>
                              <td className="text-center font-bold">{letter}</td>
                              <td>
                                {opt}
                                {isStudentSelected && (
                                  <div style={{ marginTop: '4px', fontSize: '8pt', fontWeight: '600', color: isCorrectOption ? 'var(--ag-pass-green)' : 'var(--ag-fail-red)' }}>
                                    ✓ Selected by candidate
                                  </div>
                                )}
                              </td>
                              <td>
                                {isCorrectOption ? (
                                  <span className="verdict-correct">CORRECT</span>
                                ) : (
                                  <span className="verdict-incorrect">Incorrect</span>
                                )}
                              </td>
                              <td>
                                {matchedBlock?.notes?.[optIdx] || (isCorrectOption ? 'Meets the benchmark requirement.' : 'Does not meet the correct criteria for this unit.')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="sa-benchmark-card">
                      <div className="sa-card-header">
                        <h4>Candidate Written Answer & Benchmark Assessment</h4>
                      </div>
                      <div className="sa-card-body">
                        <div className="sa-card-subtitle">Candidate Response:</div>
                        <p className="sa-model-text">{resp.studentSelection}</p>
                        <div className="sa-card-subtitle">Model Answer / Benchmark Guide:</div>
                        <p className="sa-model-text" style={{ color: 'var(--ag-pass-green)', fontStyle: 'italic' }}>
                          {matchedBlock?.sampleAnswer || resp.correctAnswer || 'Assessor review required.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}