// src/pages/JobPackView.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../data/service';
import '../styles/jobPack.css';

export default function JobPackView() {
  const { rtoNumber, courseId } = useParams();
  
  const [step, setStep] = useState('form'); // 'form' or 'preview'
  const [loading, setLoading] = useState(true);
  const [rtoData, setRtoData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState('');

  // Student / Technician details form inputs only
  const [studentForm, setStudentForm] = useState({
    studentName: '',
    studentId: '',
    studentEmail: '',
    jobOrderNumber: '',
    siteAddress: '',
    date: new Date().toISOString().split('T')[0],
    testPurpose: ''
  });

  useEffect(() => {
    const fetchJobPackDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/jobpack/${rtoNumber}/${courseId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load job pack details');

        setRtoData(data.order);
        setCourseData(data.course);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPackDetails();
  }, [rtoNumber, courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setStep('preview');
  };

  if (loading) return <div className="dashboard-loading">Loading Job Pack portal...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  return (
    <div className="job-pack-container">
      {step === 'form' ? (
        <div className="job-pack-form-card">
          <div className="form-header-banner">
            <h2>Student Job Pack Registration</h2>
            <p>RTO Institute: <strong>{rtoData?.instituteName || 'N/A'}</strong> (RTO ID: <strong>{rtoNumber}</strong>)</p>
          </div>

          <form onSubmit={handleFormSubmit} className="job-input-form">
            <h3>Student Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Student Name *</label>
                <input 
                  type="text" 
                  name="studentName" 
                  required 
                  value={studentForm.studentName} 
                  onChange={handleInputChange} 
                  placeholder="Enter full name" 
                />
              </div>

              <div className="form-group">
                <label>Student ID *</label>
                <input 
                  type="text" 
                  name="studentId" 
                  required 
                  value={studentForm.studentId} 
                  onChange={handleInputChange} 
                  placeholder="Enter student ID" 
                />
              </div>

              <div className="form-group full-width">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="studentEmail" 
                  required 
                  value={studentForm.studentEmail} 
                  onChange={handleInputChange} 
                  placeholder="student@example.com" 
                />
              </div>

              <div className="form-group">
                <label>Job / Work Order Number *</label>
                <input 
                  type="text" 
                  name="jobOrderNumber" 
                  required 
                  value={studentForm.jobOrderNumber} 
                  onChange={handleInputChange} 
                  placeholder="e.g. WO-99420" 
                />
              </div>

              <div className="form-group">
                <label>Site Address *</label>
                <input 
                  type="text" 
                  name="siteAddress" 
                  required 
                  value={studentForm.siteAddress} 
                  onChange={handleInputChange} 
                  placeholder="Enter site location" 
                />
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input 
                  type="date" 
                  name="date" 
                  required 
                  value={studentForm.date} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="form-group">
                <label>Test Purpose *</label>
                <input 
                  type="text" 
                  name="testPurpose" 
                  required 
                  value={studentForm.testPurpose} 
                  onChange={handleInputChange} 
                  placeholder="e.g. New install acceptance test" 
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-generate-doc">Generate HTML Document Layout</button>
            </div>
          </form>
        </div>
      ) : (
        /* Full HTML PDF-Ready Layout Styled Like a Website */
        <div className="job-pack-document-preview">
          <div className="doc-action-bar no-print">
            <button className="btn-secondary" onClick={() => setStep('form')}>← Edit Student Details</button>
            <button className="btn-primary" onClick={() => window.print()}>Print / Save as PDF</button>
          </div>

          <div className="official-document-sheet">
            {/* Header with dynamic RTO logo and RTO Number */}
            <div className="doc-header-table">
              <div className="doc-logo-cell">
                {rtoData?.logo ? (
                  <img src={rtoData.logo} alt="RTO Logo" className="rto-document-logo" />
                ) : (
                  <div className="doc-logo-placeholder">[LOGO]</div>
                )}
              </div>
              <div className="doc-org-cell">
                <h2>{rtoData?.instituteName || '[RTO_LEGAL_NAME]'}</h2>
                <p>RTO ID: <strong>{rtoData?.rtoNumber || rtoNumber}</strong>[cite: 1, 2, 3]</p>
              </div>
            </div>

            <div className="doc-title-box">
              <h1>Job Pack Template</h1>
              <p className="doc-subtitle">{courseData?.title || 'ICTBWN307 Use optical measuring instruments'} — issued to the student at the start of AT-ICTBWN307-02[cite: 1, 2, 3]</p>
            </div>

            <table className="doc-meta-grid">
              <tbody>
                <tr>
                  <td><strong>Document ID</strong></td>
                  <td>JP-ICTBWN307-01[cite: 1, 2, 3]</td>
                  <td><strong>Version</strong></td>
                  <td>1.0[cite: 1, 2, 3]</td>
                </tr>
                <tr>
                  <td><strong>Document owner</strong></td>
                  <td>Compliance Manager[cite: 1, 2, 3]</td>
                  <td><strong>Status</strong></td>
                  <td>APPROVED FOR ISSUE</td>
                </tr>
                <tr>
                  <td><strong>Training product</strong></td>
                  <td>{courseData?.title || 'ICTBWN307 (Release 1)'}[cite: 1, 2, 3]</td>
                  <td><strong>Date of issue</strong></td>
                  <td>{studentForm.date}</td>
                </tr>
              </tbody>
            </table>

            <div className="doc-section-content">
              <h3>Purpose</h3>
              <p>This job pack is prepared by the assessor and issued to the candidate at the start of AT-ICTBWN307-02. It is the specification every pass/fail determination in the practical assessment is judged against[cite: 1, 2, 3].</p>

              <h3>1. Job Details & Candidate Profile</h3>
              <table className="doc-data-table">
                <tbody>
                  <tr><td><strong>Candidate / Technician Name</strong></td><td>{studentForm.studentName}</td></tr>
                  <tr><td><strong>Student ID</strong></td><td>{studentForm.studentId}</td></tr>
                  <tr><td><strong>Email Address</strong></td><td>{studentForm.studentEmail}</td></tr>
                  <tr><td><strong>Job / work order number</strong></td><td>{studentForm.jobOrderNumber}</td></tr>
                  <tr><td><strong>Site address</strong></td><td>{studentForm.siteAddress}</td></tr>
                  <tr><td><strong>Date</strong></td><td>{studentForm.date}</td></tr>
                  <tr><td><strong>Test purpose</strong></td><td>{studentForm.testPurpose}</td></tr>
                </tbody>
              </table>

              <h3>2. Measurement Types Required for This Job</h3>
              <ul className="doc-checklist">
                <li>☐ Absolute optical power (dBm)[cite: 1, 2, 3]</li>
                <li>☐ Insertion loss (dB)[cite: 1, 2, 3]</li>
                <li>☐ Live traffic / ONT presence detection[cite: 1, 2, 3]</li>
                <li>☐ Relative optical power on a live PON (dB)[cite: 1, 2, 3]</li>
              </ul>

              <h3>3. Link Design Loss Budget</h3>
              <table className="doc-data-table">
                <tbody>
                  <tr><td><strong>Link identifier / fibre reference</strong></td><td>-</td></tr>
                  <tr><td><strong>Design loss budget (dB)</strong></td><td>-</td></tr>
                  <tr><td><strong>Number of splices in path</strong></td><td>-</td></tr>
                  <tr><td><strong>Number of connectors in path</strong></td><td>-</td></tr>
                  <tr><td><strong>Fibre length (km)</strong></td><td>-</td></tr>
                </tbody>
              </table>

              <h3>4. Acceptance Limits per Wavelength</h3>
              <table className="doc-standard-table">
                <thead>
                  <tr>
                    <th>Wavelength</th>
                    <th>Measurement</th>
                    <th>Acceptance limit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1310 nm[cite: 1, 2, 3]</td>
                    <td>Insertion loss (dB)[cite: 1, 2, 3]</td>
                    <td>As stated in the link design loss budget above.[cite: 1, 2, 3]</td>
                  </tr>
                  <tr>
                    <td>1490 nm[cite: 1, 2, 3]</td>
                    <td>Downstream data power (dBm)[cite: 1, 2, 3]</td>
                    <td>As specified for the PON class in use (e.g. GPON class B+/C+).[cite: 1, 2, 3]</td>
                  </tr>
                  <tr>
                    <td>1550 nm[cite: 1, 2, 3]</td>
                    <td>Downstream video / overlay power (dBm)[cite: 1, 2, 3]</td>
                    <td>As specified for the overlay service in use.[cite: 1, 2, 3]</td>
                  </tr>
                  <tr>
                    <td>1625/1650 nm[cite: 1, 2, 3]</td>
                    <td>In-service maintenance test wavelength[cite: 1, 2, 3]</td>
                    <td>No separate acceptance limit.[cite: 1, 2, 3]</td>
                  </tr>
                </tbody>
              </table>

              <h3>5. Calibration Record for Instruments Issued</h3>
              <table className="doc-standard-table">
                <thead>
                  <tr>
                    <th>Instrument</th>
                    <th>Serial number</th>
                    <th>Calibration due date</th>
                    <th>Checked current</th>
                    <th>Issued by</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Hand-held optical power meter[cite: 1, 2, 3]</td><td>-</td><td>-</td><td>[ ] Y [ ] N[cite: 1, 2, 3]</td><td>-</td></tr>
                  <tr><td>Hand-held optical source[cite: 1, 2, 3]</td><td>-</td><td>-</td><td>[ ] Y [ ] N[cite: 1, 2, 3]</td><td>-</td></tr>
                  <tr><td>Hand-held optical fibre identifier (OFI-FTTx)[cite: 1, 2, 3]</td><td>-</td><td>-</td><td>[ ] Y [ ] N[cite: 1, 2, 3]</td><td>-</td></tr>
                  <tr><td>Active ONT detector[cite: 1, 2, 3]</td><td>-</td><td>-</td><td>[ ] Y [ ] N[cite: 1, 2, 3]</td><td>-</td></tr>
                  <tr><td>Optical loss test set (OLTS)[cite: 1, 2, 3]</td><td>-</td><td>-</td><td>[ ] Y [ ] N[cite: 1, 2, 3]</td><td>-</td></tr>
                  <tr><td>PON meter[cite: 1, 2, 3]</td><td>-</td><td>-</td><td>[ ] Y [ ] N[cite: 1, 2, 3]</td><td>-</td></tr>
                </tbody>
              </table>

              <h3>6. Assessor Sign-Off</h3>
              <table className="doc-data-table">
                <tbody>
                  <tr>
                    <td><strong>Prepared by:</strong> ______________________</td>
                    <td><strong>Signature:</strong> ______________________</td>
                    <td><strong>Date:</strong> _______________</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}