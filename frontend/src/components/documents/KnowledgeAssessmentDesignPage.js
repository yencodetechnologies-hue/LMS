import React, { useState, useEffect } from 'react';
import { Pencil, Printer, ArrowLeft } from 'lucide-react';
import KnowledgeAssessmentTab from './KnowledgeAssessmentTab';
import '../../styles/MappingDocument.css';

export default function KnowledgeAssessmentDesignPage({ course: initialCourse }) {
  const [course, setCourse] = useState(initialCourse);
  const [isEditing, setIsEditing] = useState(false);
  const courseTitle = course?.title || 'Knowledge Assessment';

  // Keep local course state in sync if parent props update
  useEffect(() => {
    setCourse(initialCourse);
  }, [initialCourse]);

  // Extract saved pages or canvas blocks from the local course object
  const pages = course?.knowledgeAssessment?.pages || (course?.knowledgeAssessment?.canvasBlocks ? [course.knowledgeAssessment.canvasBlocks] : []);
  const hasPages = Array.isArray(pages) && pages.length > 0 && pages.some(p => p.length > 0);

  // Helper to render individual dynamic blocks on the view page
  const renderDynamicBlock = (block, idx) => {
    switch (block.type) {
      case 'title':
        return (
          <h3 key={block.instanceId || idx} style={{ fontSize: '11pt', fontWeight: 700, color: '#0f172a', margin: block.padding || '0.4rem 0', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.15rem' }}>
            {block.text}
          </h3>
        );
      case 'description':
        return (
          <p key={block.instanceId || idx} style={{ fontSize: '9.5pt', color: '#1e293b', margin: block.padding || '0.4rem 0', lineHeight: 1.4 }}>
            {block.text}
          </p>
        );
      case 'datetime':
        return (
          <div key={block.instanceId || idx} style={{ fontSize: '9pt', margin: block.padding || '0.4rem 0' }}>
            <strong>{block.label}:</strong> <span style={{ borderBottom: '1px solid #94a3b8', padding: '0 0.4rem' }}>{block.value ? block.value.replace('T', ' ') : 'Not set'}</span>
          </div>
        );
      case 'table':
        return (
          <div key={block.instanceId || idx} style={{ margin: block.padding || '0.4rem 0', marginBottom: '0.8rem' }}>
            {block.title && <strong style={{ display: 'block', fontSize: '9.5pt', marginBottom: '4px', color: '#2a2320' }}>{block.title}</strong>}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.5pt' }}>
              <thead>
                <tr>
                  {block.headers?.map((h, hIdx) => (
                    <th key={hIdx} style={{ border: '1px solid #94a3b8', padding: '4px 6px', background: '#f8fafc', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows?.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ border: '1px solid #94a3b8', padding: '4px 6px', textAlign: 'left' }}>{cell || ''}</td>
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
            <div key={block.instanceId || idx} style={{ margin: block.padding || '0.4rem 0', marginBottom: '0.8rem', pageBreakInside: 'avoid' }}>
              <p style={{ margin: '0 0 0.2rem 0', fontSize: '9.5pt' }}><strong>{block.text || 'Question'}</strong></p>
              <div style={{ border: '1px dashed #cbd5e1', padding: '0.8rem 0.5rem', borderRadius: '4px', color: '#94a3b8', background: '#f8fafc', fontStyle: 'italic' }}>
                {block.placeholder || 'Answer space'}
              </div>
            </div>
          );
        }
        return (
          <div key={block.instanceId || idx} style={{ margin: block.padding || '0.4rem 0', marginBottom: '0.8rem', pageBreakInside: 'avoid' }}>
            <p style={{ margin: '0 0 0.2rem 0', fontSize: '9.5pt' }}><strong>{block.text || 'Question'}</strong></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', paddingLeft: '0.3rem', fontSize: '9pt' }}>
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

  // Callback to instantly bind updated pages back to the parent view when saving/exiting
const handleBackToDocumentWithData = (updatedPages) => {
    if (updatedPages) {
      setCourse(prev => ({
        ...prev,
        knowledgeAssessment: {
          ...prev.knowledgeAssessment,
          pages: updatedPages,
          canvasBlocks: updatedPages.flat()
        }
      }));
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
            Editor Mode: Customize Structure &amp; Content
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

      {/* Multi-Page A4 Sheet Paper Rendering Dynamically */}
      {hasPages ? (
        pages.map((pageBlocks, pIdx) => (
          <div key={pIdx} className="mapping-a4-document" style={{ marginBottom: '2rem' }}>
            <div className="map-running-header">
              [RTO_LEGAL_NAME] | RTO [RTO_ID] — {courseTitle} (Page {pIdx + 1})
            </div>

            <div className="map-masthead-banner">
              <div className="map-banner-logo-box">[LOGO]</div>
              <div className="map-banner-title-box">
                <span className="map-banner-subtitle">[RTO_LEGAL_NAME] | RTO [RTO_ID]</span>
                <h1 className="map-banner-heading">Knowledge Assessment</h1>
              </div>
            </div>

            <h2 className="map-unit-title-row">{courseTitle} — Page {pIdx + 1}</h2>

            <div style={{ marginTop: '1.5rem' }}>
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
      ) : (
        <div className="mapping-a4-document">
          <div className="map-running-header">
            [RTO_LEGAL_NAME] | RTO [RTO_ID] — {courseTitle}
          </div>
          <div className="map-masthead-banner">
            <div className="map-banner-logo-box">[LOGO]</div>
            <div className="map-banner-title-box">
              <span className="map-banner-subtitle">[RTO_LEGAL_NAME] | RTO [RTO_ID]</span>
              <h1 className="map-banner-heading">Knowledge Assessment</h1>
            </div>
          </div>
          <h2 className="map-unit-title-row">{courseTitle}</h2>
          <p style={{ color: '#8a7f7a', fontStyle: 'italic', textAlign: 'center', padding: '3rem 0' }}>
            No assessment blocks found. Click "Edit Structure & Questions" to add content.
          </p>
        </div>
      )}
    </div>
  );
}