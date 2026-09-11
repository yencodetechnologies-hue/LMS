import React, { useState } from 'react';
import { Pencil, Printer, ArrowLeft } from 'lucide-react';
import KnowledgeAssessmentTab from './KnowledgeAssessmentTab';
import '../../styles/PracticalAssessmentTab.css';

export default function PracticalAssessmentDesignPage({ course }) {
  const [isEditing, setIsEditing] = useState(false);
  const courseTitle = course?.title || 'ICTBWN307 Use optical measuring instruments — Assessment Task 2: optical measuring instrument task';

  // Extract saved practical assessment pages or canvas blocks
  const pages = course?.practicalAssessment?.pages || (course?.practicalAssessment?.canvasBlocks ? [course.practicalAssessment.canvasBlocks] : []);
  const hasPages = Array.isArray(pages) && pages.length > 0 && pages.some(p => p.length > 0);
  
  // Fallback if no pages exist yet
  const practicalHtml = course?.practicalAssessment?.html;
  const canvasBlocks = course?.practicalAssessment?.canvasBlocks || [];
  const hasCanvasBlocks = Array.isArray(canvasBlocks) && canvasBlocks.length > 0;

  // Helper to render individual dynamic blocks on the view page
  const renderDynamicBlock = (block, idx) => {
    switch (block.type) {
      case 'title':
        return (
          <h3 key={block.instanceId || idx} style={{ fontSize: '10.5pt', fontWeight: 700, color: '#0f172a', margin: block.padding || '0.3rem 0', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.1rem' }}>
            {block.text}
          </h3>
        );
      case 'description':
        return (
          <p key={block.instanceId || idx} style={{ fontSize: '9.5pt', color: '#1e293b', margin: block.padding || '0.3rem 0', lineHeight: 1.35 }}>
            {block.text}
          </p>
        );
      case 'datetime':
        return (
          <div key={block.instanceId || idx} style={{ fontSize: '9pt', margin: block.padding || '0.3rem 0' }}>
            <strong>{block.label}:</strong> <span style={{ borderBottom: '1px solid #94a3b8', padding: '0 0.4rem' }}>{block.value ? block.value.replace('T', ' ') : 'Not set'}</span>
          </div>
        );
      case 'table':
        return (
          <div key={block.instanceId || idx} style={{ margin: block.padding || '0.3rem 0', marginBottom: '0.5rem', breakInside: 'avoid' }}>
            {block.title && <strong style={{ display: 'block', fontSize: '9.5pt', marginBottom: '3px', color: '#2a2320' }}>{block.title}</strong>}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.5pt' }}>
              <thead>
                <tr>
                  {block.headers?.map((h, hIdx) => (
                    <th key={hIdx} style={{ border: '1px solid #94a3b8', padding: '3px 5px', background: '#f8fafc', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows?.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ border: '1px solid #94a3b8', padding: '3px 5px', textAlign: 'left' }}>{cell || ''}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'question':
        if (block.qType === 'text') {
          return (
            <div key={block.instanceId || idx} style={{ margin: block.padding || '0.3rem 0', marginBottom: '0.5rem', breakInside: 'avoid' }}>
              <p style={{ margin: '0 0 0.15rem 0', fontSize: '9.5pt' }}><strong>{block.text || 'Question'}</strong></p>
              <div style={{ border: '1px dashed #cbd5e1', padding: '0.6rem 0.5rem', borderRadius: '4px', color: '#94a3b8', background: '#f8fafc', fontStyle: 'italic' }}>
                {block.placeholder || 'Answer space'}
              </div>
            </div>
          );
        }
        return (
          <div key={block.instanceId || idx} style={{ margin: block.padding || '0.3rem 0', marginBottom: '0.5rem', breakInside: 'avoid' }}>
            <p style={{ margin: '0 0 0.15rem 0', fontSize: '9.5pt' }}><strong>{block.text || 'Question'}</strong></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', paddingLeft: '0.3rem', fontSize: '9pt' }}>
              {block.options?.map((opt, oIdx) => (
                <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <input type={block.qType === 'multi' ? 'checkbox' : 'radio'} disabled />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleBackToDocumentWithData = (updatedPages) => {
    if (updatedPages) {
      course.practicalAssessment = {
        ...course.practicalAssessment,
        pages: updatedPages,
        canvasBlocks: updatedPages.flat()
      };
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.6rem 1.25rem',
          background: '#ffffff',
          borderBottom: '1px solid #e7ded2'
        }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#6d1327' }}>
            Editor Mode: Customize Practical Assessment Structure &amp; Content
          </span>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsEditing(false)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          >
            <ArrowLeft size={14} /> View Finished Document
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <KnowledgeAssessmentTab 
            course={course} 
            assessmentType="practical" 
            onBackToDocument={handleBackToDocumentWithData} 
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', padding: '1rem 0' }}>
      {/* Top Action Bar */}
      <div style={{
        maxWidth: '840px',
        margin: '0 auto 1rem auto',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.6rem'
      }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => window.print()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <Printer size={15} /> Print Paper
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsEditing(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            background: '#6d1327',
            borderColor: '#6d1327'
          }}
        >
          <Pencil size={15} /> Edit Structure &amp; Questions
        </button>
      </div>

      {/* Multi-Page A4 Sheet Paper Rendering (Matching Knowledge Assessment layout) */}
      {hasPages ? (
        pages.map((pageBlocks, pIdx) => (
          <div key={pIdx} className="mapping-a4-document" style={{ marginBottom: '2rem' }}>
            <div className="map-running-header">
              [RTO_LEGAL_NAME] | RTO [RTO_ID] — Practical Assessment (Page {pIdx + 1})
            </div>

            <div className="map-masthead-banner">
              <div className="map-banner-logo-box">[LOGO]</div>
              <div className="map-banner-title-box">
                <span className="map-banner-subtitle">[RTO_LEGAL_NAME] | RTO [RTO_ID]</span>
                <h1 className="map-banner-heading">Practical Assessment</h1>
              </div>
            </div>

            <h2 className="map-unit-title-row">{courseTitle} — Page {pIdx + 1}</h2>

            <div style={{ marginTop: '1rem' }}>
              {pageBlocks.length > 0 ? (
                pageBlocks.map((block, index) => renderDynamicBlock(block, index))
              ) : (
                <p style={{ color: '#8a7f7a', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>
                  No elements added to this page yet.
                </p>
              )}
            </div>
          </div>
        ))
      ) : practicalHtml ? (
        <div className="mapping-a4-document">
          <div className="map-running-header">
            [RTO_LEGAL_NAME] | RTO [RTO_ID] — Practical Assessment (AT-ICTBWN307-02)
          </div>
          <div className="map-masthead-banner">
            <div className="map-banner-logo-box">[LOGO]</div>
            <div className="map-banner-title-box">
              <span className="map-banner-subtitle">[RTO_LEGAL_NAME] | RTO [RTO_ID]</span>
              <h1 className="map-banner-heading">Practical Assessment</h1>
            </div>
          </div>
          <h2 className="map-unit-title-row">{courseTitle}</h2>
          <div style={{ width: '100%', marginTop: '1rem' }} dangerouslySetInnerHTML={{ __html: practicalHtml }} />
        </div>
      ) : hasCanvasBlocks ? (
        <div className="mapping-a4-document">
          <div className="map-running-header">
            [RTO_LEGAL_NAME] | RTO [RTO_ID] — Practical Assessment (AT-ICTBWN307-02)
          </div>
          <div className="map-masthead-banner">
            <div className="map-banner-logo-box">[LOGO]</div>
            <div className="map-banner-title-box">
              <span className="map-banner-subtitle">[RTO_LEGAL_NAME] | RTO [RTO_ID]</span>
              <h1 className="map-banner-heading">Practical Assessment</h1>
            </div>
          </div>
          <h2 className="map-unit-title-row">{courseTitle}</h2>
          <div style={{ marginTop: '1rem' }}>
            {canvasBlocks.map((block, index) => renderDynamicBlock(block, index))}
          </div>
        </div>
      ) : (
        <div className="mapping-a4-document">
          <div className="map-running-header">
            [RTO_LEGAL_NAME] | RTO [RTO_ID] — Practical Assessment (AT-ICTBWN307-02)
          </div>
          <div className="map-masthead-banner">
            <div className="map-banner-logo-box">[LOGO]</div>
            <div className="map-banner-title-box">
              <span className="map-banner-subtitle">[RTO_LEGAL_NAME] | RTO [RTO_ID]</span>
              <h1 className="map-banner-heading">Practical Assessment</h1>
            </div>
          </div>
          <h2 className="map-unit-title-row">{courseTitle}</h2>
          
          <table className="map-control-table" style={{ marginTop: '1rem' }}>
            <tbody>
              <tr>
                <th style={{ width: '22%' }}>Document ID</th>
                <td style={{ width: '28%' }}>AT-ICTBWN307-02</td>
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
        </div>
      )}
    </div>
  );
}