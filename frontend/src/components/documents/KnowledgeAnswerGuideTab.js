import React from 'react';
import '../../styles/KnowledgeAnswerGuide.css';

export default function KnowledgeAnswerGuideTab({ course }) {
  
  return (
    <div className="ans-guide-sec">
      {/* Top Action Button */}
      {/* <div style={{ maxWidth: '840px', width: '100%', margin: '0 auto 1rem auto', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={handlePrint}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
        >
          <Printer size={15} /> Print Guide
        </button>
      </div> */}

      {/* Printable Sheet */}
      <div id="printable-answer-guide" className="a4-document-sheet">
        {/* Top Running Rule */}
        <div className="doc-running-header">
          [RTO_LEGAL_NAME] | RTO [RTO_ID] — Knowledge Assessment Answer Guide (AT-ICTBWN307-01-AG)[cite: 3]
        </div>

        {/* Masthead Banner */}
        <div className="doc-masthead-banner">
          <div className="doc-banner-logo">[LOGO]</div>
          <div className="doc-banner-content">
            <span className="doc-banner-subtitle">[RTO_LEGAL_NAME] | RTO [RTO_ID]</span>
            <h1 className="doc-banner-heading">Knowledge Assessment — Answer Guide</h1>
          </div>
        </div>

        <h2 className="doc-unit-title-row">ICTBWN307 Use optical measuring instruments — Assessor use only. Not for issue to students.</h2>

        {/* Document Control Table */}
        <table className="doc-control-table">
          <tbody>
            <tr>
              <th style={{ width: '22%' }}>Document ID</th>
              <td style={{ width: '28%' }}>AT-ICTBWN307-01-AG</td>
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
                  First issue. Developed against ICTBWN307 Release 1, as included in ICT Training Package Release 9.1; unit first released with Training Package Version 5.0[cite: 3].
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Instructions to the Assessor */}
        <section className="doc-section">
          <h3 className="doc-sec-title">Instructions to the assessor</h3>
          <div className="doc-callout-box">
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              <li>This guide is confidential and is not issued to students. Store it separately from the student assessment[cite: 3].</li>
              <li>The model answer sets out a complete correct response[cite: 3]. The benchmark states the minimum required for a satisfactory judgement[cite: 3]. Judge against the benchmark, not against the full model answer[cite: 3].</li>
              <li>A student may express an answer differently from the model[cite: 3]. Accept any response that meets the benchmark[cite: 3].</li>
              <li>Item S4 evidences the numeracy foundation skill[cite: 3]. Working must be shown[cite: 3]. A correct answer with no working is not yet satisfactory[cite: 3].</li>
              <li>Item S5 evidences evaluative judgement against a specification[cite: 3]. A student who answers "pass" without identifying the result as marginal has not met the requirement[cite: 3].</li>
              <li>Item M27 is a deliberate trap item testing dB/dBm confusion (KE5)[cite: 3]. If a student selects it correctly, cross-check against M23/M24 and ask a follow-up question if in doubt[cite: 3].</li>
              <li>Record specific feedback against any question judged not yet satisfactory[cite: 3]. "Incorrect" is not feedback and will not satisfy an audit[cite: 3].</li>
              <li>All 33 items must be satisfactory[cite: 3]. Reassessment is on the items not yet satisfactory, not the whole paper[cite: 3].</li>
              <li>Where a student selects an incorrect option in Part A, give the distractor note for that option as feedback[cite: 3].</li>
            </ul>
          </div>
        </section>

        {/* Knowledge Evidence Coverage */}
        <section className="doc-section page-break-before">
          <h3 className="doc-sec-title">Knowledge evidence coverage</h3>
          <p className="doc-sec-intro">
            Every knowledge evidence item is addressed by the items shown[cite: 3]. This table is identical to AT-00 §6[cite: 3].
          </p>
          <table className="doc-grid-table">
            <thead>
              <tr>
                <th style={{ width: '12%' }}>Ref</th>
                <th style={{ width: '60%' }}>Knowledge evidence requirement</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="font-bold text-center">KE1</td><td>site-specific safety requirements and enterprise WHS processes and procedures[cite: 3]</td><td>M1, M2, M3, M4, S1[cite: 3]</td></tr>
              <tr><td className="font-bold text-center">KE2</td><td>instruments used in measuring optical power levels[cite: 3]</td><td>M5, M6, M7, M8, M9, M10, S2[cite: 3]</td></tr>
              <tr><td className="font-bold text-center">KE3</td><td>types of measurements and their respective interpretation for optical wavelengths[cite: 3]</td><td>M11, M12, M13, M14, S5, S6[cite: 3]</td></tr>
              <tr><td className="font-bold text-center">KE4</td><td>consequences of mating contaminated optical connectors[cite: 3]</td><td>M15, M16, S3[cite: 3]</td></tr>
              <tr><td className="font-bold text-center">KE5</td><td>data recording using unit decibels (dBm)[cite: 3]</td><td>M14, M23, M24, M25, M27, S4[cite: 3]</td></tr>
              <tr><td className="font-bold text-center">KE6</td><td>variations between optical connector adaptor types[cite: 3]</td><td>M17, M18, M21, M22[cite: 3]</td></tr>
              <tr><td className="font-bold text-center">KE7</td><td>optical spectrum limits and allocations[cite: 3]</td><td>M10, M26, S6[cite: 3]</td></tr>
              <tr><td className="font-bold text-center">KE8</td><td>safe handling procedures with optical fibres[cite: 3]</td><td>M16, M19, M20, S3[cite: 3]</td></tr>
            </tbody>
          </table>
        </section>

        {/* Why Six Items Remain Short Answer */}
        <section className="doc-section">
          <h3 className="doc-sec-title">Why six items remain short answer</h3>
          <table className="doc-grid-table">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>Item</th>
                <th style={{ width: '32%' }}>Requirement</th>
                <th>Why it cannot be converted to multiple choice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-center">S1</td>
                <td>KE1 recall[cite: 3]</td>
                <td>Requires recall and location of four distinct organisational/site requirements, not selection from a supplied set[cite: 3].</td>
              </tr>
              <tr>
                <td className="font-bold text-center">S2</td>
                <td>KE2, and knowledge-side support for PE3–PE8[cite: 3]</td>
                <td>Recall of a complete set of six instruments with a stated purpose for each[cite: 3]. A 4-option item tests only one instrument[cite: 3].</td>
              </tr>
              <tr>
                <td className="font-bold text-center">S3</td>
                <td>KE4, KE8 explanation[cite: 3]</td>
                <td>Requires an explanation of a causal mechanism plus an ordered three-step procedure in the candidate's own words[cite: 3].</td>
              </tr>
              <tr>
                <td className="font-bold text-center">S4</td>
                <td>Numeracy foundation skill[cite: 3]</td>
                <td>The only item in the set requiring calculation[cite: 3]. Written working is the primary evidence for this skill[cite: 3].</td>
              </tr>
              <tr>
                <td className="font-bold text-center">S5</td>
                <td>Evaluative judgement (KE3)[cite: 3]</td>
                <td>Requires recognizing a technically-passing result as marginal and proposing investigative action[cite: 3].</td>
              </tr>
              <tr>
                <td className="font-bold text-center">S6</td>
                <td>KE7 recall, KE3 explanation[cite: 3]</td>
                <td>Requires stating multiple wavelengths from memory and explaining a causal mechanism in own words[cite: 3].</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ================= PART A — MULTIPLE CHOICE ANSWER KEY ================= */}
        <section className="doc-section page-break-before">
          <h3 className="doc-sec-title" style={{ fontSize: '13pt' }}>Part A — Multiple choice answer key</h3>
          <p className="doc-sec-intro">
            The rationale column states why the key is correct[cite: 3]. Distractor notes explain why incorrect options are wrong so assessor feedback is specific[cite: 3].
          </p>

          <div className="doc-warning-box">
            <strong>Answer key distribution check:</strong> A=7, B=6, C=7, D=7 of 27 items[cite: 3]. Randomly spread across all four options[cite: 3].
          </div>

          <div className="doc-element-subheading">Section A — Preparation and safety</div>

          <MCQBenchmark
            title="M1. Before entering a customer's or site owner's premises to take optical measurements, what must you obtain first?"
            ke="Knowledge evidence: KE1"
            options={[
              { opt: 'A', text: "A copy of the customer's WHS policy", verdict: 'Incorrect', note: 'A WHS policy document does not substitute for site approval, and having a copy does not mean approval was sought.' },
              { opt: 'B', text: 'Approval to enter the site from the customer, site owner or other appropriate personnel', verdict: 'CORRECT', note: 'PC 1.1 requires approval for site access to be obtained from the customer or site owner prior to site entry — not simply on arrival, and not once work has already begun.' },
              { opt: 'C', text: 'A signed test result sheet from the previous visit', verdict: 'Incorrect', note: "A previous test result has no bearing on today's approval to enter the site." },
              { opt: 'D', text: 'Confirmation that the fibre is dark', verdict: 'Incorrect', note: 'Confirming a fibre is dark is a live-work safety check, not the site-entry approval required by PC 1.1.' },
            ]}
          />

          <MCQBenchmark
            title="M2. Which of the following is a site-specific safety requirement you must confirm before starting optical measurement work, in addition to your organisation's general WHS procedures?"
            ke="Knowledge evidence: KE1"
            options={[
              { opt: 'A', text: "The customer's preferred appointment time", verdict: 'Incorrect', note: 'Appointment time is a scheduling matter, not a safety requirement.' },
              { opt: 'B', text: "Relying on your organisation's general WHS procedure alone, since it already covers every site", verdict: 'Incorrect', note: 'General WHS procedure does not capture hazards, access restrictions or induction requirements specific to an individual site.' },
              { opt: 'C', text: "Whatever the previous technician mentions verbally, without checking the site's own induction or hazard documentation", verdict: 'Incorrect', note: "A verbal handover is not a substitute for checking the site's own current induction and hazard documentation." },
              { opt: 'D', text: 'Any site-specific hazards, access restrictions or induction requirements that apply at that location', verdict: 'CORRECT', note: 'Knowledge evidence requires understanding site-specific safety requirements, which sit alongside general organisational WHS procedure.' },
            ]}
          />

          <MCQBenchmark
            title="M3. Who is responsible for identifying hazards and assessing WHS risks before optical measurement work begins?"
            ke="Knowledge evidence: KE1"
            options={[
              { opt: 'A', text: 'The technician, in consultation with relevant personnel', verdict: 'CORRECT', note: 'PC 1.5 places this responsibility on the technician, exercised in consultation with relevant personnel.' },
              { opt: 'B', text: 'The customer only', verdict: 'Incorrect', note: 'The customer is not the party performing the work and cannot discharge this duty alone.' },
              { opt: 'C', text: 'The instrument manufacturer', verdict: 'Incorrect', note: "A manufacturer's documentation informs the assessment; it does not perform it." },
              { opt: 'D', text: 'Nobody; risk assessment is only required for live connection work', verdict: 'Incorrect', note: 'Hazard identification is required for measurement work generally, not only for live connections.' },
            ]}
          />

          <MCQBenchmark
            title="M4. You are working at a fibre distribution hub and identify a hazard: bare optical fibre offcuts left on the bench from a previous job. Which control measure is appropriate, and who must agree it?"
            ke="Knowledge evidence: KE1"
            options={[
              { opt: 'A', text: 'Sweep the offcuts onto the floor and continue the job; no agreement is needed since this is a minor housekeeping issue', verdict: 'Incorrect', note: 'Leaving glass fragments on the floor increases the puncture hazard rather than controlling it.' },
              { opt: 'B', text: 'Leave the offcuts for the next technician rostered to the site; hazard control is not your responsibility once your own task is complete', verdict: 'Incorrect', note: 'Responsibility for controlling a hazard you have found does not transfer simply because your own task is finished.' },
              { opt: 'C', text: 'Contain the offcuts in a sealed container at the point of generation, as agreed with relevant personnel under your WHS procedure', verdict: 'CORRECT', note: 'A control measure must be appropriate to the hazard actually identified and agreed with relevant personnel under PC 1.5.' },
              { opt: 'D', text: 'Put on gloves and continue working around the offcuts; gloves alone remove the puncture hazard, so no further action or agreement is required', verdict: 'Incorrect', note: 'Gloves reduce but do not remove a sharps hazard left in the work area.' },
            ]}
          />

          <div className="doc-element-subheading">Section B — Instruments and their applications</div>

          <MCQBenchmark
            title="M5. Which instrument is used to measure the absolute optical power arriving at a point in the network, expressed in dBm?"
            ke="Knowledge evidence: KE2"
            options={[
              { opt: 'A', text: 'Optical source', verdict: 'Incorrect', note: 'A source launches a signal; it does not measure received power.' },
              { opt: 'B', text: 'Hand-held optical power meter', verdict: 'CORRECT', note: 'The power meter is the instrument that reads absolute optical power in dBm at the point it is connected.' },
              { opt: 'C', text: 'Fibre identifier', verdict: 'Incorrect', note: 'A fibre identifier only confirms the presence and direction of traffic, not an absolute power value.' },
              { opt: 'D', text: 'ONT detector', verdict: 'Incorrect', note: 'An ONT detector confirms presence of an active ONT; it is not an absolute power meter.' },
            ]}
          />

          <MCQBenchmark
            title="M6. An optical source is normally used together with a power meter to:"
            ke="Knowledge evidence: KE2"
            options={[
              { opt: 'A', text: 'Measure the insertion loss along a fibre link', verdict: 'CORRECT', note: 'A source at one end and a meter at the other is the standard method for measuring end-to-end insertion loss.' },
              { opt: 'B', text: 'Clean optical connectors', verdict: 'Incorrect', note: 'Neither instrument cleans connectors.' },
              { opt: 'C', text: 'Detect an active ONT without breaking the connection', verdict: 'Incorrect', note: 'That is the function of a fibre identifier or ONT detector, not a source-and-meter pair.' },
              { opt: 'D', text: 'Identify the connector polish type', verdict: 'Incorrect', note: 'Polish type is identified visually or from documentation, not by a source-and-meter test.' },
            ]}
          />

          <MCQBenchmark
            title="M7. Which instrument allows a technician to confirm a fibre is carrying live traffic, without breaking the connection?"
            ke="Knowledge evidence: KE2"
            options={[
              { opt: 'A', text: 'Optical loss test set', verdict: 'Incorrect', note: 'An OLTS requires access to both fibre ends and is used for loss testing.' },
              { opt: 'B', text: 'PON meter', verdict: 'Incorrect', note: 'A PON meter measures power levels on a live PON but does not perform the clamp-on identification function.' },
              { opt: 'C', text: 'Optical source', verdict: 'Incorrect', note: 'A source launches a signal; it does not detect existing traffic.' },
              { opt: 'D', text: 'Fibre identifier', verdict: 'CORRECT', note: 'A fibre identifier uses a macrobend clamp to sense light non-invasively without breaking the connector.' },
            ]}
          />

          <MCQBenchmark
            title="M8. What does an ONT detector confirm?"
            ke="Knowledge evidence: KE2"
            options={[
              { opt: 'A', text: 'The exact insertion loss of a link', verdict: 'Incorrect', note: 'Insertion loss is measured with a source and meter (or an OLTS), not an ONT detector.' },
              { opt: 'B', text: 'The connector polish type in use', verdict: 'Incorrect', note: 'Polish type is not something an ONT detector reports.' },
              { opt: 'C', text: 'The presence of an active optical network terminal on the line', verdict: 'CORRECT', note: 'The ONT detector is a purpose-built instrument for confirming an active ONT is present on the line.' },
              { opt: 'D', text: 'The calibration status of a power meter', verdict: 'Incorrect', note: "Calibration status is checked against the instrument's own calibration record." },
            ]}
          />

          <MCQBenchmark
            title="M9. An optical loss test set (OLTS) is best described as:"
            ke="Knowledge evidence: KE2"
            options={[
              { opt: 'A', text: 'A single instrument combining a calibrated source and power meter to measure end-to-end insertion loss', verdict: 'CORRECT', note: 'An OLTS integrates a calibrated source and meter specifically to measure end-to-end insertion loss.' },
              { opt: 'B', text: 'A device that only detects the presence of live traffic in a fibre, without measuring loss or power at all', verdict: 'Incorrect', note: 'Live-traffic detection is the function of a fibre identifier or ONT detector.' },
              { opt: 'C', text: 'A device used only to clean optical connectors before they are mated, with no measurement function', verdict: 'Incorrect', note: 'An OLTS is a measuring instrument, not a cleaning tool.' },
              { opt: 'D', text: 'A meter that cannot hold a valid calibration record, unlike the other instruments covered in this unit', verdict: 'Incorrect', note: 'Like all instruments in this unit, an OLTS must have current, verified calibration.' },
            ]}
          />

          <MCQBenchmark
            title="M10. What is the main advantage of a PON meter over a standard optical power meter when testing a live GPON network?"
            ke="Knowledge evidence: KE2, KE7"
            options={[
              { opt: 'A', text: 'It is cheaper to purchase than a standard optical power meter, and purchase cost is the reason it would be selected for this task', verdict: 'Incorrect', note: 'Purchase cost is not the reason a PON meter is chosen for this task.' },
              { opt: 'B', text: 'It can measure the relevant downstream wavelengths on a live, in-service PON without interrupting customer traffic', verdict: 'CORRECT', note: 'A PON meter is purpose-built to read downstream wavelengths on a live PON without disrupting service.' },
              { opt: 'C', text: 'It removes the need for the instrument to hold a current, verified calibration record before use', verdict: 'Incorrect', note: 'Like every instrument in this unit, a PON meter requires verified calibration before use.' },
              { opt: 'D', text: "It replaces the need for a fibre identifier's non-invasive, clamp-on detection of live traffic in the fibre", verdict: 'Incorrect', note: "A PON meter measures power; it does not replace a fibre identifier's separate traffic-presence function." },
            ]}
          />

          <div className="doc-element-subheading">Section C — Measurement interpretation</div>

          <MCQBenchmark
            title="M11. Why must you know the operating wavelength before interpreting an optical power reading?"
            ke="Knowledge evidence: KE3"
            options={[
              { opt: 'A', text: 'Wavelength has no effect on the reading, so any wavelength setting will produce an equally reliable result', verdict: 'Incorrect', note: 'Wavelength materially affects how a reading should be interpreted.' },
              { opt: 'B', text: 'It only matters for insertion loss measurements, not for an absolute power reading taken on its own', verdict: 'Incorrect', note: 'The same calibration-factor principle applies to any absolute power reading.' },
              { opt: 'C', text: "A power meter's response varies with wavelength, and the instrument applies a wavelength-specific calibration factor to the reading", verdict: 'CORRECT', note: "A detector's responsivity is wavelength-dependent, requiring the meter to be set to the exact tested wavelength." },
              { opt: 'D', text: 'It only matters when using an optical source, not when reading a power meter on its own', verdict: 'Incorrect', note: 'A source launches a signal at a set wavelength; the calibration-factor issue applies to the receiving meter.' },
            ]}
          />

          <MCQBenchmark
            title='M12. A measured result can only be judged "acceptable" once you have:'
            ke="Knowledge evidence: KE3"
            options={[
              { opt: 'A', text: 'Repeated the measurement three times and taken the average of the three readings', verdict: 'Incorrect', note: 'Repetition alone does not establish a pass/fail criterion.' },
              { opt: 'B', text: 'Recorded the ambient temperature alongside the reading, in case it is needed later', verdict: 'Incorrect', note: 'Ambient temperature is not the criterion against which optical readings in this unit are judged.' },
              { opt: 'C', text: 'Confirmed the connector colour matched the polish type expected for that link', verdict: 'Incorrect', note: 'Connector colour indicates polish type, not whether a reading meets specification.' },
              { opt: 'D', text: 'Compared it against the relevant standard or specification for that measurement type and wavelength', verdict: 'CORRECT', note: 'A reading has no meaning as pass or fail until it is compared against the applicable specification.' },
            ]}
          />

          <MCQBenchmark
            title="M13. Which of the following most affects how an optical power reading should be interpreted?"
            ke="Knowledge evidence: KE3"
            options={[
              { opt: 'A', text: "The power reading alone, without reference to the link's design loss budget or specification", verdict: 'Incorrect', note: 'A power reading in isolation cannot be judged pass or fail.' },
              { opt: 'B', text: 'The wavelength the instrument was set to and the type of measurement being made', verdict: 'CORRECT', note: 'Interpretation depends on the wavelength setting and whether the reading is absolute power, insertion loss or relative power.' },
              { opt: 'C', text: 'Whether the reading was taken on the morning or afternoon shift, since ambient light changes what a hand-held meter displays', verdict: 'Incorrect', note: "Ambient light does not affect a hand-held meter's reading of light coupled through a connector and fibre." },
              { opt: 'D', text: "The instrument's serial number, since a higher serial number indicates a newer, more accurately calibrated unit", verdict: 'Incorrect', note: 'Serial number has no relationship to calibration currency or accuracy.' },
            ]}
          />

          <MCQBenchmark
            title="M14. Two links measured at the same absolute power in dBm can have very different loss performance because:"
            ke="Knowledge evidence: KE3, KE5"
            options={[
              { opt: 'A', text: 'dBm alone does not indicate how much loss occurred between the transmitter and the measurement point', verdict: 'CORRECT', note: 'dBm is an absolute value at the measurement point; without knowing launch power, it says nothing about link loss.' },
              { opt: 'B', text: 'dBm measurements are always inaccurate', verdict: 'Incorrect', note: 'dBm is an accurate, standard unit when calibrated correctly.' },
              { opt: 'C', text: 'Loss cannot be expressed in dB', verdict: 'Incorrect', note: 'Loss is expressed in dB precisely because it is a ratio.' },
              { opt: 'D', text: 'Absolute power measurements are only valid for insertion loss testing', verdict: 'Incorrect', note: 'Absolute power readings are used for many operational verification tasks.' },
            ]}
          />

          <div className="doc-element-subheading page-break-before">Section D — Connector contamination, handling, polish and adaptor types</div>

          <MCQBenchmark
            title="M15. What is the most likely consequence of mating a contaminated optical connector?"
            ke="Knowledge evidence: KE4"
            options={[
              { opt: 'A', text: 'No effect, provided the link is short', verdict: 'Incorrect', note: 'Link length does not prevent contamination from affecting the connection.' },
              { opt: 'B', text: 'The connector will simply not engage', verdict: 'Incorrect', note: 'Contamination does not stop mechanical latching, making it a hidden hazard.' },
              { opt: 'C', text: 'Increased insertion loss, back-reflection, and possible permanent damage to the fibre end-face', verdict: 'CORRECT', note: 'Contamination increases loss and reflection, and under optical power can permanently pit or burn the end-face.' },
              { opt: 'D', text: 'The connector will read low but recover once the link is re-mated', verdict: 'Incorrect', note: 'Contamination-related loss does not self-correct on re-mating; grinding debris can cause lasting damage.' },
            ]}
          />

          <MCQBenchmark
            title="M16. Before mating any optical connector, you should:"
            ke="Knowledge evidence: KE4, KE8"
            options={[
              { opt: 'A', text: 'Mate it first, then clean if the reading is high', verdict: 'Incorrect', note: 'Mating first can grind contaminants into the glass, causing permanent damage.' },
              { opt: 'B', text: 'Always apply cleaning solvent regardless of appearance', verdict: 'Incorrect', note: 'Unnecessary solvent use increases residue risks.' },
              { opt: 'C', text: 'Skip inspection if the connector was clean at the last job', verdict: 'Incorrect', note: 'Connector condition can change between jobs; each must be inspected before mating.' },
              { opt: 'D', text: 'Inspect the end-face, clean only if contamination or a defect is visible, and re-inspect before mating', verdict: 'CORRECT', note: 'Inspect first, clean only if needed, and re-inspect before mating is the industry standard sequence.' },
            ]}
          />

          <MCQBenchmark
            title="M17. UPC and APC connectors must not be mated to each other because:"
            ke="Knowledge evidence: KE6"
            options={[
              { opt: 'A', text: 'The angled APC ferrule end-face will not mate correctly with the flat UPC end-face, causing high loss and potential physical damage', verdict: 'CORRECT', note: "APC's 8° angled polish cannot mate flush with a flat UPC ferrule, causing an air gap, extreme loss, and physical damage." },
              { opt: 'B', text: 'They use different fibre core sizes, so the two connector types are physically incompatible at the glass itself', verdict: 'Incorrect', note: 'Core size is identical (standard 9 µm single-mode).' },
              { opt: 'C', text: 'APC connectors are not compatible with any test equipment, regardless of what the equipment’s own connector type is', verdict: 'Incorrect', note: 'APC connectors are widely supported on compatible test ports.' },
              { opt: 'D', text: 'UPC connectors cannot carry live traffic once an APC connector has been mated anywhere earlier in the same link', verdict: 'Incorrect', note: 'Both carry live traffic; the issue is mechanical and polish incompatibility.' },
            ]}
          />

          <MCQBenchmark
            title="M18. Which connector polish type is identified by a green connector body and is used where minimising back-reflection is critical?"
            ke="Knowledge evidence: KE6"
            options={[
              { opt: 'A', text: 'UPC', verdict: 'Incorrect', note: 'UPC connectors are blue and use a flat physical contact polish.' },
              { opt: 'B', text: 'APC', verdict: 'CORRECT', note: 'APC (Angled Physical Contact) connectors are green with an 8° angled polish to minimise return loss.' },
              { opt: 'C', text: 'PC', verdict: 'Incorrect', note: 'PC is an older non-angled polish, typically black or blue.' },
              { opt: 'D', text: 'SPC', verdict: 'Incorrect', note: 'SPC is an intermediate flat polish, not angled or green.' },
            ]}
          />

          <MCQBenchmark
            title="M19. Bare optical fibre offcuts present a hazard because they are:"
            ke="Knowledge evidence: KE8"
            options={[
              { opt: 'A', text: 'Highly flammable, and capable of igniting nearby materials if left in a work area', verdict: 'Incorrect', note: 'Optical fibre is glass and not a flammable hazard.' },
              { opt: 'B', text: 'Electrically conductive, creating a shock hazard if they contact energised equipment nearby', verdict: 'Incorrect', note: 'Silica glass is an insulator and non-conductive.' },
              { opt: 'C', text: 'Only a hazard when the fibre is carrying a live optical signal, and harmless once the signal is removed', verdict: 'Incorrect', note: 'The physical puncture risk exists whether energized or dark.' },
              { opt: 'D', text: 'Near-invisible glass fragments that can penetrate skin and be difficult to see or remove', verdict: 'CORRECT', note: 'Fine glass splinters easily penetrate skin and internal tissue, creating an acute sharps hazard.' },
            ]}
          />

          <MCQBenchmark
            title="M20. Which of the following is correct practice for protecting optical fibre during measurement work?"
            ke="Knowledge evidence: KE8"
            options={[
              { opt: 'A', text: 'Leave unused connector ends uncapped so cleanliness can be checked at a glance', verdict: 'Incorrect', note: 'Uncapped connectors invite airborne dust and debris.' },
              { opt: 'B', text: 'Coil fibre tightly below its minimum bend radius to save space', verdict: 'Incorrect', note: 'Violating bend radius causes macrobending loss and glass stress.' },
              { opt: 'C', text: 'Fit dust caps to unmated connectors and store offcuts in a sealed rigid container at the point of generation', verdict: 'CORRECT', note: 'Clean dust caps protect ferrules, and rigid containers safely capture glass shards.' },
              { opt: 'D', text: 'Store test patch cords loose in a tool bag with other equipment', verdict: 'Incorrect', note: 'Heavy tools can crush fibre cords or contaminate ceramic tips.' },
            ]}
          />

          <MCQBenchmark
            title="M21. Which connector adaptor type terminates multiple fibres — typically twelve — in a single connector, and is commonly used for high-density backbone or MDU distribution links?"
            ke="Knowledge evidence: KE6"
            options={[
              { opt: 'A', text: 'ST — a bayonet-style single-fibre adaptor common in older multimode LAN installations', verdict: 'Incorrect', note: 'ST is a legacy single-fibre bayonet connector.' },
              { opt: 'B', text: 'MPO — a multi-fibre push-on adaptor that terminates a ribbon of fibres, typically twelve, in one connector', verdict: 'CORRECT', note: 'MPO (Multi-fiber Push-On) accommodates high-density ribbon arrays.' },
              { opt: 'C', text: 'SC — a simplex or duplex single-fibre adaptor with a 2.5 mm ferrule', verdict: 'Incorrect', note: 'SC is a single-fibre ferrule format.' },
              { opt: 'D', text: 'LC — a small-form-factor single-fibre adaptor with a 1.25 mm ferrule, used where space is limited', verdict: 'Incorrect', note: 'LC achieves density by smaller single-port size, not 12-fibre ribbons.' },
            ]}
          />

          <MCQBenchmark
            title="M22. Which statement correctly distinguishes an SC adaptor from an LC adaptor?"
            ke="Knowledge evidence: KE6"
            options={[
              { opt: 'A', text: 'SC and LC use the same 1.25 mm ferrule and differ only in the colour of the housing', verdict: 'Incorrect', note: 'SC ferrules are 2.5 mm; LC ferrules are 1.25 mm.' },
              { opt: 'B', text: 'LC is a bayonet-style connector, tightened by twisting, while SC is a push-pull connector', verdict: 'Incorrect', note: 'Both are push-pull style latching connectors.' },
              { opt: 'C', text: 'SC terminates a single fibre in a 2.5 mm ferrule and is commonly supplied simplex; LC uses a smaller 1.25 mm ferrule and is commonly supplied duplex', verdict: 'CORRECT', note: 'Ferrule diameter (2.5 mm vs 1.25 mm) is the defining physical difference.' },
              { opt: 'D', text: 'SC is only used in multimode LAN cabling and is never encountered on single-mode FTTx access fibre', verdict: 'Incorrect', note: 'SC is one of the most widely deployed access connectors on single-mode GPON.' },
            ]}
          />

          <div className="doc-element-subheading">Section E — Recording results and wavelengths</div>

          <MCQBenchmark
            title="M23. When recording an absolute optical power reading, the correct unit is:"
            ke="Knowledge evidence: KE5"
            options={[
              { opt: 'A', text: 'dB', verdict: 'Incorrect', note: 'dB expresses relative loss or gain, not absolute power.' },
              { opt: 'B', text: 'dBi', verdict: 'Incorrect', note: 'dBi applies to isotropic antenna gain.' },
              { opt: 'C', text: 'Watts only', verdict: 'Incorrect', note: 'dBm is the mandatory standard unit in telecommunications.' },
              { opt: 'D', text: 'dBm', verdict: 'CORRECT', note: 'dBm is decibels referenced to 1 milliwatt and denotes absolute power.' },
            ]}
          />

          <MCQBenchmark
            title="M24. When recording an insertion loss measurement, the correct unit is:"
            ke="Knowledge evidence: KE5"
            options={[
              { opt: 'A', text: 'dB', verdict: 'CORRECT', note: 'Insertion loss represents a power ratio and must always be labeled in dB.' },
              { opt: 'B', text: 'dBm', verdict: 'Incorrect', note: 'dBm represents absolute received power, not a loss ratio.' },
              { opt: 'C', text: 'dBi', verdict: 'Incorrect', note: 'dBi is unrelated to optical fibre attenuation.' },
              { opt: 'D', text: 'mW (milliwatts), since loss is fundamentally a power quantity and should be expressed in a linear power unit', verdict: 'Incorrect', note: 'Loss is recorded as a logarithmic ratio (dB) to facilitate budget addition.' },
            ]}
          />

          <MCQBenchmark
            title="M25. A complete measurement record should include the reading, the unit, and:"
            ke="Knowledge evidence: KE5"
            options={[
              { opt: 'A', text: 'Nothing else is required beyond the bare numeric reading, since the unit of measurement already implies everything else', verdict: 'Incorrect', note: 'A number alone cannot be audited without instrument and wavelength context.' },
              { opt: 'B', text: "Only the technician's name, since the record can always be traced back to who performed the test", verdict: 'Incorrect', note: 'The physical parameters of the test remain unknown.' },
              { opt: 'C', text: 'Only the date the reading was taken, since the record can be cross-checked against the job pack afterwards', verdict: 'Incorrect', note: 'Date alone does not confirm wavelength or instrument validity.' },
              { opt: 'D', text: 'The wavelength tested, the instrument used, and its calibration status', verdict: 'CORRECT', note: 'Traceable compliance requires test wavelength, instrument serial number, and calibration currency.' },
            ]}
          />

          <MCQBenchmark
            title="M26. Which set of wavelengths would you expect to encounter when using these instruments on a typical FTTx/GPON access network?"
            ke="Knowledge evidence: KE7"
            options={[
              { opt: 'A', text: '850 nm and 1300 nm only, the multimode wavelengths used for indoor LAN cabling rather than single-mode access networks', verdict: 'Incorrect', note: '850/1300 nm are multimode premises wavelengths.' },
              { opt: 'B', text: '400–700 nm visible light only, since a visual fault locator is sufficient for all optical measurement work on this network', verdict: 'Incorrect', note: 'Visible light is used only for tracer continuity, not GPON transmission.' },
              { opt: 'C', text: '1310 nm, 1490 nm and 1550 nm, with 1625/1650 nm sometimes used for in-service maintenance testing', verdict: 'CORRECT', note: 'Standard GPON assignments: 1310 upstream, 1490 downstream data, 1550 video overlay, 1625/1650 maintenance.' },
              { opt: 'D', text: '1550 nm only, since every instrument in this unit is fixed to a single test wavelength regardless of network type', verdict: 'Incorrect', note: 'FTTx testing requires selective multi-wavelength measurement.' },
            ]}
          />

          <MCQBenchmark
            title='M27. A technician’s test record states: "18.3 dBm insertion loss". The numeric working shows the loss was correctly calculated as 18.3 dB. What is wrong with this record?'
            ke="Knowledge evidence: KE5 — Deliberate trap item testing dB/dBm confusion."
            options={[
              { opt: 'A', text: 'The unit is wrong — insertion loss is a ratio and must be recorded in dB, not dBm; recording it as dBm mislabels a loss as if it were an absolute power reading', verdict: 'CORRECT', note: 'dB and dBm are not interchangeable. Recording a loss ratio as dBm corrupts the compliance log.' },
              { opt: 'B', text: 'Nothing is wrong — dBm and dB are interchangeable units for any optical reading', verdict: 'Incorrect', note: 'Confusing absolute power (dBm) with relative loss (dB) is a critical technical error.' },
              { opt: 'C', text: 'The number is wrong — a correctly calculated insertion loss of 18.3 dB should have been recorded as 18.3 dBi', verdict: 'Incorrect', note: 'dBi has no application in cable transmission.' },
              { opt: 'D', text: "The record is incomplete — it is missing the technician's name, but the unit and number are both correct as written", verdict: 'Incorrect', note: 'The unit itself is mathematically invalid for a loss ratio.' },
            ]}
          />
        </section>

        {/* ================= PART B — SHORT ANSWER BENCHMARKS ================= */}
        <section className="doc-section">
          <h3 className="doc-sec-title" style={{ fontSize: '13pt' }}>Part B — Short answer model answers and benchmarks</h3>

          {/* S1 */}
          <div className="sa-benchmark-card">
            <div className="sa-card-header">
              <h4>S1. Site-specific or Organisational Requirements (KE1)[cite: 3]</h4>
              <span style={{ fontSize: '8pt', color: '#555' }}>Question: Identify four site-specific or organisational requirements you must check before starting optical measurement work on a customer's premises, and state where you would locate each.[cite: 3]</span>
            </div>
            <div className="sa-card-body">
              <div className="sa-card-subtitle">Model Answer[cite: 3]</div>
              <p className="sa-model-text">
                1. <strong>Site access / entry approval requirements:</strong> confirmed with the customer or site owner before attending[cite: 3].<br />
                2. <strong>WHS management system and risk assessment procedure:</strong> located in the organisation's WHS management system[cite: 3].<br />
                3. <strong>Site induction or permit-to-work requirements:</strong> held by the site owner or network operator for that location[cite: 3].<br />
                4. <strong>Test, measurement and calibration procedure:</strong> sets the calibration interval for optical test instruments and the records to be kept[cite: 3].<br />
                <em>Also acceptable:</em> incident and hazard reporting procedure; PPE procedure; environmental/waste procedure for fibre offcuts[cite: 3].
              </p>
              <div className="sa-benchmark-note">
                <strong>Benchmark for a satisfactory judgement:</strong> Four requirements named, each with a plausible location[cite: 3]. A generic answer such as "the safety manual", with no statement of what it governs, is not satisfactory[cite: 3].
              </div>
            </div>
          </div>

          {/* S2 */}
          <div className="sa-benchmark-card">
            <div className="sa-card-header">
              <h4>S2. Instruments Covered and Primary Purpose (KE2)[cite: 3]</h4>
              <span style={{ fontSize: '8pt', color: '#555' }}>Question: Name the six types of hand-held optical measuring instrument covered by this unit, and state the primary purpose of each.[cite: 3]</span>
            </div>
            <div className="sa-card-body">
              <div className="sa-card-subtitle">Model Answer[cite: 3]</div>
              <p className="sa-model-text">
                1. <strong>Hand-held optical power meter:</strong> measures absolute optical power at a point in the network, expressed in dBm[cite: 3].<br />
                2. <strong>Hand-held optical source:</strong> launches a known optical signal, normally paired with a power meter to test insertion loss[cite: 3].<br />
                3. <strong>Hand-held optical fibre identifier (OFI-FTTx):</strong> confirms the presence and direction of live traffic in a fibre by macrobend, without breaking the connection[cite: 3].<br />
                4. <strong>Active ONT detector:</strong> confirms the presence of an active optical network terminal on the line[cite: 3].<br />
                5. <strong>Optical loss test set (OLTS):</strong> combines a calibrated source and power meter to measure end-to-end insertion loss in dB[cite: 3].<br />
                6. <strong>PON meter:</strong> measures relevant downstream wavelengths on a live, in-service PON without interrupting customer traffic[cite: 3].
              </p>
              <div className="sa-benchmark-note">
                <strong>Benchmark for a satisfactory judgement:</strong> All six instruments named, each with a substantially correct statement of its primary purpose[cite: 3].
              </div>
            </div>
          </div>

          {/* S3 */}
          <div className="sa-benchmark-card">
            <div className="sa-card-header">
              <h4>S3. Connector Contamination &amp; Cleaning Sequence (KE4, KE8)[cite: 3]</h4>
              <span style={{ fontSize: '8pt', color: '#555' }}>Question: Explain what can happen if a contaminated optical connector is mated, and describe the correct inspect/clean/mate sequence that prevents it.[cite: 3]</span>
            </div>
            <div className="sa-card-body">
              <div className="sa-card-subtitle">Model Answer[cite: 3]</div>
              <p className="sa-model-text">
                <strong>Consequence:</strong> Increased insertion loss, back-reflection, and possible permanent damage to the fibre end-face, especially where optical power is present[cite: 3].<br />
                <strong>Correct sequence:</strong> Inspect the end-face first; clean only if contamination or a defect is visible; re-inspect; then mate[cite: 3].
              </p>
              <div className="sa-benchmark-note">
                <strong>Benchmark for a satisfactory judgement:</strong> Consequence correctly explained, and the three-step inspect / clean-only-if-needed / re-inspect sequence given in the correct order before mating[cite: 3].
              </div>
            </div>
          </div>

          {/* S4 */}
          <div className="sa-benchmark-card">
            <div className="sa-card-header">
              <h4>S4. Insertion Loss Calculation (KE5 — Numeracy Foundation Skill)[cite: 3]</h4>
              <span style={{ fontSize: '8pt', color: '#555' }}>Question: An optical source launches +1.5 dBm into a fibre link. At the far end, an optical power meter measures −16.8 dBm. Calculate the insertion loss of the link. Show your working.[cite: 3]</span>
            </div>
            <div className="sa-card-body">
              <div className="sa-card-subtitle">Model Answer[cite: 3]</div>
              <div className="sa-calc-block">
                Loss = launch power − received power<br />
                Loss = (+1.5 dBm) − (−16.8 dBm) = 1.5 + 16.8 = 18.3 dB[cite: 3]
              </div>
              <div className="sa-benchmark-note">
                <strong>Benchmark for a satisfactory judgement:</strong> Correct arithmetic (18.3 dB), correct handling of the negative received value, and the result expressed in dB[cite: 3]. Working must be shown[cite: 3].
              </div>
            </div>
          </div>

          {/* S5 */}
          <div className="sa-benchmark-card">
            <div className="sa-card-header">
              <h4>S5. Live PON Evaluative Judgement (KE3)[cite: 3]</h4>
              <span style={{ fontSize: '8pt', color: '#555' }}>Question: While testing a live PON with a PON meter, you measure a downstream power level that is only 0.8 dB above the minimum acceptable limit for that wavelength. What do you record, and what action do you take?[cite: 3]</span>
            </div>
            <div className="sa-card-body">
              <div className="sa-card-subtitle">Model Answer[cite: 3]</div>
              <p className="sa-model-text">
                • Record the actual reading, and note that it is within specification but has very little margin[cite: 3].<br />
                • Do not simply record "pass": inspect and clean the connectors at the test point and re-measure[cite: 3].<br />
                • Compare the measured loss against the design loss budget, where available[cite: 3].<br />
                • Report the marginal result to appropriate personnel rather than closing the job out on a bare pass[cite: 3].
              </p>
              <div className="sa-benchmark-note">
                <strong>Benchmark for a satisfactory judgement:</strong> States the reading is within specification but marginal, and proposes an investigative or escalation action rather than a bare pass[cite: 3].
              </div>
            </div>
          </div>

          {/* S6 */}
          <div className="sa-benchmark-card">
            <div className="sa-card-header">
              <h4>S6. Operating Wavelengths &amp; Responsivity Calibration (KE7, KE3)[cite: 3]</h4>
              <span style={{ fontSize: '8pt', color: '#555' }}>Question: State the wavelengths you would expect to test on a typical FTTx/GPON access network using these instruments, and explain why setting an instrument to the wrong wavelength produces an unreliable reading.[cite: 3]</span>
            </div>
            <div className="sa-card-body">
              <div className="sa-card-subtitle">Model Answer[cite: 3]</div>
              <p className="sa-model-text">
                <strong>Wavelengths:</strong> 1310 nm (upstream), 1490 nm (downstream data) and 1550 nm (downstream video/overlay where fitted); 1625/1650 nm is sometimes used for in-service maintenance testing[cite: 3].<br />
                <strong>Reasoning:</strong> An instrument's detector applies a wavelength-specific calibration/responsivity factor[cite: 3]. Set to the wrong wavelength, the displayed reading does not reflect the true power or loss and cannot be relied on[cite: 3].
              </p>
              <div className="sa-benchmark-note">
                <strong>Benchmark for a satisfactory judgement:</strong> At least three core wavelengths correctly named, and the calibration-factor reasoning given for why the wrong setting produces an unreliable reading[cite: 3].
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Sub-component for individual MCQ benchmark tables
function MCQBenchmark({ title, ke, options }) {
  return (
    <div className="qa-benchmark-block">
      <div className="qa-prompt-title">{title}</div>
      <div className="qa-meta-ke">{ke}</div>
      <table className="doc-grid-table">
        <thead>
          <tr>
            <th style={{ width: '8%' }}>Option</th>
            <th style={{ width: '42%' }}>Text</th>
            <th style={{ width: '14%' }}>Verdict</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {options.map((row) => (
            <tr key={row.opt}>
              <td className="font-bold text-center">{row.opt}</td>
              <td>{row.text}</td>
              <td>
                <span className={row.verdict === 'CORRECT' ? 'verdict-correct' : 'verdict-incorrect'}>
                  {row.verdict}
                </span>
              </td>
              <td>{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}