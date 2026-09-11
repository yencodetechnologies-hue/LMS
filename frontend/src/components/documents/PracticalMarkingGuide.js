import React from 'react';
import { Printer } from 'lucide-react';
import '../../styles/PracticalMarkingGuide.css';

export default function PracticalMarkingGuideTab({ course }) {
  const courseTitle = 'ICTBWN307 Use optical measuring instruments — Assessor use only. Not for issue to students.';


  return (
    <div className="practical-marking-wrapper">
      {/* Top Floating Action Button */}
     

      {/* Printable Sheet */}
      <div id="printable-marking-guide" className="pmg-document-sheet">
        {/* Top Running Header */}
        <div className="pmg-running-header">
          [RTO_LEGAL_NAME] | RTO [RTO_ID] — Practical Assessment Observation Checklist and Marking Guide (AT-ICTBWN307-02-AG)[cite: 5]
        </div>

        {/* Masthead Banner */}
        <div className="pmg-masthead-banner">
          <div className="pmg-banner-logo">[LOGO]</div>
          <div className="pmg-banner-content">
            <span className="pmg-banner-subtitle">[RTO_LEGAL_NAME] | RTO [RTO_ID]</span>
            <h1 className="pmg-banner-heading">Practical Assessment — Observation Checklist and Marking Guide</h1>
          </div>
        </div>

        <h2 className="pmg-unit-title-row">{courseTitle}</h2>

        {/* Document Control Table */}
        <table className="pmg-control-table">
          <tbody>
            <tr>
              <th style={{ width: '22%' }}>Document ID</th>
              <td style={{ width: '28%' }}>AT-ICTBWN307-02-AG</td>
              <th style={{ width: '22%' }}>Version</th>
              <td style={{ width: '28%' }}>1.0</td>
            </tr>
            <tr>
              <th>Document owner</th>
              <td>Compliance Manager</td>
              <th>Status</th>
              <td><span className="pmg-badge-draft">DRAFT — not for issue</span></td>
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
        <section className="pmg-section">
          <h3 className="pmg-sec-title">Revision history</h3>
          <table className="pmg-grid-table">
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
                  First issue. Developed against ICTBWN307 Release 1, as included in ICT Training Package Release 9.1; unit first released with Training Package Version 5.0[cite: 5].
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Instructions to the Assessor */}
        <section className="pmg-section">
          <h3 className="pmg-sec-title">Instructions to the assessor</h3>
          <div className="pmg-callout-box">
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              <li>Complete this checklist during the observation, not afterwards[cite: 5]. A checklist reconstructed from memory is not authentic evidence and will not survive validation[cite: 5].</li>
              <li>Every observation item must be judged satisfactory for the task to be satisfactory[cite: 5]. There is no partial result[cite: 5].</li>
              <li>Judge against the benchmark stated for each item[cite: 5]. Where an item is not yet satisfactory, record what the candidate did, not merely that they failed[cite: 5].</li>
              <li>The running safety item (O0.1) is assessed continuously across Stages 1–3, not only at the hazard identification step[cite: 5]. Tick it only once, at the end, based on conduct across the whole task[cite: 5].</li>
              <li>The contingency item (O2.4) requires you to introduce the condition described in section 4 of this guide[cite: 5]. Do not skip it and do not tell the candidate it is coming[cite: 5].</li>
              <li>Ask the oral questions in section 6 at the points indicated, using the item code shown (Q1–Q6)[cite: 5]. They confirm the understanding underpinning the observed action and are part of the evidence[cite: 5].</li>
              <li>Stop the assessment immediately for any unsafe act, or any act that risks disconnecting or disrupting a live customer service[cite: 5]. Record the act and the point at which the assessment was stopped[cite: 5]. Do not allow the candidate to continue and correct it[cite: 5].</li>
            </ul>
          </div>
        </section>

        {/* Section 1 — Pre-assessment verification */}
        <section className="pmg-section">
          <h3 className="pmg-sec-title">1. Pre-assessment verification</h3>
          <table className="pmg-grid-table">
            <thead>
              <tr>
                <th style={{ width: '60%' }}>Requirement</th>
                <th style={{ width: '22%' }} className="text-center">Confirmed</th>
                <th>Evidence / date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>All six instrument types available (power meter, source, fibre identifier, ONT detector, OLTS, PON meter)[cite: 5]</td>
                <td className="text-center">☐ Yes &nbsp; ☐ No[cite: 5]</td>
                <td></td>
              </tr>
              <tr>
                <td>Test instruments within calibration[cite: 5]</td>
                <td className="text-center">☐ Yes &nbsp; ☐ No[cite: 5]</td>
                <td></td>
              </tr>
              <tr>
                <td>Industry-current tools, test equipment and PPE available[cite: 5]</td>
                <td className="text-center">☐ Yes &nbsp; ☐ No[cite: 5]</td>
                <td></td>
              </tr>
              <tr>
                <td>Regulatory and equipment documentation available[cite: 5]</td>
                <td className="text-center">☐ Yes &nbsp; ☐ No[cite: 5]</td>
                <td></td>
              </tr>
              <tr>
                <td>Job pack (JP-ICTBWN307-01) prepared for this candidate, with link design loss budget and acceptance limits completed[cite: 5]</td>
                <td className="text-center">☐ Yes &nbsp; ☐ No[cite: 5]</td>
                <td></td>
              </tr>
              <tr>
                <td>Assessor meets the assessor requirements applicable to this unit[cite: 5]</td>
                <td className="text-center">☐ Yes &nbsp; ☐ No[cite: 5]</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 2 — Workplace simulation criteria */}
        <section className="pmg-section">
          <h3 className="pmg-sec-title">2. Workplace simulation criteria</h3>
          <p className="pmg-sec-intro">
            AT-ICTBWN307-02 §2 permits assessment in a simulated environment[cite: 5]. Complete this section only where assessment is not conducted in a live workplace[cite: 5]. Every criterion below must be met for the simulated environment to be adequate[cite: 5].
          </p>

          <table className="pmg-grid-table">
            <thead>
              <tr>
                <th style={{ width: '65%' }}>Simulation criterion</th>
                <th style={{ width: '15%' }} className="text-center">Met</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A realistic fibre distribution point or hub is represented, with equipment representative of an in-service FTTx access network[cite: 5].</td>
                <td className="text-center">☐ Yes &nbsp; ☐ No[cite: 5]</td>
                <td></td>
              </tr>
              <tr>
                <td>A live or realistically simulated optical signal is present for the ONT-detection and live-traffic-identification tasks[cite: 5].</td>
                <td className="text-center">☐ Yes &nbsp; ☐ No[cite: 5]</td>
                <td></td>
              </tr>
              <tr>
                <td>All six instrument types are available and operable under realistic conditions, not demonstrated on a bench rig alone[cite: 5].</td>
                <td className="text-center">☐ Yes &nbsp; ☐ No[cite: 5]</td>
                <td></td>
              </tr>
              <tr>
                <td>The job pack and reference documentation are available exactly as they would be on a real job, not summarised or simplified for the simulation[cite: 5].</td>
                <td className="text-center">☐ Yes &nbsp; ☐ No[cite: 5]</td>
                <td></td>
              </tr>
              <tr>
                <td>Site access, notification and work-area clean-up procedures can be genuinely enacted, not merely described by the candidate[cite: 5].</td>
                <td className="text-center">☐ Yes &nbsp; ☐ No[cite: 5]</td>
                <td></td>
              </tr>
              <tr>
                <td>The environment allows an unscripted contingency (section 4 below) to be introduced authentically[cite: 5].</td>
                <td className="text-center">☐ Yes &nbsp; ☐ No[cite: 5]</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: '8pt', fontStyle: 'italic', color: '#555', marginTop: '0.4rem' }}>
            If any criterion above is not met, the simulated environment is not adequate for this assessment[cite: 5]. A result recorded in an inadequate environment is not valid and is not recoverable after the fact — the assessment must be repeated in an adequate environment or in the workplace, not annotated after the event[cite: 5].
          </p>
        </section>

        {/* Section 3 — Observation checklist */}
        <section className="pmg-section">
          <h3 className="pmg-sec-title">3. Observation checklist</h3>
          <p className="pmg-sec-intro"><strong>S = satisfactory. NYS = not yet satisfactory.[cite: 5]</strong></p>

          <div className="pmg-element-subheading">Running safety — assessed throughout the task (tick once, at the end)[cite: 5]</div>
          <table className="pmg-grid-table">
            <thead>
              <tr>
                <th style={{ width: '8%' }}>Ref</th>
                <th style={{ width: '42%' }}>The candidate...</th>
                <th style={{ width: '12%' }}>Maps to</th>
                <th>Assessor benchmark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-center">O0.1[cite: 5]</td>
                <td>Maintains safe practice throughout the task — not viewing an energised fibre end or connector, capping unmated connectors, and containing fibre offcuts at the point of generation[cite: 5]</td>
                <td>PE1[cite: 5]</td>
                <td>
                  Safe practice maintained throughout, not only at the hazard identification step[cite: 5]. Reliance on the preparation-stage risk assessment alone is not satisfactory[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="pmg-element-subheading">Stage 1 — Prepare to use optical measuring instruments[cite: 5]</div>
          <table className="pmg-grid-table">
            <thead>
              <tr>
                <th style={{ width: '8%' }}>Ref</th>
                <th style={{ width: '42%' }}>The candidate...</th>
                <th style={{ width: '12%' }}>Maps to</th>
                <th>Assessor benchmark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-center">O1.1[cite: 5]</td>
                <td>Obtains approval to enter the site from the customer, site owner or appropriate personnel before commencing work[cite: 5]</td>
                <td>PC 1.1[cite: 5]</td>
                <td>
                  Approval obtained and confirmed before site entry, not on arrival[cite: 5]. Candidate can state who gave approval and how it was recorded[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O1.2[cite: 5]</td>
                <td>Identifies the test purpose and the type of measurement required for the job[cite: 5]</td>
                <td>PC 1.2[cite: 5]</td>
                <td>
                  Candidate correctly states, from the job pack, which measurement type(s) are required and why[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O1.3[cite: 5]</td>
                <td>Selects tools and instruments appropriate to the measurement requirements[cite: 5]</td>
                <td>PC 1.3[cite: 5]</td>
                <td>
                  Instruments selected match the measurement types identified at O1.2[cite: 5]. No unnecessary or missing instrument[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O1.4[cite: 5]</td>
                <td>Verifies that each instrument's calibration is current and within acceptable limits[cite: 5]</td>
                <td>PC 1.4 / PE2[cite: 5]</td>
                <td>
                  Calibration label or register physically checked for every instrument selected, before use[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O1.5[cite: 5]</td>
                <td>Identifies hazards, assesses WHS risks and implements control measures in consultation with relevant personnel[cite: 5]</td>
                <td>PC 1.5 / PE1[cite: 5]</td>
                <td>
                  Hazards specific to this job identified, not only generic site hazards[cite: 5]. Controls implemented, not merely listed[cite: 5]. Consultation with relevant personnel evident[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="pmg-element-subheading page-break-before">Stage 2 — Conduct optical measurements[cite: 5]</div>
          <table className="pmg-grid-table">
            <thead>
              <tr>
                <th style={{ width: '8%' }}>Ref</th>
                <th style={{ width: '42%' }}>The candidate...</th>
                <th style={{ width: '12%' }}>Maps to</th>
                <th>Assessor benchmark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-center">O2.1[cite: 5]</td>
                <td>Sets up equipment according to manufacturer instructions, enterprise procedures and safe industry practices[cite: 5]</td>
                <td>PC 2.1[cite: 5]</td>
                <td>
                  Set-up sequence follows the manufacturer instruction sheet or enterprise procedure without prompting, and safe industry practice (e.g. PPE, safe handling of live equipment) is observed during set-up[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O2.2[cite: 5]</td>
                <td>Verifies that optical patch cords are functioning correctly before use[cite: 5]</td>
                <td>PC 2.2[cite: 5]</td>
                <td>
                  Patch cords checked for continuity/condition before being relied on for a measurement[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O2.3[cite: 5]</td>
                <td>Inspects and cleans optical connectors[cite: 5]</td>
                <td>PC 2.3 / KE4[cite: 5]</td>
                <td>
                  End-face inspected first; cleaned only if contamination or a defect is visible; re-inspected before mating[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O2.4[cite: 5]</td>
                <td>Detects and correctly responds to an unscripted contingency introduced during the task[cite: 5]</td>
                <td>PC 2.3, PC 2.4[cite: 5]</td>
                <td>
                  Candidate identifies the anomalous reading, returns to inspection and cleaning (or other diagnostic step), and re-measures rather than recording the bad result[cite: 5].
                  <div style={{ fontSize: '8pt', color: '#555', marginTop: '0.3rem' }}><em>Contingency note: after O2.2 is completed, substitute a patch cord with a contaminated or damaged end-face.[cite: 5]</em></div>
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O2.5[cite: 5]</td>
                <td>Uses the hand-held optical power meter to measure absolute optical power at the nominated test point[cite: 5]</td>
                <td>PC 2.4 / PE3, PE10[cite: 5]</td>
                <td>
                  Meter set to correct wavelength[cite: 5]. Reading taken, recorded in dBm, and compared against specification[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O2.6[cite: 5]</td>
                <td>Uses the optical source with a power meter to measure insertion loss on the link[cite: 5]</td>
                <td>PC 2.4 / PE4, PE11[cite: 5]</td>
                <td>
                  Correct reference method used[cite: 5]. Loss calculated correctly in dB and compared against specification[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O2.7[cite: 5]</td>
                <td>Uses the OLTS to measure insertion loss on the link[cite: 5]</td>
                <td>PC 2.4 / PE7, PE11[cite: 5]</td>
                <td>
                  OLTS set up and operated correctly as a discrete instrument[cite: 5]. Loss recorded in dB and compared against specification[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O2.8[cite: 5]</td>
                <td>Uses the fibre identifier to confirm live traffic in the nominated fibre, without breaking the connection[cite: 5]</td>
                <td>PC 2.4 / PE5[cite: 5]</td>
                <td>
                  Clamp-on technique used correctly[cite: 5]. Candidate correctly states whether the fibre is live and in which direction[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O2.9[cite: 5]</td>
                <td>Uses the ONT detector to confirm the presence of an active ONT on the line[cite: 5]</td>
                <td>PC 2.4 / PE6, PE9[cite: 5]</td>
                <td>
                  Correct connection point used[cite: 5]. Candidate correctly reports whether an active ONT was detected[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O2.10[cite: 5]</td>
                <td>Uses the PON meter to measure relative optical power levels on the live PON[cite: 5]</td>
                <td>PC 2.4 / PE8, PE12[cite: 5]</td>
                <td>
                  Correct wavelength(s) selected[cite: 5]. Reading taken without interrupting traffic, recorded in dB, and compared against specification[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O2.11[cite: 5]</td>
                <td>Records and interprets all results against the relevant standards and specifications[cite: 5]</td>
                <td>PC 2.5[cite: 5]</td>
                <td>
                  Record includes wavelength, unit, instrument identification and calibration status, with a pass/fail determination for every reading[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="pmg-element-subheading">Stage 3 — Complete optical measurement process[cite: 5]</div>
          <table className="pmg-grid-table">
            <thead>
              <tr>
                <th style={{ width: '8%' }}>Ref</th>
                <th style={{ width: '42%' }}>The candidate...</th>
                <th style={{ width: '12%' }}>Maps to</th>
                <th>Assessor benchmark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-center">O3.1[cite: 5]</td>
                <td>Recommends follow-up actions based on the results obtained, to achieve optimal system performance[cite: 5]</td>
                <td>PC 3.1[cite: 5]</td>
                <td>
                  Recommendation follows logically from results recorded at O2.11[cite: 5]. Marginal or failing result identified, not passed over[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O3.2[cite: 5]</td>
                <td>Notifies the customer or appropriate personnel of work completion[cite: 5]</td>
                <td>PC 3.2[cite: 5]</td>
                <td>
                  Notification made by method required, and recorded[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-center">O3.3[cite: 5]</td>
                <td>Cleans the work area and makes it safe according to enterprise procedures[cite: 5]</td>
                <td>PC 3.3[cite: 5]</td>
                <td>
                  Work area left in a safe condition — offcuts contained, enclosures secured, unmated connectors capped[cite: 5]. Cleaning alone is insufficient[cite: 5].
                  <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>☐ S &nbsp;&nbsp;&nbsp;&nbsp; ☐ NYS[cite: 5]</div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 4 — Integrated assessment dimensions */}
        <section className="pmg-section">
          <h3 className="pmg-sec-title">4. Integrated assessment dimensions</h3>
          <p className="pmg-sec-intro">
            This task integrates the four dimensions of competency, rather than assessing them as separate items[cite: 5]. Use this section to confirm all four were evidenced across the observation checklist above, not to record a separate result[cite: 5].
          </p>

          <table className="pmg-grid-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Dimension</th>
                <th style={{ width: '45%' }}>What it means here</th>
                <th>Evidenced by</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Task skills[cite: 5]</td>
                <td>Performing each individual measurement correctly, to standard[cite: 5].</td>
                <td>O1.1–O3.3 (all items)[cite: 5]</td>
              </tr>
              <tr>
                <td className="font-bold">Task management skills[cite: 5]</td>
                <td>Sequencing preparation, measurement and completion within time allowed[cite: 5].</td>
                <td>Whole-task observation; O2.11 record and interpretation[cite: 5]</td>
              </tr>
              <tr>
                <td className="font-bold">Contingency management skills[cite: 5]</td>
                <td>Detecting and correctly responding to an unscripted condition[cite: 5].</td>
                <td>O2.4 — unscripted contingency[cite: 5]</td>
              </tr>
              <tr>
                <td className="font-bold">Job/role environment skills[cite: 5]</td>
                <td>Complying with WHS, site and enterprise procedures throughout[cite: 5].</td>
                <td>O0.1, O1.5, O3.2, O3.3[cite: 5]</td>
              </tr>
            </tbody>
          </table>
          <div style={{ fontWeight: 700, marginTop: '0.5rem' }}>
            ☐ All four dimensions were evidenced across the observation checklist for this candidate.[cite: 5]
          </div>
        </section>

        {/* Section 5 — Range of conditions verification */}
        <section className="pmg-section page-break-before">
          <h3 className="pmg-sec-title">5. Range of conditions verification</h3>
          <p className="pmg-sec-intro">
            Confirm that every range of conditions value was actually exercised during this assessment — the student-completed test results record (AT-ICTBWN307-02 §6) is not itself checked against the range of conditions anywhere else in this set[cite: 5].
          </p>

          <h4 style={{ fontSize: '10pt', color: '#6d1327', margin: '0.75rem 0 0.3rem 0' }}>Measurement types</h4>
          <table className="pmg-grid-table">
            <thead>
              <tr>
                <th style={{ width: '70%' }}>Measurement type</th>
                <th style={{ width: '15%' }} className="text-center">Confirmed</th>
                <th>Evidence (result reference)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ONT detection[cite: 5]</td>
                <td className="text-center">☐</td>
                <td></td>
              </tr>
              <tr>
                <td>Absolute optical power (dBm)[cite: 5]</td>
                <td className="text-center">☐</td>
                <td></td>
              </tr>
              <tr>
                <td>Insertion loss (dB)[cite: 5]</td>
                <td className="text-center">☐</td>
                <td></td>
              </tr>
              <tr>
                <td>Relative optical power levels (dB)[cite: 5]</td>
                <td className="text-center">☐</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <h4 style={{ fontSize: '10pt', color: '#6d1327', margin: '0.75rem 0 0.3rem 0' }}>Instruments and wavelengths used</h4>
          <table className="pmg-grid-table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Instrument</th>
                <th style={{ width: '30%' }}>Wavelength(s) used</th>
                <th style={{ width: '20%' }} className="text-center">Confirmed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hand-held optical power meter[cite: 5]</td>
                <td></td>
                <td className="text-center">☐</td>
              </tr>
              <tr>
                <td>Hand-held optical source[cite: 5]</td>
                <td></td>
                <td className="text-center">☐</td>
              </tr>
              <tr>
                <td>Hand-held optical fibre identifier (OFI-FTTx)[cite: 5]</td>
                <td></td>
                <td className="text-center">☐</td>
              </tr>
              <tr>
                <td>Active ONT detector[cite: 5]</td>
                <td></td>
                <td className="text-center">☐</td>
              </tr>
              <tr>
                <td>Optical loss test set (OLTS)[cite: 5]</td>
                <td></td>
                <td className="text-center">☐</td>
              </tr>
              <tr>
                <td>PON meter[cite: 5]</td>
                <td></td>
                <td className="text-center">☐</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 6 — Oral questions during observation */}
        <section className="pmg-section page-break-before">
          <h3 className="pmg-sec-title">6. Oral questions during observation</h3>
          <p className="pmg-sec-intro">Ask each question at the point indicated, using the item code shown. Record substance of answers[cite: 5].</p>

          <table className="pmg-grid-table">
            <thead>
              <tr>
                <th style={{ width: '6%' }}>ID</th>
                <th style={{ width: '12%' }}>Ask at</th>
                <th style={{ width: '32%' }}>Question / Expected response</th>
                <th style={{ width: '38%' }}>Assessor record</th>
                <th style={{ width: '12%' }} className="text-center">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-center">Q1[cite: 5]</td>
                <td>Stage 1[cite: 5]</td>
                <td>
                  <strong>Q:</strong> What approval did you need before starting work at this site, and who did you get it from?[cite: 5]<br /><br />
                  <em>Expected:</em> Names customer/site owner and how approval was obtained[cite: 5].
                </td>
                <td></td>
                <td className="text-center">☐ S<br />☐ NYS[cite: 5]</td>
              </tr>
              <tr>
                <td className="font-bold text-center">Q2[cite: 5]</td>
                <td>Stage 1[cite: 5]</td>
                <td>
                  <strong>Q:</strong> How do you know this instrument's calibration is current?[cite: 5]<br /><br />
                  <em>Expected:</em> Checking label/register before use[cite: 5].
                </td>
                <td></td>
                <td className="text-center">☐ S<br />☐ NYS[cite: 5]</td>
              </tr>
              <tr>
                <td className="font-bold text-center">Q3[cite: 5]</td>
                <td>Stage 2[cite: 5]</td>
                <td>
                  <strong>Q:</strong> Why did you inspect and clean this connector before mating it?[cite: 5]<br /><br />
                  <em>Expected:</em> Explains loss/damage risks and inspect-clean sequence[cite: 5].
                </td>
                <td></td>
                <td className="text-center">☐ S<br />☐ NYS[cite: 5]</td>
              </tr>
              <tr>
                <td className="font-bold text-center">Q4[cite: 5]</td>
                <td>Stage 2[cite: 5]</td>
                <td>
                  <strong>Q:</strong> What wavelength is this instrument set to, and why does that matter?[cite: 5]<br /><br />
                  <em>Expected:</em> Calibration responsivity factor reasoning[cite: 5].
                </td>
                <td></td>
                <td className="text-center">☐ S<br />☐ NYS[cite: 5]</td>
              </tr>
              <tr>
                <td className="font-bold text-center">Q5[cite: 5]</td>
                <td>Stage 3[cite: 5]</td>
                <td>
                  <strong>Q:</strong> Your reading is close to the minimum limit. What do you record, and what do you do next?[cite: 5]<br /><br />
                  <em>Expected:</em> Marginal note, re-measure, escalate[cite: 5].
                </td>
                <td></td>
                <td className="text-center">☐ S<br />☐ NYS[cite: 5]</td>
              </tr>
              <tr>
                <td className="font-bold text-center">Q6[cite: 5]</td>
                <td>Stage 3[cite: 5]</td>
                <td>
                  <strong>Q:</strong> Why do you notify the customer and clean the work area before finishing?[cite: 5]<br /><br />
                  <em>Expected:</em> Professional handover and safety standards[cite: 5].
                </td>
                <td></td>
                <td className="text-center">☐ S<br />☐ NYS[cite: 5]</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section 7, 8 & 9 */}
        <section className="pmg-section page-break-before">
          <h3 className="pmg-sec-title">7. Critical safety stop record</h3>
          <table className="pmg-control-table">
            <tbody>
              <tr>
                <th style={{ width: '22%' }}>Time stopped[cite: 5]</th>
                <th style={{ width: '48%' }}>Act observed and risk created[cite: 5]</th>
                <th>Action taken[cite: 5]</th>
              </tr>
              <tr>
                <td style={{ height: '40px' }}></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: '8pt', fontStyle: 'italic', color: '#666' }}>An assessment stopped for safety is recorded as not yet satisfactory[cite: 5].</p>

          <h3 className="pmg-sec-title" style={{ marginTop: '1.5rem' }}>8. Assessment outcome</h3>
          <table className="pmg-control-table">
            <tbody>
              <tr>
                <th style={{ width: '35%' }}>Outcome[cite: 5]</th>
                <th style={{ width: '45%' }}>Assessor signature[cite: 5]</th>
                <th style={{ width: '20%' }}>Date[cite: 5]</th>
              </tr>
              <tr>
                <td style={{ height: '45px', verticalAlign: 'middle' }}>☐ Satisfactory &nbsp; ☐ Not yet satisfactory[cite: 5]</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: '9pt', fontWeight: 600 }}>Feedback provided to the student:</p>
          <div style={{ height: '60px', border: '1px solid #000', marginBottom: '1.5rem' }}></div>

          <h3 className="pmg-sec-title">9. Unit outcome</h3>
          <table className="pmg-control-table">
            <thead>
              <tr>
                <th style={{ width: '55%' }}>Requirement[cite: 5]</th>
                <th style={{ width: '25%' }}>Outcome[cite: 5]</th>
                <th>Date[cite: 5]</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AT-ICTBWN307-01 Knowledge Assessment[cite: 5]</td>
                <td>☐ S &nbsp;&nbsp; ☐ NYS[cite: 5]</td>
                <td></td>
              </tr>
              <tr>
                <td>AT-ICTBWN307-02 Practical Assessment[cite: 5]</td>
                <td>☐ S &nbsp;&nbsp; ☐ NYS[cite: 5]</td>
                <td></td>
              </tr>
              <tr>
                <td className="font-bold">ICTBWN307 unit result[cite: 5]</td>
                <td className="font-bold">☐ Competent &nbsp;&nbsp; ☐ Not yet competent[cite: 5]</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}