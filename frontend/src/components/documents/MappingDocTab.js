import React from 'react';
import '../../styles/KnowledgeAnswerGuide.css';

// Reusable element/performance-criteria table used in Section 4
function ElementPCTable({ elementTitle, rows }) {
  return (
    <>
      <div className="doc-element-subheading">{elementTitle}</div>
      <table className="doc-grid-table">
        <thead>
          <tr>
            <th style={{ width: '8%' }}>PC</th>
            <th style={{ width: '40%' }}>Performance criterion (verbatim) / RTO note</th>
            <th style={{ width: '26%' }}>AT-02 observation</th>
            <th>AT-01 question</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.pc}>
              <td className="font-bold text-center">{row.pc}</td>
              <td>
                {row.criterion}
                {row.note && (
                  <div style={{ marginTop: '0.3rem', fontStyle: 'italic', color: '#555', fontSize: '8pt' }}>
                    {row.note}
                  </div>
                )}
              </td>
              <td>{row.observation}</td>
              <td>{row.question}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// rtoData: { instituteName, rtoNumber, logo } — pass the fetched RTO/order
// record here to bind the masthead to real values. Falls back to bracketed
// placeholders when a field isn't available yet (e.g. still loading).
export default function MappingDocTab({ course, rtoData }) {
  const instituteName = rtoData?.instituteName || '[RTO_LEGAL_NAME]';
  const rtoId = rtoData?.rtoNumber || '[RTO_ID]';
  const logoUrl = rtoData?.logo || '';

  return (
    <div className="ans-guide-sec">
      {/* Printable Sheet */}
      <div id="printable-mapping-document" className="a4-document-sheet">
        {/* Top Running Rule */}
        <div className="doc-running-header">
          {instituteName} | RTO {rtoId} — Assessment Mapping Document (AT-ICTBWN307-00)
        </div>

        {/* Masthead Banner */}
        <div className="doc-masthead-banner">
          <div className="doc-banner-logo">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="RTO Logo"
                style={{ maxHeight: '40px', maxWidth: '100px', objectFit: 'contain' }}
              />
            ) : (
              '[LOGO]'
            )}
          </div>
          <div className="doc-banner-content">
            <span className="doc-banner-subtitle">{instituteName} | RTO {rtoId}</span>
            <h1 className="doc-banner-heading">Assessment Mapping Document</h1>
          </div>
        </div>

        <h2 className="doc-unit-title-row">ICTBWN307 Use optical measuring instruments — Release 1</h2>

        {/* Document Control Table */}
        <table className="doc-control-table">
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
              <td><span className="doc-badge-draft">DRAFT — not for issue</span></td>
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
        <section className="doc-section">
          <h3 className="doc-sec-title">Revision history</h3>
          <table className="doc-grid-table">
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
                  First issue. Developed against ICTBWN307 Release 1, as included in ICT Training Package Release 9.1; unit first released with Training Package Version 5.0.
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 1. Purpose and scope */}
        <section className="doc-section">
          <h3 className="doc-sec-title">1. Purpose and scope</h3>
          <p className="doc-sec-intro">
            This document maps every component of ICTBWN307 Use optical measuring instruments to the assessment instrument in which it is assessed. It is the primary evidence that the assessment tool addresses the full requirements of the unit of competency, and it is the document an auditor will read first.
          </p>
          <p className="doc-sec-intro">
            The mapping covers elements and performance criteria, performance evidence, knowledge evidence, foundation skills, range of conditions and assessment conditions. Where a requirement is assessed in more than one instrument, every instance is shown. Every cross-reference in this document points to an item that actually exists, by its real code, in the instrument named.
          </p>
          <div className="doc-callout-box">
            <em>This is version 2.0 of the mapping, rectified against PreUse Assessment Tool Review Record ATR-ICTBWN307-01 v1.0. Section 4 and 6 now reproduce the unit's performance criteria and knowledge evidence verbatim, with RTO contextualisation carried in a separate note rather than merged into the requirement text.</em>
          </div>
        </section>

        {/* 2. Training product details */}
        <section className="doc-section">
          <h3 className="doc-sec-title">2. Training product details</h3>
          <table className="doc-control-table">
            <tbody>
              <tr>
                <th style={{ width: '28%' }}>Unit code and title</th>
                <td>ICTBWN307 Use optical measuring instruments</td>
              </tr>
              <tr>
                <th>Release</th>
                <td>ICTBWN307 Release 1, as included in ICT Information and Communications Technology Training Package Release 9.1 (current release, June 2025). The unit was first released with Training Package Version 5.0.</td>
              </tr>
              <tr>
                <th>Unit sector</th>
                <td>Telecommunications — Broadband and Wireless Networks</td>
              </tr>
              <tr>
                <th>Application</th>
                <td>This unit describes the skills and knowledge required to select, prepare and use hand-held optical measuring instruments during installation, upgrade and fault-finding work on optical fibre equipment. It applies to technicians who use hand-held optical test instruments, rather than full test-and-characterisation systems such as an OTDR-based fibre characterisation platform.</td>
              </tr>
              <tr>
                <th>Prerequisite units</th>
                <td>None identified in the current unit of competency.</td>
              </tr>
              <tr>
                <th>Licensing</th>
                <td>No licensing, legislative or certification requirements were identified for this unit at the time of review.</td>
              </tr>
              <tr>
                <th>Unit mapping</th>
                <td>No equivalent unit. New unit.</td>
              </tr>
              <tr>
                <th>Source verified</th>
                <td>training.gov.au unit of competency and assessment requirements, and ICT Training Package Companion Volume Implementation Guide V9.1 (June 2025), reviewed 3 September 2026.</td>
              </tr>
            </tbody>
          </table>
          <p className="doc-sec-intro" style={{ marginTop: '0.6rem' }}>
            This unit is one of two prerequisite units for ICTBWN308 Work safely on live optical fibre installations — the other is ICTWHS204 Follow WHS safety practices in the ICT industry (Companion Volume Implementation Guide V9.1, p. 83). A student record showing both prerequisite units complete is required before ICTBWN308 assessment may commence.
          </p>
        </section>

        {/* 3. Assessment instruments */}
        <section className="doc-section">
          <h3 className="doc-sec-title">3. Assessment instruments</h3>
          <table className="doc-grid-table">
            <thead>
              <tr>
                <th style={{ width: '18%' }}>Instrument</th>
                <th style={{ width: '26%' }}>Title</th>
                <th style={{ width: '20%' }}>Method</th>
                <th>Conditions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">AT-ICTBWN307-01</td>
                <td>Knowledge Assessment — 27 multiple choice and 6 short answer items</td>
                <td>Written, supervised</td>
                <td>Closed book. 90 minutes. Individual.</td>
              </tr>
              <tr>
                <td className="font-bold">AT-ICTBWN307-02</td>
                <td>Practical Assessment — optical measuring instrument task</td>
                <td>Direct observation with oral questioning</td>
                <td>Workplace or simulated telecommunications environment. Approximately two hours.</td>
              </tr>
              <tr>
                <td className="font-bold">AT-ICTBWN307-01-AG</td>
                <td>Knowledge Assessment Answer Guide</td>
                <td>Assessor use only</td>
                <td>Not issued to students.</td>
              </tr>
              <tr>
                <td className="font-bold">AT-ICTBWN307-02-AG</td>
                <td>Practical Assessment Observation Checklist and Marking Guide</td>
                <td>Assessor use only</td>
                <td>Completed during observation, retained as evidence.</td>
              </tr>
              <tr>
                <td className="font-bold">JP-ICTBWN307-01</td>
                <td>Job Pack Template — issued to the student at the start of AT-ICTBWN307-02</td>
                <td>Completed by the assessor / enterprise before the task</td>
                <td>See document 6 of this set (C8).</td>
              </tr>
            </tbody>
          </table>

          <div className="doc-element-subheading">3a. Supporting documents and dependencies</div>
          <p className="doc-sec-intro">
            The instruments above depend on the following supporting documents. Each is listed here as required by MN9 of ATR-ICTBWN307-01, whether or not it is included in this set.
          </p>
          <table className="doc-grid-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Document</th>
                <th style={{ width: '22%' }}>Identifier</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Job pack template</td>
                <td>JP-ICTBWN307-01</td>
                <td>Produced in this set — see document 6, the Job Pack Template.</td>
              </tr>
              <tr>
                <td className="font-bold">Validation Record</td>
                <td>VR-[NN]</td>
                <td>Outstanding — produced by the RTO's validation process; identifier assigned from the validation register.</td>
              </tr>
              <tr>
                <td className="font-bold">Reassessment record</td>
                <td>[RTO standard template]</td>
                <td>Outstanding — the RTO's standard reassessment record template applies; no unit-specific instrument is required.</td>
              </tr>
              <tr>
                <td className="font-bold">Calibration register</td>
                <td>[RTO asset register]</td>
                <td>Outstanding — the RTO's existing instrument calibration register applies; no new document is required for this unit.</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 4. Elements and performance criteria */}
        <section className="doc-section">
          <h3 className="doc-sec-title">4. Elements and performance criteria</h3>
          <p className="doc-sec-intro">
            Every performance criterion is addressed by direct observation in AT-ICTBWN307-02. Knowledge questions in AT-ICTBWN307-01 support the criteria but do not substitute for observed performance. The "Performance criterion" column below reproduces the unit's wording verbatim; any RTO contextualisation is given underneath in a separate, clearly marked note (MJ1).
          </p>

          <ElementPCTable
            elementTitle="Element 1 — Prepare to use optical measuring instruments"
            rows={[
              {
                pc: '1.1',
                criterion: 'Obtain approval for site access with customer or site owner prior to site entry',
                note: 'RTO note: The trigger point is site entry, not commencement of work: approval must be obtained before the technician sets foot on site.',
                observation: 'O1.1',
                question: 'M1, S1',
              },
              {
                pc: '1.2',
                criterion: 'Identify purpose of test and type of optical measurement required',
                observation: 'O1.2',
                question: 'M5, M9, S2',
              },
              {
                pc: '1.3',
                criterion: 'Select appropriate tools and instruments according to required measurement',
                observation: 'O1.3',
                question: 'M6, M7, M8, M10, S2',
              },
              {
                pc: '1.4',
                criterion: 'Check test instruments to ensure calibration is within acceptable time frames',
                note: 'RTO note: This is a currency-of-date check against the calibration label or the enterprise calibration register — not a measurement-tolerance test of the instrument itself.',
                observation: 'O1.4',
                question: 'M25',
              },
              {
                pc: '1.5',
                criterion: 'Identify safety hazards, assess risks and implement risk control measures',
                observation: 'O1.5',
                question: 'M2, M3, M4, S1',
              },
            ]}
          />

          <ElementPCTable
            elementTitle="Element 2 — Conduct optical measurements"
            rows={[
              {
                pc: '2.1',
                criterion: 'Set up test equipment according to manufacturer and enterprise instructions, and safe industry practices',
                note: "RTO note: Safe industry practices includes matters such as PPE use and safe handling of live equipment during set-up, in addition to the manufacturer's and enterprise's own instructions.",
                observation: 'O2.1',
                question: 'M6, M9',
              },
              {
                pc: '2.2',
                criterion: 'Test optical patch cords are functional',
                observation: 'O2.2',
                question: '— (observed only)',
              },
              {
                pc: '2.3',
                criterion: 'Inspect and clean optical connectors',
                observation: 'O2.3, O2.4',
                question: 'M15, M16, S3',
              },
              {
                pc: '2.4',
                criterion: 'Use appropriate testing techniques to assess overall system performance',
                observation: 'O2.4, O2.5, O2.6, O2.7, O2.8, O2.9, O2.10',
                question: 'M5, M6, M7, M8, M9, M10, M11, M12, M13, M14, M17, M18, M21, M22, M26',
              },
              {
                pc: '2.5',
                criterion: 'Record and interpret test results, and compare with standard test specifications',
                observation: 'O2.11',
                question: 'M23, M24, M25, S4, S5, S6',
              },
            ]}
          />

          <ElementPCTable
            elementTitle="Element 3 — Complete optical measurement process"
            rows={[
              {
                pc: '3.1',
                criterion: 'Make recommendations, based on test result interpretations, to achieve optimum performance',
                observation: 'O3.1',
                question: 'M12, M13, S5',
              },
              {
                pc: '3.2',
                criterion: 'Notify customer of work completion',
                observation: 'O3.2',
                question: '— (observed only)',
              },
              {
                pc: '3.3',
                criterion: 'Clean work area and make safe according to enterprise procedures',
                note: '"Make safe" requires the work area to be left in a safe condition — offcuts contained, enclosures secured, unmated connectors capped — not merely tidied.',
                observation: 'O3.3',
                question: 'M19, M20',
              },
            ]}
          />
        </section>

        {/* 5. Performance evidence */}
        <section className="doc-section">
          <h3 className="doc-sec-title">5. Performance evidence</h3>
          <p className="doc-sec-intro">
            The candidate must demonstrate the ability to perform the tasks outlined in the elements, performance criteria and foundation skills, and to satisfy each item below. Evidence must be provided at least once where a specific volume or frequency is not stated.
          </p>
          <div className="doc-callout-box">
            <em>PE1–PE12 are discrete, separately assessable items drafted by this RTO from the four compound performance evidence bullets reproduced above, so that each can be observed and recorded individually against its own benchmark rather than inferred from a neighbouring item.</em>
          </div>

          <div className="doc-element-subheading">Verbatim performance evidence (Assessment Requirements)</div>
          <ul style={{ margin: '0 0 0.8rem 0', paddingLeft: '1.2rem', fontSize: '9.5pt' }}>
            <li>comply with all job requirements and work health and safety (WHS) regulations, standards and work practices</li>
            <li>confirm calibration within appropriate dates of instruments</li>
            <li>operate the following equipment: hand-held optical power meter, hand-held optical source, handheld optical fibre identifier (OFI-FTTx), active optical network termination (ONT) detector, optical loss test set (OLTS), passive optical network (PON) meter</li>
            <li>perform the following optical measurements: detect the presence of an active ONT, determine absolute optical power (in dBm), determine insertion loss (in dB), determine relative optical power level (in dB)</li>
          </ul>

          <div className="doc-warning-box">
            <strong>Mapping note — PE4 and PE7.</strong> These were previously observed by a single either/or item (source-with-meter OR OLTS), so a candidate assessed on only one instrument was recorded as having met both. AT-02-AG now requires the candidate to operate both instruments as two separate, mandatory observation items (O2.6 and O2.7), so PE4 and PE7 are each evidenced on their own record.
          </div>

          <table className="doc-grid-table">
            <thead>
              <tr>
                <th style={{ width: '8%' }}>Ref</th>
                <th style={{ width: '46%' }}>Performance evidence requirement (RTO item)</th>
                <th style={{ width: '22%' }}>AT-02 observation</th>
                <th>AT-01 question</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['PE1', 'comply with all job requirements and work health and safety (WHS) regulations, standards and work practices', 'O0.1, O1.5', 'M1, M2, M3, M4, S1'],
                ['PE2', 'confirm calibration within appropriate dates of instruments', 'O1.4', 'M25'],
                ['PE3', 'operate a hand-held optical power meter', 'O2.5', 'M5'],
                ['PE4', 'operate a hand-held optical source', 'O2.6', 'M6'],
                ['PE5', 'operate a hand-held optical fibre identifier (OFI-FTTx)', 'O2.8', 'M7'],
                ['PE6', 'operate an active optical network termination (ONT) detector', 'O2.9', 'M8'],
                ['PE7', 'operate an optical loss test set (OLTS)', 'O2.7', 'M9'],
                ['PE8', 'operate a passive optical network (PON) meter', 'O2.10', 'M10'],
                ['PE9', 'detect the presence of an active ONT', 'O2.9', 'M8'],
                ['PE10', 'determine absolute optical power (in dBm)', 'O2.5', 'M11, M23'],
                ['PE11', 'determine insertion loss (in dB)', 'O2.6, O2.7', 'M24, S4'],
                ['PE12', 'determine relative optical power level (in dB)', 'O2.10', 'M10, S5'],
              ].map(([ref, req, obs, q]) => (
                <tr key={ref}>
                  <td className="font-bold text-center">{ref}</td>
                  <td>{req}</td>
                  <td>{obs}</td>
                  <td>{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 6. Knowledge evidence */}
        <section className="doc-section">
          <h3 className="doc-sec-title">6. Knowledge evidence</h3>
          <p className="doc-sec-intro">
            The candidate must demonstrate the knowledge required to perform the tasks outlined in the elements, performance criteria and foundation skills, which includes knowledge about each item below. The "Knowledge evidence" column reproduces the unit's wording verbatim; any RTO contextualisation is given underneath in a separate, clearly marked note (MJ2).
          </p>

          <table className="doc-grid-table">
            <thead>
              <tr>
                <th style={{ width: '8%' }}>Ref</th>
                <th style={{ width: '62%' }}>Knowledge evidence (verbatim) / RTO note</th>
                <th>AT-01 items</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ref: 'KE1', text: 'site-specific safety requirements and enterprise WHS processes and procedures', note: null, items: 'M1, M2, M3, M4, S1' },
                { ref: 'KE2', text: 'instruments used in measuring optical power levels', note: 'RTO note: Including: hand-held optical power meter; hand-held optical source; handheld optical fibre identifier (OFI-FTTx); active ONT detector; OLTS; PON meter.', items: 'M5, M6, M7, M8, M9, M10, S2' },
                { ref: 'KE3', text: 'types of measurements and their respective interpretation for optical wavelengths', note: null, items: 'M11, M12, M13, M14, S5, S6' },
                { ref: 'KE4', text: 'consequences of mating contaminated optical connectors', note: null, items: 'M15, M16, S3' },
                { ref: 'KE5', text: 'data recording using unit decibels (dBm)', note: "RTO note: Read by this RTO as covering the correct application of both dBm (absolute power) and dB (relative/loss) notation, since the unit's measurement types include both absolute and loss/relative readings.", items: 'M14, M23, M24, M25, M27, S4' },
                { ref: 'KE6', text: 'variations between optical connector adaptor types', note: 'RTO note: Adaptor types (for example SC, LC, FC, ST, MPO) are a distinct taxonomy from polish/coupling types (UPC, APC, PC). This item requires the former; polish/coupling types are separately covered under KE4/KE8 handling knowledge.', items: 'M17, M18, M21, M22' },
                { ref: 'KE7', text: 'optical spectrum limits and allocations', note: 'RTO note: Read by this RTO, for the FTTx/GPON access context of this unit, as the permitted wavelength ranges and channel assignments relevant to the instruments used.', items: 'M10, M26, S6' },
                { ref: 'KE8', text: 'safe handling procedures with optical fibres', note: null, items: 'M16, M19, M20, S3' },
              ].map((row) => (
                <tr key={row.ref}>
                  <td className="font-bold text-center">{row.ref}</td>
                  <td>
                    {row.text}
                    {row.note && (
                      <div style={{ marginTop: '0.3rem', fontStyle: 'italic', color: '#555', fontSize: '8pt' }}>
                        {row.note}
                      </div>
                    )}
                  </td>
                  <td>{row.items}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="doc-warning-box" style={{ marginTop: '0.6rem' }}>
            <em>Dual maintenance warning: this table must be kept identical to the knowledge evidence coverage table in AT-ICTBWN307-01-AG. If an item is added, removed or reworded, both tables must be updated together, and validate.js re-run before the tool is reissued.</em>
          </div>
        </section>

        {/* 7. Foundation skills */}
        <section className="doc-section">
          <h3 className="doc-sec-title">7. Foundation skills</h3>
          <table className="doc-grid-table">
            <thead>
              <tr>
                <th style={{ width: '16%' }}>Skill</th>
                <th style={{ width: '42%' }}>Description</th>
                <th>Where evidenced</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Reading', 'Interprets plans, specifications and instructions; consolidates test data against defined requirements', 'O1.2, O2.11 — identifying the test purpose from the job pack and interpreting results against the relevant specification'],
                ['Writing', 'Records enterprise documents accurately, using clear language and correct spelling, grammar and terminology', 'O2.11; S1, S3, S4 — the completed test record and short-answer responses showing calculation working'],
                ['Oral communication', 'Exchanges information using appropriate, clear and detailed language; employs listening skills', 'O1.1, O3.2 — obtaining site approval and reporting job completion; Q1 and Q6 in AT-02-AG section 6'],
                ['Numeracy', 'Performs calculations to verify test system results', 'S4, S5 — loss calculation and evaluation of a marginal reading; O2.5, O2.6, O2.7, O2.10 — interpreting measured values against specification on site'],
                ['Navigate the world of work', 'Complies with explicit and implicit workplace policies', 'S1; O1.5 — implementing control measures according to workplace procedure without prompting'],
                ['Interact with others', 'Applies accepted communication practices and follows instructions', 'O1.1, O1.5, O3.2 — liaison with site owner, relevant personnel and the customer'],
                ['Get the work done', 'Plans and implements routine tasks; makes decisions; uses the main features and functions of digital tools', 'O1.2, O1.3, O2.1 — planning the job and setting up equipment; O3.1 — deciding follow-up action from results'],
              ].map(([skill, desc, evidenced]) => (
                <tr key={skill}>
                  <td className="font-bold">{skill}</td>
                  <td>{desc}</td>
                  <td>{evidenced}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 8. Range of conditions */}
        <section className="doc-section">
          <h3 className="doc-sec-title">8. Range of conditions</h3>
          <p className="doc-sec-intro">
            The range of conditions specifies the essential operating conditions for this unit. It has exactly two headings in the unit itself: type of optical measurement, and instruments. No wavelength range is specified in the unit's range of conditions (C6); wavelength content used by this RTO is contextualisation, given in AT-ICTBWN307-02 §5 and referenced from §9 below.
          </p>

          <div className="doc-element-subheading">Type of optical measurement must include</div>
          <table className="doc-grid-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Measurement type</th>
                <th>Where assessed</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="font-bold">ONT detection</td><td>O2.9; PE6, PE9</td></tr>
              <tr><td className="font-bold">Absolute optical power (dBm)</td><td>M23; O2.5; PE3, PE10</td></tr>
              <tr><td className="font-bold">Insertion loss (dB)</td><td>M24, S4; O2.6, O2.7; PE4, PE7, PE11</td></tr>
              <tr><td className="font-bold">Relative optical power levels (dB)</td><td>S5; O2.10; PE8, PE12</td></tr>
            </tbody>
          </table>

          <div className="doc-element-subheading">Instruments must include</div>
          <ul style={{ margin: '0 0 0.8rem 0', paddingLeft: '1.2rem', fontSize: '9.5pt' }}>
            <li>Hand-held optical power meter</li>
            <li>Hand-held optical source</li>
            <li>Hand-held optical fibre identifier (OFI-FTTx)</li>
            <li>Active ONT detector</li>
            <li>Optical loss test set (OLTS)</li>
            <li>PON meter</li>
          </ul>

          <div className="doc-warning-box">
            <strong>The range of conditions values above are essential operating conditions specified by the unit of competency. They are not variable by the assessor.</strong>
          </div>

          <div className="doc-element-subheading">RTO contextualisation (not a range of conditions value)</div>
          <p className="doc-sec-intro">
            1310 nm, 1490 nm and 1550 nm, with 1625/1650 nm sometimes used for in-service maintenance testing — RTO contextualisation for the FTTx/GPON access context of this unit, and part of the evidence base for KE7 (M26, S6). This is not a unit range-of-conditions value.
          </p>
        </section>

        {/* 9. Assessment conditions */}
        <section className="doc-section">
          <h3 className="doc-sec-title">9. Assessment conditions</h3>
          <p className="doc-sec-intro">
            This review of the current unit and assessment requirements, and the ICT Training Package Companion Volume Implementation Guide V9.1, confirms no high-risk-work classification, licensing requirement, or additional Companion Volume licensing table entry for this unit — unlike ICTBWN308, which is expressly classified as high-risk work. See section 10 below for the full Companion Volume confirmations.
          </p>
          <table className="doc-grid-table">
            <thead>
              <tr>
                <th style={{ width: '62%' }}>Assessment condition requirement</th>
                <th style={{ width: '18%' }} className="text-center">Confirmed</th>
                <th>Evidence held</th>
              </tr>
            </thead>
            <tbody>
              {[
                'Assessment is conducted in a workplace, or in an environment that simulates a typical telecommunications workplace.',
                'The assessor has access to a site or work area where the measuring instruments can be practically used.',
                'Tools, equipment and plant currently used in industry are available.',
                'Regulatory and equipment documentation relevant to the work is available to the assessor.',
                'The assessor satisfies the assessor requirements in the applicable VET legislation, frameworks and standards.',
              ].map((req, i) => (
                <tr key={i}>
                  <td>{req}</td>
                  <td className="text-center">☐ Yes &nbsp; ☐ No</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 10. Companion Volume Implementation Guide requirements */}
        <section className="doc-section">
          <h3 className="doc-sec-title">10. Companion Volume Implementation Guide requirements</h3>
          <p className="doc-sec-intro">
            Source: ICT Information and Communications Technology Training Package Companion Volume Implementation Guide V9.1, June 2025. Confirmed independently by this RTO, not deferred to a later compliance check, as required by ATR-ICTBWN307-01 finding C11.
          </p>
          <table className="doc-grid-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>CVIG topic</th>
                <th style={{ width: '10%' }}>Page</th>
                <th style={{ width: '38%' }}>Requirement</th>
                <th>Where discharged</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Prerequisite units in the ICT Training Package</td>
                <td className="text-center">83</td>
                <td>ICTBWN307 is not listed as a unit having prerequisites. It is listed, with ICTWHS204, as a prerequisite for ICTBWN308.</td>
                <td>AT-00 §2; AT-ICTBWN307-01 prerequisite confirmation block</td>
              </tr>
              <tr>
                <td className="font-bold">Regulation and licensing implications — high-risk work</td>
                <td className="text-center">89</td>
                <td>The high-risk work list includes ICTBWN308 and does not include ICTBWN307.</td>
                <td>AT-00 §9 and §11 — validation interval and assessment conditions</td>
              </tr>
              <tr>
                <td className="font-bold">Regulation and licensing implications — licensing and registration requirements for assessors</td>
                <td className="text-center">89</td>
                <td>Assessor requirements are those identified in the unit's Assessment Conditions, together with the requirements of the applicable registering body.</td>
                <td>AT-00 §9 assessor row; AT-ICTBWN307-02-AG §1 pre-assessment verification</td>
              </tr>
              <tr>
                <td className="font-bold">Version control and modification history</td>
                <td className="text-center">3</td>
                <td>Current package release is 9.1 (June 2025). Version 9.0 (December 2024) updated telecommunications training products; ICTBWN307 was not among the units changed.</td>
                <td>Revision history of all six documents in this set</td>
              </tr>
            </tbody>
          </table>
          <p className="doc-sec-intro" style={{ marginTop: '0.6rem' }}>
            Scope of registration note: ICTBWN307 has no equivalent unit and supersedes nothing, so no scope transition question arises. Confirm the unit is on the RTO's scope of registration before delivery.
          </p>
        </section>

        {/* 11. Principles of assessment and rules of evidence */}
        <section className="doc-section">
          <h3 className="doc-sec-title">11. Principles of assessment and rules of evidence</h3>
          <table className="doc-grid-table">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Requirement</th>
                <th>How this tool satisfies it</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Validity', "Every performance criterion, performance evidence item and knowledge evidence item is mapped to an instrument by a real, resolvable item code. Performance is assessed by direct observation of the actual task, not by written description of it. The knowledge assessment answer key is distributed across all four options at random (see AT-01-AG), not concentrated on one letter."],
                ['Reliability', 'Benchmark answers and observation benchmarks are specified for every item, so different assessors reach the same judgement on the same evidence.'],
                ['Flexibility', 'Reasonable adjustment is available for the knowledge assessment. No adjustment is available to the range of conditions values or to the requirement for observed instrument operation.'],
                ['Fairness', 'Instructions, conditions and criteria are given to the student before assessment. Reassessment and appeal rights are stated on each instrument.'],
                ['Valid evidence', 'Each instrument assesses what it claims to assess and is mapped in sections 4 to 8.'],
                ['Sufficient evidence', 'Knowledge and observed performance are both collected. Oral questioning during observation confirms understanding underpinning the observed actions.'],
                ['Authentic evidence', 'The knowledge assessment is supervised and closed book. Observation is of the candidate\'s own work. A student declaration is signed on each instrument.'],
                ['Current evidence', 'Assessment is conducted on current equipment against the current unit release.'],
              ].map(([req, how]) => (
                <tr key={req}>
                  <td className="font-bold">{req}</td>
                  <td>{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 12. Validation */}
        <section className="doc-section">
          <h3 className="doc-sec-title">12. Validation</h3>
          <p className="doc-sec-intro">
            This tool is scheduled for validation in accordance with the RTO validation plan.
          </p>
          <div className="doc-warning-box">
            <strong>ICTBWN308 (not this unit) is included in the Companion Volume Implementation Guide's high-risk work list; ICTBWN307 is not (CVIG V9.1, p. 89). ICTBWN307 is therefore validated at the RTO's standard interval: at least 50 per cent of training products validated every three years, and 100 per cent every five years. No shortened, high-risk-work validation interval applies to this unit.</strong>
          </div>
          <table className="doc-grid-table" style={{ marginTop: '0.6rem' }}>
            <thead>
              <tr>
                <th style={{ width: '24%' }}>Validation activity</th>
                <th style={{ width: '16%' }}>Scheduled</th>
                <th style={{ width: '32%' }}>Panel roles</th>
                <th>Outcome record</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Pre-use validation of this tool</td>
                <td>[DATE]</td>
                <td>Lead validator; industry representative; qualified assessor</td>
                <td>Validation Record VR-[NN]</td>
              </tr>
              <tr>
                <td className="font-bold">Post-use validation</td>
                <td>[DATE]</td>
                <td>As above, with assessor judgement sample</td>
                <td>Validation Record VR-[NN]</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 13. Audit evidence guide */}
        <section className="doc-section">
          <h3 className="doc-sec-title">13. Audit evidence guide</h3>
          <p className="doc-sec-intro">
            The following evidence demonstrates that this tool is in use, not merely that it exists.
          </p>
          <ul style={{ margin: '0 0 0.8rem 0', paddingLeft: '1.2rem', fontSize: '9.5pt' }}>
            <li>Completed AT-ICTBWN307-01 papers with assessor marking against the answer guide, showing marked incorrect responses and the feedback given.</li>
            <li>Completed AT-ICTBWN307-02 observation checklists signed and dated by the assessor at the time of observation, not reconstructed afterwards, including the running safety item (O0.1) and the contingency item (O2.4).</li>
            <li>Completed job pack (JP-ICTBWN307-01) for each assessment, showing the specification the candidate's results were judged against.</li>
            <li>Trainer and assessor matrix evidencing the assessor requirements for this unit, with supporting certification.</li>
            <li>Calibration records for the optical test instruments used in assessment, current at each assessment date.</li>
            <li>Validation records showing this tool has been validated, with actions arising closed out.</li>
            <li>At least one record of reassessment, showing the reassessment process was applied as documented.</li>
          </ul>
        </section>

        {/* 14. Unresolved placeholders and dependencies */}
        <section className="doc-section">
          <h3 className="doc-sec-title">14. Unresolved placeholders and dependencies</h3>
          <div className="doc-warning-box" style={{ marginBottom: '0.6rem' }}>
            The following placeholders must be resolved before this document is issued. A bracketed placeholder in an issued document reads at audit as a document that has never been used. This set does not go to the client while this section has an entry in it (ATR-ICTBWN307-01 §10).
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '9.5pt' }}>
            <li><strong>[RTO_ID]</strong> — masthead of every document in this set. Required from the client.</li>
            <li><strong>[RTO_LEGAL_NAME]</strong> — masthead and control table of every document in this set. Confirm against the training.gov.au organisation record, not the logo or the website. Required from the client.</li>
            <li><strong>[DATE_OF_ISSUE]</strong> and <strong>[REVIEW_DATE]</strong> — control table of every document in this set. Each document takes its own review date; the set is not dated to a single one.</li>
            <li><strong>[DATE]</strong> — validation schedule, section 12. Required from the RTO validation plan.</li>
            <li><strong>VR-[NN]</strong> — validation record identifiers, section 12. Required from the validation register.</li>
            <li><strong>[ROLE]</strong> — approver of the control table on every document in this set. Required from the RTO delegations schedule.</li>
            <li>Document identifiers AT-ICTBWN307-00, -01, -01-AG, -02, -02-AG and JP-ICTBWN307-01 must be checked against the RTO document register and reissued if any identifier is already allocated. Retired identifiers are never reused.</li>
            <li>Training and assessment strategy, trainer and assessor matrix, and RTO assessment policy — referenced throughout this set but not supplied and out of scope of ATR-ICTBWN307-01. Required before this set is issued.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}