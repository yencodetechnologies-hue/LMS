import React from 'react';
import '../../styles/MappingDocument.css';

export default function MappingDocTab({ course }) {
 // const courseTitle = course?.title || 'ICTBWN307 Use optical measuring instruments — Release 1';

  return (
    <div className="mapping-a4-document">
      {/* Top Running Header */}
      <div className="map-running-header">
        [RTO_LEGAL_NAME] | RTO [RTO_ID] — Assessment Mapping Document[cite: 1]
      </div>

      {/* Maroon Masthead Banner matching reference */}
      <div className="map-masthead-banner">
        <div className="map-banner-logo-box">
          [LOGO]
        </div>
        <div className="map-banner-title-box">
          <span className="map-banner-subtitle">[RTO_LEGAL_NAME] | RTO [RTO_ID]</span>
          <h1 className="map-banner-heading">Assessment Mapping Document</h1>
        </div>
      </div>

      {/* Unit Title */}
      <h2 className="map-unit-title-row">ICTBWN307 Use optical measuring instruments — Release 1</h2>

      {/* Document Control Table */}
      <table className="map-control-table">
        <tbody>
          <tr>
            <th style={{ width: '22%' }}>Document ID</th>
            <td style={{ width: '28%' }}>AT-ICTBWN307-00</td>
            <th style={{ width: '22%' }}>Version</th>
            <td style={{ width: '28%' }}>1.0</td>
          </tr>
          <tr>
            <th>Document owner</th>
            <td>Compliance Manager</td>
            <th>Status</th>
            <td><span className="map-badge-draft">DRAFT — not for issue</span></td>
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

      {/* Revision History Table */}
      <section className="map-section">
        <h3 className="map-sec-title">Revision history</h3>
        <table className="map-grid-table">
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
                First issue. Developed against ICTBWN307 Release 1, as included in ICT Training Package Release 9.1; unit first released with Training Package Version 5.0[cite: 1].
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* SECTION 1 */}
      <section className="map-section">
        <h3 className="map-sec-title">1. Purpose and scope</h3>
        <p className="map-sec-intro">
          This document maps every component of ICTBWN307 Use optical measuring instruments to the assessment instrument in which it is assessed[cite: 1]. It is the primary evidence that the assessment tool addresses the full requirements of the unit of competency, and it is the document an auditor will read first[cite: 1].
        </p>
        <p className="map-sec-intro">
          The mapping covers elements and performance criteria, performance evidence, knowledge evidence, foundation skills, range of conditions and assessment conditions[cite: 1]. Where a requirement is assessed in more than one instrument, every instance is shown[cite: 1]. Every cross-reference in this document points to an item that actually exists, by its real code, in the instrument named[cite: 1].
        </p>
        <p className="map-sec-intro">
          This is version 2.0 of the mapping, rectified against Pre-Use Assessment Tool Review Record ATR-ICTBWN307-01 v1.0[cite: 1]. Section 4 and 6 now reproduce the unit's performance criteria and knowledge evidence verbatim, with RTO contextualisation carried in a separate note rather than merged into the requirement text[cite: 1].
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="map-section">
        <h3 className="map-sec-title">2. Training product details</h3>
        <table className="map-control-table">
          <tbody>
            <tr>
              <th style={{ width: '26%' }}>Unit code and title</th>
              <td>ICTBWN307 Use optical measuring instruments[cite: 1]</td>
            </tr>
            <tr>
              <th>Release</th>
              <td>ICTBWN307 Release 1, as included in ICT Information and Communications Technology Training Package Release 9.1 (current release, June 2025). The unit was first released with Training Package Version 5.0[cite: 1].</td>
            </tr>
            <tr>
              <th>Unit sector</th>
              <td>Telecommunications — Broadband and Wireless Networks[cite: 1]</td>
            </tr>
            <tr>
              <th>Application</th>
              <td>This unit describes the skills and knowledge required to select, prepare and use hand-held optical measuring instruments during installation, upgrade and fault-finding work on optical fibre equipment[cite: 1]. It applies to technicians who use hand-held optical test instruments, rather than full test-and-characterisation systems such as an OTDR-based fibre characterisation platform[cite: 1].</td>
            </tr>
            <tr>
              <th>Prerequisite units</th>
              <td>None identified in the current unit of competency[cite: 1].</td>
            </tr>
            <tr>
              <th>Licensing</th>
              <td>No licensing, legislative or certification requirements were identified for this unit at the time of review[cite: 1].</td>
            </tr>
            <tr>
              <th>Unit mapping</th>
              <td>No equivalent unit. New unit[cite: 1].</td>
            </tr>
            <tr>
              <th>Source verified</th>
              <td>training.gov.au unit of competency and assessment requirements, and ICT Training Package Companion Volume Implementation Guide V9.1 (June 2025), reviewed 3 September 2026[cite: 1].</td>
            </tr>
          </tbody>
        </table>
        <div className="map-callout-box">
          <strong>Note on prerequisites:</strong> This unit is one of two prerequisite units for ICTBWN308 Work safely on live optical fibre installations — the other is ICTWHS204 Follow WHS safety practices in the ICT industry (Companion Volume Implementation Guide V9.1, p. 83)[cite: 1]. A student record showing both prerequisite units complete is required before ICTBWN308 assessment may commence[cite: 1].
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="map-section">
        <h3 className="map-sec-title">3. Assessment instruments</h3>
        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Instrument</th>
              <th style={{ width: '38%' }}>Title</th>
              <th style={{ width: '18%' }}>Method</th>
              <th>Conditions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-bold">AT-ICTBWN307-01</td>
              <td>Knowledge Assessment — 27 multiple choice and 6 short answer items[cite: 1]</td>
              <td>Written, supervised[cite: 1]</td>
              <td>Closed book. 90 minutes. Individual[cite: 1].</td>
            </tr>
            <tr>
              <td className="font-bold">AT-ICTBWN307-02</td>
              <td>Practical Assessment — optical measuring instrument task[cite: 1]</td>
              <td>Direct observation with oral questioning[cite: 1]</td>
              <td>Workplace or simulated telecommunications environment. Approximately two hours[cite: 1].</td>
            </tr>
            <tr>
              <td className="font-bold">AT-ICTBWN307-01-AG</td>
              <td>Knowledge Assessment Answer Guide[cite: 1]</td>
              <td>Assessor use only[cite: 1]</td>
              <td>Not issued to students[cite: 1].</td>
            </tr>
            <tr>
              <td className="font-bold">AT-ICTBWN307-02-AG</td>
              <td>Practical Assessment Observation Checklist and Marking Guide[cite: 1]</td>
              <td>Assessor use only[cite: 1]</td>
              <td>Completed during observation, retained as evidence[cite: 1].</td>
            </tr>
            <tr>
              <td className="font-bold">JP-ICTBWN307-01</td>
              <td>Job Pack Template — issued to the student at the start of AT-ICTBWN307-02[cite: 1]</td>
              <td>Completed by assessor / enterprise[cite: 1]</td>
              <td>See document 6 of this set (C8)[cite: 1].</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* SECTION 3a */}
      <section className="map-section">
        <h3 className="map-sec-title">3a. Supporting documents and dependencies</h3>
        <p className="map-sec-intro">
          The instruments above depend on the following supporting documents. Each is listed here as required by MN9 of ATR-ICTBWN307-01, whether or not it is included in this set[cite: 1].
        </p>
        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Document</th>
              <th style={{ width: '25%' }}>Identifier</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Job pack template</strong></td>
              <td>JP-ICTBWN307-01</td>
              <td>Produced in this set — see document 6, the Job Pack Template[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>Validation Record</strong></td>
              <td>VR-[NN]</td>
              <td>Outstanding — produced by the RTO's validation process; identifier assigned from the validation register[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>Reassessment record</strong></td>
              <td>[RTO standard template]</td>
              <td>Outstanding — the RTO's standard reassessment record template applies; no unit-specific instrument is required[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>Calibration register</strong></td>
              <td>[RTO asset register]</td>
              <td>Outstanding — the RTO's existing instrument calibration register applies; no new document is required for this unit[cite: 1].</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* SECTION 4 */}
      <section className="map-section page-break-before">
        <h3 className="map-sec-title">4. Elements and performance criteria</h3>
        <p className="map-sec-intro">
          Every performance criterion is addressed by direct observation in AT-ICTBWN307-02[cite: 1]. Knowledge questions in AT-ICTBWN307-01 support the criteria but do not substitute for observed performance[cite: 1]. The "Performance criterion" column below reproduces the unit's wording verbatim; any RTO contextualisation is given underneath in a separate, clearly marked note (MJ1)[cite: 1].
        </p>

        {/* Element 1 */}
        <div className="map-element-subheading">Element 1 — Prepare to use optical measuring instruments[cite: 1]</div>
        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '8%' }}>PC</th>
              <th style={{ width: '56%' }}>Performance criterion (verbatim) / RTO note</th>
              <th style={{ width: '18%' }}>AT-02 observation</th>
              <th style={{ width: '18%' }}>AT-01 question</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center font-bold">1.1</td>
              <td>
                Obtain approval for site access with customer or site owner prior to site entry[cite: 1]
                <div className="map-rto-note"><strong>RTO note:</strong> The trigger point is site entry, not commencement of work: approval must be obtained before the technician sets foot on site[cite: 1].</div>
              </td>
              <td>O1.1[cite: 1]</td>
              <td>M1, S1[cite: 1]</td>
            </tr>
            <tr>
              <td className="text-center font-bold">1.2</td>
              <td>Identify purpose of test and type of optical measurement required[cite: 1]</td>
              <td>O1.2[cite: 1]</td>
              <td>M5, M9, S2[cite: 1]</td>
            </tr>
            <tr>
              <td className="text-center font-bold">1.3</td>
              <td>Select appropriate tools and instruments according to required measurement[cite: 1]</td>
              <td>O1.3[cite: 1]</td>
              <td>M6, M7, M8, M10, S2[cite: 1]</td>
            </tr>
            <tr>
              <td className="text-center font-bold">1.4</td>
              <td>
                Check test instruments to ensure calibration is within acceptable time frames[cite: 1]
                <div className="map-rto-note"><strong>RTO note:</strong> This is a currency-of-date check against the calibration label or the enterprise calibration register — not a measurement-tolerance test of the instrument itself[cite: 1].</div>
              </td>
              <td>O1.4[cite: 1]</td>
              <td>M25[cite: 1]</td>
            </tr>
            <tr>
              <td className="text-center font-bold">1.5</td>
              <td>Identify safety hazards, assess risks and implement risk control measures[cite: 1]</td>
              <td>O1.5[cite: 1]</td>
              <td>M2, M3, M4, S1[cite: 1]</td>
            </tr>
          </tbody>
        </table>

        {/* Element 2 */}
        <div className="map-element-subheading">Element 2 — Conduct optical measurements[cite: 1]</div>
        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '8%' }}>PC</th>
              <th style={{ width: '56%' }}>Performance criterion (verbatim) / RTO note</th>
              <th style={{ width: '18%' }}>AT-02 observation</th>
              <th style={{ width: '18%' }}>AT-01 question</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center font-bold">2.1</td>
              <td>
                Set up test equipment according to manufacturer and enterprise instructions, and safe industry practices[cite: 1]
                <div className="map-rto-note"><strong>RTO note:</strong> Safe industry practices includes matters such as PPE use and safe handling of live equipment during set-up, in addition to the manufacturer's and enterprise's own instructions[cite: 1].</div>
              </td>
              <td>O2.1[cite: 1]</td>
              <td>M6, M9[cite: 1]</td>
            </tr>
            <tr>
              <td className="text-center font-bold">2.2</td>
              <td>Test optical patch cords are functional[cite: 1]</td>
              <td>O2.2[cite: 1]</td>
              <td><span className="text-muted">— (observed only)[cite: 1]</span></td>
            </tr>
            <tr>
              <td className="text-center font-bold">2.3</td>
              <td>Inspect and clean optical connectors[cite: 1]</td>
              <td>O2.3, O2.4[cite: 1]</td>
              <td>M15, M16, S3[cite: 1]</td>
            </tr>
            <tr>
              <td className="text-center font-bold">2.4</td>
              <td>Use appropriate testing techniques to assess overall system performance[cite: 1]</td>
              <td>O2.4, O2.5, O2.6, O2.7, O2.8, O2.9, O2.10[cite: 1]</td>
              <td>M5, M6, M7, M8, M9, M10, M11, M12, M13, M14, M17, M18, M21, M22, M26[cite: 1]</td>
            </tr>
            <tr>
              <td className="text-center font-bold">2.5</td>
              <td>Record and interpret test results, and compare with standard test specifications[cite: 1]</td>
              <td>O2.11[cite: 1]</td>
              <td>M23, M24, M25, S4, S5, S6[cite: 1]</td>
            </tr>
          </tbody>
        </table>

        {/* Element 3 */}
        <div className="map-element-subheading page-break-before">Element 3 — Complete optical measurement process[cite: 1]</div>
        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '8%' }}>PC</th>
              <th style={{ width: '56%' }}>Performance criterion (verbatim) / RTO note</th>
              <th style={{ width: '18%' }}>AT-02 observation</th>
              <th style={{ width: '18%' }}>AT-01 question</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center font-bold">3.1</td>
              <td>Make recommendations, based on test result interpretations, to achieve optimum performance[cite: 1]</td>
              <td>O3.1[cite: 1]</td>
              <td>M12, M13, S5[cite: 1]</td>
            </tr>
            <tr>
              <td className="text-center font-bold">3.2</td>
              <td>Notify customer of work completion[cite: 1]</td>
              <td>O3.2[cite: 1]</td>
              <td><span className="text-muted">— (observed only)[cite: 1]</span></td>
            </tr>
            <tr>
              <td className="text-center font-bold">3.3</td>
              <td>
                Clean work area and make safe according to enterprise procedures[cite: 1]
                <div className="map-rto-note"><strong>RTO note:</strong> "Make safe" requires the work area to be left in a safe condition — offcuts contained, enclosures secured, unmated connectors capped — not merely tidied[cite: 1].</div>
              </td>
              <td>O3.3[cite: 1]</td>
              <td>M19, M20[cite: 1]</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* SECTION 5 */}
      <section className="map-section">
        <h3 className="map-sec-title">5. Performance evidence</h3>
        <p className="map-sec-intro">
          The candidate must demonstrate the ability to perform the tasks outlined in the elements, performance criteria and foundation skills, and to satisfy each item below[cite: 1]. Evidence must be provided at least once where a specific volume or frequency is not stated[cite: 1].
        </p>
        <p className="map-sec-intro">
          PE1–PE12 are discrete, separately assessable items drafted by this RTO from the four compound performance evidence bullets reproduced below, so that each can be observed and recorded individually against its own benchmark rather than inferred from a neighbouring item[cite: 1].
        </p>

        <div className="map-callout-box">
          <strong>Verbatim performance evidence (Assessment Requirements)[cite: 1]</strong>
          <ul style={{ margin: '0.4rem 0 0 1.2rem', padding: 0 }}>
            <li>comply with all job requirements and work health and safety (WHS) regulations, standards and work practices[cite: 1]</li>
            <li>confirm calibration within appropriate dates of instruments[cite: 1]</li>
            <li>operate the following equipment: hand-held optical power meter, hand-held optical source, handheld optical fibre identifier (OFI-FTTx), active optical network termination (ONT) detector, optical loss test set (OLTS), passive optical network (PON) meter[cite: 1]</li>
            <li>perform the following optical measurements: detect the presence of an active ONT, determine absolute optical power (in dBm), determine insertion loss (in dB), determine relative optical power level (in dB)[cite: 1]</li>
          </ul>
        </div>

        <div className="map-callout-box" style={{ background: '#fdf7f8' }}>
          <strong>Mapping note — PE4 and PE7:</strong> These were previously observed by a single either/or item (source-with-meter OR OLTS), so a candidate assessed on only one instrument was recorded as having met both[cite: 1]. AT-02-AG now requires the candidate to operate both instruments as two separate, mandatory observation items (O2.6 and O2.7), so PE4 and PE7 are each evidenced on their own record[cite: 1].
        </div>

        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>Ref</th>
              <th style={{ width: '54%' }}>Performance evidence requirement (RTO item)</th>
              <th style={{ width: '18%' }}>AT-02 observation</th>
              <th style={{ width: '18%' }}>AT-01 question</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-bold text-center">PE1</td>
              <td>comply with all job requirements and work health and safety (WHS) regulations, standards and work practices[cite: 1]</td>
              <td>O0.1, O1.5[cite: 1]</td>
              <td>M1, M2, M3, M4, S1[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">PE2</td>
              <td>confirm calibration within appropriate dates of instruments[cite: 1]</td>
              <td>O1.4[cite: 1]</td>
              <td>M25[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">PE3</td>
              <td>operate a hand-held optical power meter[cite: 1]</td>
              <td>O2.5[cite: 1]</td>
              <td>M5[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">PE4</td>
              <td>operate a hand-held optical source[cite: 1]</td>
              <td>O2.6[cite: 1]</td>
              <td>M6[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">PE5</td>
              <td>operate a hand-held optical fibre identifier (OFI-FTTx)[cite: 1]</td>
              <td>O2.8[cite: 1]</td>
              <td>M7[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">PE6</td>
              <td>operate an active optical network termination (ONT) detector[cite: 1]</td>
              <td>O2.9[cite: 1]</td>
              <td>M8[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">PE7</td>
              <td>operate an optical loss test set (OLTS)[cite: 1]</td>
              <td>O2.7[cite: 1]</td>
              <td>M9[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">PE8</td>
              <td>operate a passive optical network (PON) meter[cite: 1]</td>
              <td>O2.10[cite: 1]</td>
              <td>M10[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">PE9</td>
              <td>detect the presence of an active ONT[cite: 1]</td>
              <td>O2.9[cite: 1]</td>
              <td>M8[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">PE10</td>
              <td>determine absolute optical power (in dBm)[cite: 1]</td>
              <td>O2.5[cite: 1]</td>
              <td>M11, M23[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">PE11</td>
              <td>determine insertion loss (in dB)[cite: 1]</td>
              <td>O2.6, O2.7[cite: 1]</td>
              <td>M24, S4[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">PE12</td>
              <td>determine relative optical power level (in dB)[cite: 1]</td>
              <td>O2.10[cite: 1]</td>
              <td>M10, S5[cite: 1]</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* SECTION 6 */}
      <section className="map-section">
        <h3 className="map-sec-title">6. Knowledge evidence</h3>
        <p className="map-sec-intro">
          The candidate must demonstrate the knowledge required to perform the tasks outlined in the elements, performance criteria and foundation skills, which includes knowledge about each item below[cite: 1]. The "Knowledge evidence" column reproduces the unit's wording verbatim; any RTO contextualisation is given underneath in a separate, clearly marked note (MJ2)[cite: 1].
        </p>

        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>Ref</th>
              <th style={{ width: '64%' }}>Knowledge evidence (verbatim) / RTO note</th>
              <th>AT-01 items</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-bold text-center">KE1</td>
              <td>site-specific safety requirements and enterprise WHS processes and procedures[cite: 1]</td>
              <td>M1, M2, M3, M4, S1[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">KE2</td>
              <td>
                instruments used in measuring optical power levels[cite: 1]
                <div className="map-rto-note"><strong>RTO note:</strong> Including: hand-held optical power meter; hand-held optical source; handheld optical fibre identifier (OFI-FTTx); active ONT detector; OLTS; PON meter[cite: 1].</div>
              </td>
              <td>M5, M6, M7, M8, M9, M10, S2[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">KE3</td>
              <td>types of measurements and their respective interpretation for optical wavelengths[cite: 1]</td>
              <td>M11, M12, M13, M14, S5, S6[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">KE4</td>
              <td>consequences of mating contaminated optical connectors[cite: 1]</td>
              <td>M15, M16, S3[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">KE5</td>
              <td>
                data recording using unit decibels (dBm)[cite: 1]
                <div className="map-rto-note"><strong>RTO note:</strong> Read by this RTO as covering the correct application of both dBm (absolute power) and dB (relative/loss) notation, since the unit's measurement types include both absolute and loss/relative readings[cite: 1].</div>
              </td>
              <td>M14, M23, M24, M25, M27, S4[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">KE6</td>
              <td>
                variations between optical connector adaptor types[cite: 1]
                <div className="map-rto-note"><strong>RTO note:</strong> Adaptor types (for example SC, LC, FC, ST, MPO) are a distinct taxonomy from polish/coupling types (UPC, APC, PC). This item requires the former; polish/coupling types are separately covered under KE4/KE8 handling knowledge[cite: 1].</div>
              </td>
              <td>M17, M18, M21, M22[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">KE7</td>
              <td>
                optical spectrum limits and allocations[cite: 1]
                <div className="map-rto-note"><strong>RTO note:</strong> Read by this RTO, for the FTTx/GPON access context of this unit, as the permitted wavelength ranges and channel assignments relevant to the instruments used[cite: 1].</div>
              </td>
              <td>M10, M26, S6[cite: 1]</td>
            </tr>
            <tr>
              <td className="font-bold text-center">KE8</td>
              <td>safe handling procedures with optical fibres[cite: 1]</td>
              <td>M16, M19, M20, S3[cite: 1]</td>
            </tr>
          </tbody>
        </table>

        <div className="map-warning-box">
          <strong>Dual maintenance warning:</strong> This table must be kept identical to the knowledge evidence coverage table in AT-ICTBWN307-01-AG[cite: 1]. If an item is added, removed or reworded, both tables must be updated together, and validate.js re-run before the tool is reissued[cite: 1].
        </div>
      </section>

      {/* SECTION 7 */}
      <section className="map-section page-break-before">
        <h3 className="map-sec-title">7. Foundation skills</h3>
        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Skill</th>
              <th style={{ width: '43%' }}>Description</th>
              <th>Where evidenced</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Reading</strong></td>
              <td>Interprets plans, specifications and instructions; consolidates test data against defined requirements[cite: 1]</td>
              <td>O1.2, O2.11 — identifying the test purpose from the job pack and interpreting results against the relevant specification[cite: 1]</td>
            </tr>
            <tr>
              <td><strong>Writing</strong></td>
              <td>Records enterprise documents accurately, using clear language and correct spelling, grammar and terminology[cite: 1]</td>
              <td>O2.11; S1, S3, S4 — the completed test record and short-answer responses showing calculation working[cite: 1]</td>
            </tr>
            <tr>
              <td><strong>Oral communication</strong></td>
              <td>Exchanges information using appropriate, clear and detailed language; employs listening skills[cite: 1]</td>
              <td>O1.1, O3.2 — obtaining site approval and reporting job completion; Q1 and Q6 in AT-02-AG section 6[cite: 1]</td>
            </tr>
            <tr>
              <td><strong>Numeracy</strong></td>
              <td>Performs calculations to verify test system results[cite: 1]</td>
              <td>S4, S5 — loss calculation and evaluation of a marginal reading; O2.5, O2.6, O2.7, O2.10 — interpreting measured values against specification on site[cite: 1]</td>
            </tr>
            <tr>
              <td><strong>Navigate the world of work</strong></td>
              <td>Complies with explicit and implicit workplace policies[cite: 1]</td>
              <td>S1; O1.5 — implementing control measures according to workplace procedure without prompting[cite: 1]</td>
            </tr>
            <tr>
              <td><strong>Interact with others</strong></td>
              <td>Applies accepted communication practices and follows instructions[cite: 1]</td>
              <td>O1.1, O1.5, O3.2 — liaison with site owner, relevant personnel and the customer[cite: 1]</td>
            </tr>
            <tr>
              <td><strong>Get the work done</strong></td>
              <td>Plans and implements routine tasks; makes decisions; uses the main features and functions of digital tools[cite: 1]</td>
              <td>O1.2, O1.3, O2.1 — planning the job and setting up equipment; O3.1 — deciding follow-up action from results[cite: 1]</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* SECTION 8 */}
      <section className="map-section">
        <h3 className="map-sec-title">8. Range of conditions</h3>
        <p className="map-sec-intro">
          The range of conditions specifies the essential operating conditions for this unit[cite: 1]. It has exactly two headings in the unit itself: type of optical measurement, and instruments[cite: 1]. No wavelength range is specified in the unit's range of conditions (C6); wavelength content used by this RTO is contextualisation, given in AT-ICTBWN307-02 §5 and referenced from §9 below[cite: 1].
        </p>

        <div className="map-element-subheading">Type of optical measurement must include[cite: 1]</div>
        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '50%' }}>Measurement type</th>
              <th>Where assessed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ONT detection[cite: 1]</td>
              <td>O2.9; PE6, PE9[cite: 1]</td>
            </tr>
            <tr>
              <td>Absolute optical power (dBm)[cite: 1]</td>
              <td>M23; O2.5; PE3, PE10[cite: 1]</td>
            </tr>
            <tr>
              <td>Insertion loss (dB)[cite: 1]</td>
              <td>M24, S4; O2.6, O2.7; PE4, PE7, PE11[cite: 1]</td>
            </tr>
            <tr>
              <td>Relative optical power levels (dB)[cite: 1]</td>
              <td>S5; O2.10; PE8, PE12[cite: 1]</td>
            </tr>
          </tbody>
        </table>

        <div className="map-element-subheading page-break-before">Instruments must include[cite: 1]</div>
        <ul style={{ margin: '0.4rem 0 0.6rem 1.2rem', padding: 0 }}>
          <li>Hand-held optical power meter[cite: 1]</li>
          <li>Hand-held optical source[cite: 1]</li>
          <li>Hand-held optical fibre identifier (OFI-FTTx)[cite: 1]</li>
          <li>Active ONT detector[cite: 1]</li>
          <li>Optical loss test set (OLTS)[cite: 1]</li>
          <li>PON meter[cite: 1]</li>
        </ul>
        <p style={{ fontSize: '8pt', fontStyle: 'italic', color: '#666666', margin: '0.3rem 0' }}>
          The range of conditions values above are essential operating conditions specified by the unit of competency[cite: 1]. They are not variable by the assessor[cite: 1].
        </p>

        <div className="map-callout-box">
          <strong>RTO contextualisation (not a range of conditions value):</strong> 1310 nm, 1490 nm and 1550 nm, with 1625/1650 nm sometimes used for in-service maintenance testing — RTO contextualisation for the FTTx/GPON access context of this unit, and part of the evidence base for KE7 (M26, S6)[cite: 1]. This is not a unit range-of-conditions value[cite: 1].
        </div>
      </section>

      {/* SECTION 9 */}
      <section className="map-section">
        <h3 className="map-sec-title">9. Assessment conditions</h3>
        <p className="map-sec-intro">
          This review of the current unit and assessment requirements, and the ICT Training Package Companion Volume Implementation Guide V9.1, confirms no high-risk-work classification, licensing requirement, or additional Companion Volume licensing table entry for this unit — unlike ICTBWN308, which is expressly classified as high-risk work[cite: 1]. See section 10 below for the full Companion Volume confirmations[cite: 1].
        </p>

        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '60%' }}>Assessment condition requirement</th>
              <th style={{ width: '20%' }}>Confirmed</th>
              <th>Evidence held</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Assessment is conducted in a workplace, or in an environment that simulates a typical telecommunications workplace[cite: 1].</td>
              <td className="text-center">
                <label><input type="checkbox" /> Yes</label>&nbsp;&nbsp;
                <label><input type="checkbox" /> No</label>[cite: 1]
              </td>
              <td></td>
            </tr>
            <tr>
              <td>The assessor has access to a site or work area where the measuring instruments can be practically used[cite: 1].</td>
              <td className="text-center">
                <label><input type="checkbox" /> Yes</label>&nbsp;&nbsp;
                <label><input type="checkbox" /> No</label>[cite: 1]
              </td>
              <td></td>
            </tr>
            <tr>
              <td>Tools, equipment and plant currently used in industry are available[cite: 1].</td>
              <td className="text-center">
                <label><input type="checkbox" /> Yes</label>&nbsp;&nbsp;
                <label><input type="checkbox" /> No</label>[cite: 1]
              </td>
              <td></td>
            </tr>
            <tr>
              <td>Regulatory and equipment documentation relevant to the work is available to the assessor[cite: 1].</td>
              <td className="text-center">
                <label><input type="checkbox" /> Yes</label>&nbsp;&nbsp;
                <label><input type="checkbox" /> No</label>[cite: 1]
              </td>
              <td></td>
            </tr>
            <tr>
              <td>The assessor satisfies the assessor requirements in the applicable VET legislation, frameworks and standards[cite: 1].</td>
              <td className="text-center">
                <label><input type="checkbox" /> Yes</label>&nbsp;&nbsp;
                <label><input type="checkbox" /> No</label>[cite: 1]
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* SECTION 10 */}
      <section className="map-section">
        <h3 className="map-sec-title">10. Companion Volume Implementation Guide requirements</h3>
        <p className="map-sec-intro">
          Source: ICT Information and Communications Technology Training Package Companion Volume Implementation Guide V9.1, June 2025[cite: 1]. Confirmed independently by this RTO, not deferred to a later compliance check, as required by ATR-ICTBWN307-01 finding C11[cite: 1].
        </p>
        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>CVIG topic</th>
              <th style={{ width: '8%' }}>Page</th>
              <th style={{ width: '42%' }}>Requirement</th>
              <th>Where discharged</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Prerequisite units in the ICT Training Package</strong></td>
              <td className="text-center">83[cite: 1]</td>
              <td>ICTBWN307 is not listed as a unit having prerequisites[cite: 1]. It is listed, with ICTWHS204, as a prerequisite for ICTBWN308[cite: 1].</td>
              <td>AT-00 §2; AT-ICTBWN307-01 prerequisite confirmation block[cite: 1]</td>
            </tr>
            <tr>
              <td><strong>Regulation and licensing implications — high-risk work</strong></td>
              <td className="text-center">89[cite: 1]</td>
              <td>The high-risk work list includes ICTBWN308 and does not include ICTBWN307[cite: 1].</td>
              <td>AT-00 §9 and §11 — validation interval and assessment conditions[cite: 1]</td>
            </tr>
            <tr>
              <td><strong>Regulation and licensing implications — licensing and registration requirements for assessors</strong></td>
              <td className="text-center">89[cite: 1]</td>
              <td>Assessor requirements are those identified in the unit's Assessment Conditions, together with the requirements of the applicable registering body[cite: 1].</td>
              <td>AT-00 §9 assessor row; AT-ICTBWN307-02-AG §1 pre-assessment verification[cite: 1]</td>
            </tr>
            <tr>
              <td><strong>Version control and modification history</strong></td>
              <td className="text-center">3[cite: 1]</td>
              <td>Current package release is 9.1 (June 2025)[cite: 1]. Version 9.0 (December 2024) updated telecommunications training products; ICTBWN307 was not among the units changed[cite: 1].</td>
              <td>Revision history of all six documents in this set[cite: 1]</td>
            </tr>
          </tbody>
        </table>
        <div className="map-callout-box">
          <strong>Scope of registration note:</strong> ICTBWN307 has no equivalent unit and supersedes nothing, so no scope transition question arises[cite: 1]. Confirm the unit is on the RTO's scope of registration before delivery[cite: 1].
        </div>
      </section>

      {/* SECTION 11 */}
      <section className="map-section">
        <h3 className="map-sec-title">11. Principles of assessment and rules of evidence</h3>
        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Requirement</th>
              <th>How this tool satisfies it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Validity</strong></td>
              <td>Every performance criterion, performance evidence item and knowledge evidence item is mapped to an instrument by a real, resolvable item code[cite: 1]. Performance is assessed by direct observation of the actual task, not by written description of it[cite: 1]. The knowledge assessment answer key is distributed across all four options at random (see AT-01-AG), not concentrated on one letter[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>Reliability</strong></td>
              <td>Benchmark answers and observation benchmarks are specified for every item, so different assessors reach the same judgement on the same evidence[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>Flexibility</strong></td>
              <td>Reasonable adjustment is available for the knowledge assessment[cite: 1]. No adjustment is available to the range of conditions values or to the requirement for observed instrument operation[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>Fairness</strong></td>
              <td>Instructions, conditions and criteria are given to the student before assessment[cite: 1]. Reassessment and appeal rights are stated on each instrument[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>Valid evidence</strong></td>
              <td>Each instrument assesses what it claims to assess and is mapped in sections 4 to 8[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>Sufficient evidence</strong></td>
              <td>Knowledge and observed performance are both collected[cite: 1]. Oral questioning during observation confirms understanding underpinning the observed actions[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>Authentic evidence</strong></td>
              <td>The knowledge assessment is supervised and closed book[cite: 1]. Observation is of the candidate's own work[cite: 1]. A student declaration is signed on each instrument[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>Current evidence</strong></td>
              <td>Assessment is conducted on current equipment against the current unit release[cite: 1].</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* SECTION 12 */}
      <section className="map-section">
        <h3 className="map-sec-title">12. Validation</h3>
        <p className="map-sec-intro">This tool is scheduled for validation in accordance with the RTO validation plan[cite: 1].</p>
        <p className="map-sec-intro">
          ICTBWN308 (not this unit) is included in the Companion Volume Implementation Guide's high-risk work list; ICTBWN307 is not (CVIG V9.1, p. 89)[cite: 1]. ICTBWN307 is therefore validated at the RTO's standard interval: at least 50 per cent of training products validated every three years, and 100 per cent every five years[cite: 1]. No shortened, high-risk-work validation interval applies to this unit[cite: 1].
        </p>

        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Validation activity</th>
              <th style={{ width: '18%' }}>Scheduled</th>
              <th style={{ width: '32%' }}>Panel roles</th>
              <th>Outcome record</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Pre-use validation of this tool</strong></td>
              <td>[DATE]</td>
              <td>Lead validator; industry representative; qualified assessor[cite: 1]</td>
              <td>Validation Record VR-[NN][cite: 1]</td>
            </tr>
            <tr>
              <td><strong>Post-use validation</strong></td>
              <td>[DATE]</td>
              <td>As above, with assessor judgement sample[cite: 1]</td>
              <td>Validation Record VR-[NN][cite: 1]</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* SECTION 13 */}
      <section className="map-section page-break-before">
        <h3 className="map-sec-title">13. Audit evidence guide</h3>
        <p className="map-sec-intro">The following evidence demonstrates that this tool is in use, not merely that it exists[cite: 1]:</p>
        <ul style={{ margin: '0.4rem 0 0.6rem 1.2rem', padding: 0 }}>
          <li style={{ marginBottom: '0.35rem' }}>Completed AT-ICTBWN307-01 papers with assessor marking against the answer guide, showing marked incorrect responses and the feedback given[cite: 1].</li>
          <li style={{ marginBottom: '0.35rem' }}>Completed AT-ICTBWN307-02 observation checklists signed and dated by the assessor at the time of observation, not reconstructed afterwards, including the running safety item (O0.1) and the contingency item (O2.4)[cite: 1].</li>
          <li style={{ marginBottom: '0.35rem' }}>Completed job pack (JP-ICTBWN307-01) for each assessment, showing the specification the candidate's results were judged against[cite: 1].</li>
          <li style={{ marginBottom: '0.35rem' }}>Trainer and assessor matrix evidencing the assessor requirements for this unit, with supporting certification[cite: 1].</li>
          <li style={{ marginBottom: '0.35rem' }}>Calibration records for the optical test instruments used in assessment, current at each assessment date[cite: 1].</li>
          <li style={{ marginBottom: '0.35rem' }}>Validation records showing this tool has been validated, with actions arising closed out[cite: 1].</li>
          <li style={{ marginBottom: '0.35rem' }}>At least one record of reassessment, showing the reassessment process was applied as documented[cite: 1].</li>
        </ul>
      </section>

      {/* SECTION 14 */}
      <section className="map-section">
        <h3 className="map-sec-title">14. Unresolved placeholders and dependencies</h3>
        <p className="map-sec-intro">
          The following placeholders must be resolved before this document is issued[cite: 1]. A bracketed placeholder in an issued document reads at audit as a document that has never been used[cite: 1]. This set does not go to the client while this section has an entry in it (ATR-ICTBWN307-01 §10)[cite: 1].
        </p>

        <table className="map-grid-table">
          <thead>
            <tr>
              <th style={{ width: '28%' }}>Placeholder / Dependency</th>
              <th>Action required before issue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>[RTO_ID]</strong></td>
              <td>masthead of every document in this set. Required from the client[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>[RTO_LEGAL_NAME]</strong></td>
              <td>masthead and control table of every document in this set[cite: 1]. Confirm against the training.gov.au organisation record, not the logo or the website[cite: 1]. Required from the client[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>[DATE_OF_ISSUE] &amp; [REVIEW_DATE]</strong></td>
              <td>control table of every document in this set[cite: 1]. Each document takes its own review date; the set is not dated to a single one[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>[DATE]</strong></td>
              <td>validation schedule, section 12[cite: 1]. Required from the RTO validation plan[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>VR-[NN]</strong></td>
              <td>validation record identifiers, section 12[cite: 1]. Required from the validation register[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>[ROLE]</strong></td>
              <td>approver of the control table on every document in this set[cite: 1]. Required from the RTO delegations schedule[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>Document identifiers</strong></td>
              <td>AT-ICTBWN307-00, -01, -01-AG, -02, -02-AG and JP-ICTBWN307-01 must be checked against the RTO document register and reissued if any identifier is already allocated[cite: 1]. Retired identifiers are never reused[cite: 1].</td>
            </tr>
            <tr>
              <td><strong>Governance Documents</strong></td>
              <td>Training and assessment strategy, trainer and assessor matrix, and RTO assessment policy — referenced throughout this set but not supplied and out of scope of ATR-ICTBWN307-01[cite: 1]. Required before this set is issued[cite: 1].</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}