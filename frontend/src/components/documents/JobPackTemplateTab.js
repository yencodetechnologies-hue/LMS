import React from 'react';
import { Printer } from 'lucide-react';
import '../../styles/JobPackTemplateTab.css';

export default function JobPackTemplateTab({ course }) {
  const courseTitle = course?.title || 'ICTBWN307 Use optical measuring instruments — issued to the student at the start of AT-ICTBWN307-02';


  return (
    <div className="job-pack-wrapper">
    
      {/* Printable Sheet */}
      <div id="printable-job-pack" className="jp-document-sheet">
        {/* Top Running Header */}
        <div className="jp-running-header">
          [RTO_LEGAL_NAME] | RTO [RTO_ID] — Job Pack Template (JP-ICTBWN307-01)[cite: 6]
        </div>

        {/* Masthead Banner */}
        <div className="jp-masthead-banner">
          <div className="jp-banner-logo">[LOGO]</div>
          <div className="jp-banner-content">
            <span className="jp-banner-subtitle">[RTO_LEGAL_NAME] | RTO [RTO_ID]</span>
            <h1 className="jp-banner-heading">Job Pack Template</h1>
          </div>
        </div>

        <h2 className="jp-unit-title-row">ICTBWN307 Use optical measuring instruments — issued to the student at the start of AT-ICTBWN307-02</h2>

        {/* Document Control Table */}
        <table className="jp-control-table">
          <tbody>
            <tr>
              <th style={{ width: '22%' }}>Document ID</th>
              <td style={{ width: '28%' }}>JP-ICTBWN307-01</td>
              <th style={{ width: '22%' }}>Version</th>
              <td style={{ width: '28%' }}>1.0</td>
            </tr>
            <tr>
              <th>Document owner</th>
              <td>Compliance Manager</td>
              <th>Status</th>
              <td><span className="jp-badge-draft">DRAFT — not for issue</span></td>
            </tr>
            <tr>
              <th>Approved by</th>
              <td>[ROLE]</td>
              <th>Date of issue</th>
              <td>[DATE_OF_ISSUE]</td>
            </tr>
            <tr>
              <th>Training product</th>
              <td>ICTBWN307 (Release 1)</td>
              <th>Scheduled review</th>
              <td>[REVIEW_DATE]</td>
            </tr>
          </tbody>
        </table>

        {/* Revision History */}
        <section className="jp-section">
          <h3 className="jp-sec-title">Revision history</h3>
          <table className="jp-grid-table">
            <thead>
              <tr>
                <th style={{ width: '12%' }}>Version</th>
                <th style={{ width: '18%' }}>Date</th>
                <th style={{ width: '24%' }}>Author (role)</th>
                <th>Summary of change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">1.0</td>
                <td>[DATE_OF_ISSUE]</td>
                <td>Compliance Manager</td>
                <td>
                  First issue. Developed against ICTBWN307 Release 1, as included in ICT Training Package Release 9.1; unit first released with Training Package Version 5.0[cite: 6].
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Purpose */}
        <section className="jp-section">
          <h3 className="jp-sec-title">Purpose</h3>
          <div className="jp-sec-intro">
            <p>
              This job pack is prepared by the assessor (or drawn from a real work order, contextualised for assessment) and issued to the candidate at the start of AT-ICTBWN307-02[cite: 6]. It is the specification every pass/fail determination in the practical assessment is judged against (ATR-ICTBWN307-01, finding C8)[cite: 6]. Without a completed job pack, two assessors at two sites could apply two different specifications, or none — this template exists so that never happens[cite: 6].
            </p>
          </div>
        </section>

        {/* Section 1 — Job details */}
        <section className="jp-section">
          <h3 className="jp-sec-title">1. Job details</h3>
          <table className="jp-control-table">
            <tbody>
              <tr>
                <th style={{ width: '38%' }}>Job / work order number[cite: 6]</th>
                <td></td>
              </tr>
              <tr>
                <th>Site address[cite: 6]</th>
                <td></td>
              </tr>
              <tr>
                <th>Date[cite: 6]</th>
                <td></td>
              </tr>
              <tr>
                <th>Technician[cite: 6]</th>
                <td></td>
              </tr>
              <tr>
                <th>Test purpose (e.g. new install acceptance test, fault investigation, periodic maintenance check)[cite: 6]</th>
                <td><br /><br /></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 2 — Measurement types required */}
        <section className="jp-section">
          <h3 className="jp-sec-title">2. Measurement types required for this job</h3>
          <p className="jp-sec-intro">Tick every measurement type the candidate is required to perform on this job[cite: 6]. This must be consistent with the range of conditions verification in AT-ICTBWN307-02-AG §5[cite: 6].</p>
          <div className="jp-sec-intro" style={{ paddingLeft: '0.5rem' }}>
            <div style={{ marginBottom: '0.35rem' }}>☐ Absolute optical power (dBm)[cite: 6]</div>
            <div style={{ marginBottom: '0.35rem' }}>☐ Insertion loss (dB)[cite: 6]</div>
            <div style={{ marginBottom: '0.35rem' }}>☐ Live traffic / ONT presence detection[cite: 6]</div>
            <div style={{ marginBottom: '0.35rem' }}>☐ Relative optical power on a live PON (dB)[cite: 6]</div>
          </div>
        </section>

        {/* Section 3 — Link design loss budget */}
        <section className="jp-section">
          <h3 className="jp-sec-title">3. Link design loss budget</h3>
          <p className="jp-sec-intro">
            The design loss budget is the maximum insertion loss the link is engineered to tolerate[cite: 6]. A measured loss result is compared against this budget, not against a generic table, wherever the budget is available for the link under test[cite: 6].
          </p>
          <table className="jp-control-table">
            <tbody>
              <tr>
                <th style={{ width: '45%' }}>Link identifier / fibre reference[cite: 6]</th>
                <td></td>
              </tr>
              <tr>
                <th>Design loss budget (dB)[cite: 6]</th>
                <td></td>
              </tr>
              <tr>
                <th>Number of splices in path[cite: 6]</th>
                <td></td>
              </tr>
              <tr>
                <th>Number of connectors in path[cite: 6]</th>
                <td></td>
              </tr>
              <tr>
                <th>Fibre length (km)[cite: 6]</th>
                <td></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 4 — Acceptance limits per wavelength */}
        <section className="jp-section">
          <h3 className="jp-sec-title">4. Acceptance limits per wavelength</h3>
          <p className="jp-sec-intro">
            These are the limits the candidate's readings are judged against[cite: 6]. Where the design loss budget above is available for the specific link under test, it takes precedence over a generic table[cite: 6].
          </p>

          <table className="jp-grid-table">
            <thead>
              <tr>
                <th style={{ width: '18%' }}>Wavelength</th>
                <th style={{ width: '32%' }}>Measurement</th>
                <th>Acceptance limit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">1310 nm[cite: 6]</td>
                <td>Insertion loss (dB)[cite: 6]</td>
                <td>As stated in the link design loss budget above[cite: 6]. Where no project-specific budget is available, apply the RTO's default acceptance table for the cable type and topology under test[cite: 6].</td>
              </tr>
              <tr>
                <td className="font-bold">1490 nm[cite: 6]</td>
                <td>Downstream data power (dBm) / relative power (dB)[cite: 6]</td>
                <td>As specified for the PON class in use (e.g. GPON class B+/C+)[cite: 6]. Confirm against the network operator's specification sheet issued with this job pack[cite: 6].</td>
              </tr>
              <tr>
                <td className="font-bold">1550 nm[cite: 6]</td>
                <td>Downstream video / overlay power (dBm), where fitted[cite: 6]</td>
                <td>As specified for the overlay service in use[cite: 6]. Confirm against the network operator's specification sheet issued with this job pack[cite: 6].</td>
              </tr>
              <tr>
                <td className="font-bold">1625/1650 nm[cite: 6]</td>
                <td>In-service maintenance test wavelength[cite: 6]</td>
                <td>No separate acceptance limit[cite: 6]. Used to test for anomalies against the baseline reading without disrupting the 1490/1550 nm service wavelengths[cite: 6].</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 5 — Calibration record for instruments issued */}
        <section className="jp-section page-break-before">
          <h3 className="jp-sec-title">5. Calibration record for instruments issued</h3>
          <p className="jp-sec-intro">
            Complete one row per instrument issued to the candidate for this job[cite: 6]. This record is the evidence for O1.4 (PC 1.4 / PE2) in AT-ICTBWN307-02-AG[cite: 6].
          </p>

          <table className="jp-grid-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Instrument</th>
                <th style={{ width: '18%' }}>Serial number</th>
                <th style={{ width: '18%' }}>Cal due date</th>
                <th style={{ width: '12%' }} className="text-center">Checked current (Y/N)</th>
                <th style={{ width: '12%' }}>Issued by</th>
                <th style={{ width: '12%' }}>Returned (date)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Hand-held optical power meter[cite: 6]</td>
                <td></td>
                <td></td>
                <td className="text-center">☐ Y &nbsp; ☐ N</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="font-bold">Hand-held optical source[cite: 6]</td>
                <td></td>
                <td></td>
                <td className="text-center">☐ Y &nbsp; ☐ N</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="font-bold">Hand-held optical fibre identifier (OFI-FTTx)[cite: 6]</td>
                <td></td>
                <td></td>
                <td className="text-center">☐ Y &nbsp; ☐ N</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="font-bold">Active ONT detector[cite: 6]</td>
                <td></td>
                <td></td>
                <td className="text-center">☐ Y &nbsp; ☐ N</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="font-bold">Optical loss test set (OLTS)[cite: 6]</td>
                <td></td>
                <td></td>
                <td className="text-center">☐ Y &nbsp; ☐ N</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="font-bold">PON meter[cite: 6]</td>
                <td></td>
                <td></td>
                <td className="text-center">☐ Y &nbsp; ☐ N</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 6 — Assessor sign-off */}
        <section className="jp-section">
          <h3 className="jp-sec-title">6. Assessor sign-off</h3>
          <p className="jp-sec-intro">
            Confirm this job pack is complete before it is issued to the candidate[cite: 6]. An incomplete job pack must not be issued — the practical assessment cannot proceed without sections 1 to 5 above complete[cite: 6].
          </p>

          <table className="jp-control-table" style={{ marginTop: '0.75rem' }}>
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Prepared by[cite: 6]</th>
                <th style={{ width: '35%' }}>Signature[cite: 6]</th>
                <th>Date[cite: 6]</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ height: '45px' }}></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}