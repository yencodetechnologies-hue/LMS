import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  GripVertical,
  Plus,
  Trash2,
  RotateCcw,
  Inbox,
  CircleDot,
  CheckSquare,
  Heading,
  Type,
  Table as TableIcon,
  CalendarClock,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  Save,
  Loader2,
  ExternalLink,
  ArrowLeft,
  Printer,
  Copy,
  FileText,
  Eye,
  Edit3,
  Crop,
} from 'lucide-react';
import '../../styles/KnowledgeAssessmentTab.css';
import { API_URL } from '../../data/service';

/* =============================================================
    PALETTE ELEMENT SPECIFICATIONS
============================================================== */
const PALETTE_ELEMENTS = [
  { elementType: 'title', label: 'Title', description: 'Heading line for section.', icon: Heading },
  { elementType: 'description', label: 'Description', description: 'Paragraph of instructions.', icon: Type },
  { elementType: 'table', label: 'Table', description: 'Editable data grid.', icon: TableIcon },
  { elementType: 'radio', label: 'Radio Question', description: 'Single-select question.', icon: CircleDot },
  { elementType: 'checkbox', label: 'Checkbox Question', description: 'Multi-select question.', icon: CheckSquare },
  { elementType: 'text_question', label: 'Open Question', description: 'Short answer response box.', icon: HelpCircle },
  { elementType: 'datetime', label: 'Date & Time', description: 'Timestamp field.', icon: CalendarClock },
];

let canvasInstanceCounter = 0;
const nextInstanceId = (prefix) => `${prefix}__${Date.now()}_${++canvasInstanceCounter}`;

function createBlock(elementType) {
  switch (elementType) {
    case 'title':
      return { type: 'title', instanceId: nextInstanceId('title'), text: 'Section Title', padding: '0.4rem 0' };
    case 'description':
      return { type: 'description', instanceId: nextInstanceId('desc'), text: '', padding: '0.4rem 0' };
    case 'table':
      return {
        type: 'table',
        instanceId: nextInstanceId('table'),
        title: 'Table Title / Instructions',
        headers: ['Column 1', 'Column 2'],
        rows: [['', '']],
        padding: '0.4rem 0',
      };
    case 'radio':
      return {
        type: 'question',
        qType: 'single',
        instanceId: nextInstanceId('radio'),
        text: '',
        options: ['A. Option 1', 'B. Option 2', 'C. Option 3', 'D. Option 4'],
        correctAnswer: 0, // Index of correct option (e.g. 0 for A, 1 for B)
        padding: '0.4rem 0',
      };
    case 'checkbox':
      return {
        type: 'question',
        qType: 'multi',
        instanceId: nextInstanceId('checkbox'),
        text: '',
        options: ['A. Option 1', 'B. Option 2', 'C. Option 3', 'D. Option 4'],
        correctAnswer: [0], // Array of correct option indices
        padding: '0.4rem 0',
      };
    case 'text_question':
      return {
        type: 'question',
        qType: 'text',
        instanceId: nextInstanceId('textq'),
        text: '',
        placeholder: 'Write your answer here...',
        sampleAnswer: '',
        padding: '0.4rem 0',
      };
    case 'datetime':
      return {
        type: 'datetime',
        instanceId: nextInstanceId('dt'),
        label: 'Assessment Date & Time',
        value: new Date().toISOString().slice(0, 16),
        padding: '0.4rem 0',
      };
    default:
      return null;
  }
}

const esc = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function blockToHtml(block) {
  switch (block.type) {
    case 'title':
      return `<h3 class="doc-h3" style="font-size:11pt; margin:0 0 0.2rem 0; color:#0f172a; border-bottom:1px solid #cbd5e1; padding-bottom:0.15rem;">${esc(block.text || '')}</h3>`;
    case 'description':
      return `<p class="doc-description" style="margin:0 0 0.3rem 0; font-size:9.5pt; line-height:1.4;">${esc(block.text || '')}</p>`;
    case 'table':
      return `
        <div class="doc-table-container" style="margin-bottom:0.5rem;">
          ${block.title ? `<strong class="doc-table-title" style="display:block; margin-bottom:0.2rem; font-size:9.5pt;">${esc(block.title)}</strong>` : ''}
          <table class="doc-word-table" style="width:100%; border-collapse:collapse; font-size:8.5pt;">
            <thead>
              <tr>${(block.headers || []).map((h) => `<th style="border:1px solid #94a3b8; padding:0.3rem 0.4rem; text-align:left; background:#f8fafc;">${esc(h)}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${(block.rows || []).map((row) => `<tr>${row.map((cell) => `<td style="border:1px solid #94a3b8; padding:0.3rem 0.4rem; text-align:left;">${esc(cell || '')}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </div>`;
    case 'question':
      if (block.qType === 'text') {
        return `
          <div class="paper-question-node" style="padding:0.4rem 0; margin-bottom:0.5rem; page-break-inside:avoid;" data-correct-answer="${esc(block.sampleAnswer || '')}">
            <p class="paper-question-p" style="margin:0 0 0.2rem 0; font-size:9.5pt;"><strong>${esc(block.text || 'Question')}</strong></p>
            <div class="paper-text-response-box" style="border:1px dashed #cbd5e1; padding:0.8rem 0.5rem; border-radius:4px; color:#94a3b8; background:#f8fafc; font-style:italic;">${esc(block.placeholder || 'Answer space')}</div>
          </div>`;
      }
      const correctValAttr = JSON.stringify(block.correctAnswer ?? '');
      return `
        <div class="paper-question-node" style="padding:0.4rem 0; margin-bottom:0.5rem; page-break-inside:avoid;" data-correct-answer='${correctValAttr}'>
          <p class="paper-question-p" style="margin:0 0 0.2rem 0; font-size:9.5pt;"><strong>${esc(block.text || 'Question')}</strong></p>
          <div class="paper-options-list" style="display:flex; flex-direction:column; gap:0.2rem; padding-left:0.3rem; font-size:9pt;">
            ${(block.options || [])
              .map(
                (opt, idx) =>
                  `<label class="paper-option-choice" style="display:flex; align-items:center; gap:0.35rem;">
                     <input type="${block.qType === 'multi' ? 'checkbox' : 'radio'}" name="q_${block.instanceId}" value="${idx}" />
                     <span>${esc(opt)}</span>
                   </label>`
              )
              .join('')}
          </div>
        </div>`;
    case 'datetime':
      return `
        <div class="doc-datetime-row" style="padding:0.3rem 0; font-size:9pt; margin-bottom:0.5rem;">
          <strong>${esc(block.label || '')}:</strong> 
          <span class="doc-datetime-val" style="border-bottom:1px solid #94a3b8; padding:0 0.4rem;">${esc(block.value ? block.value.replace('T', ' ') : 'Not set')}</span>
        </div>`;
    default:
      return '';
  }
}

function buildStandaloneHtml(pages, courseTitle) {
  const pagesHtml = pages.map((pageBlocks, pIdx) => {
    const pageBody = pageBlocks.map((block) => blockToHtml(block)).join('\n');
    return `
      <div class="word-a4-sheet" style="width:780px; max-width:100%; min-height:auto; height:auto; background:#fff; padding:2rem 2.5rem; color:#1e293b; font-size:9.5pt; line-height:1.4; box-sizing:border-box; margin:0 auto 1.5rem auto; page-break-after: always; position:relative; overflow:visible;">
        ${pIdx === 0 ? `
        <div class="word-masthead" style="display:flex; gap:1rem; border-bottom:2px solid #3a0d24; padding-bottom:0.5rem; margin-bottom:1rem;">
          <div class="word-logo-box" style="width:50px; height:50px; border:1px solid #e8e2dc; display:flex; align-items:center; justify-content:center; font-weight:bold; color:#8a7f7a; background:#fbf9f7; border-radius:6px; font-size:8pt;">[LOGO]</div>
          <div class="word-org-details">
            <h3 style="font-size:8pt; margin:0; text-transform:uppercase; color:#8a7f7a;">[RTO_LEGAL_NAME] | RTO [RTO_ID]</h3>
            <h1 style="font-size:12pt; margin:0.1rem 0; color:#2a2320;">Assessment Form</h1>
            <p style="font-size:8.5pt; margin:0; color:#b8285a; font-weight:600;">${esc(courseTitle)} — Page ${pIdx + 1}</p>
          </div>
        </div>` : `<div style="border-bottom:1px solid #e2e8f0; padding-bottom:0.3rem; margin-bottom:1rem; font-size:8pt; color:#8a7f7a; text-align:right;">${esc(courseTitle)} — Page ${pIdx + 1} (Continuation)</div>`}
        ${pageBody || '<p style="color:#8a7f7a; font-style:italic;">No elements added to this page yet.</p>'}
      </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Assessment Print View</title>
<style>
  body { background:#f6f3ef; margin:0;font-family: 'Segoe UI', Calibri, Arial, sans-serif; }
  @media print {
    body { background:#fff; padding:0; }
    .word-a4-sheet { box-shadow:none !important; margin:0 !important; page-break-after: always; }
  }
</style>
</head>
<body>
  ${pagesHtml}
</body>
</html>`;
}

export default function KnowledgeAssessmentTab({ course, assessmentType = 'knowledge', onBackToDocument }) {
  const { courseId: routeCourseId } = useParams();
  const activeCourseId = routeCourseId || course?._id;

  const [pages, setPages] = useState([[]]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const [dragItem, setDragItem] = useState(null);
  const [dropIndicator, setDropIndicator] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSlug, setSavedSlug] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [croppingBlock, setCroppingBlock] = useState(null);
  const [cropPadding, setCropPadding] = useState('0.4rem 0');

  const workspaceScrollRef = useRef(null);
  const courseTitle = course?.title || 'Assessment Form';

  useEffect(() => {
    const assessmentData = assessmentType === 'practical' ? course?.practicalAssessment : course?.knowledgeAssessment;
    if (assessmentData) {
      if (Array.isArray(assessmentData.pages) && assessmentData.pages.length > 0) {
        setPages(assessmentData.pages);
      } else if (Array.isArray(assessmentData.canvasBlocks) && assessmentData.canvasBlocks.length > 0) {
        setPages([assessmentData.canvasBlocks]);
      }
      if (assessmentData.slug) {
        setSavedSlug(assessmentData.slug);
      }
    }
  }, [course, assessmentType]);

  // AUTOMATIC DYNAMIC CONTENT-BASED PAGE SPLITTING
  useEffect(() => {
    if (isPreviewMode) return;
    const MAX_PAGE_HEIGHT = 900; 

    const timer = setTimeout(() => {
      let currentPages = pages.map(p => [...p]);
      let hasChanged = false;

      for (let i = 0; i < currentPages.length; i++) {
        if (currentPages[i].length > 1) {
          const totalLength = currentPages[i].reduce((acc, b) => acc + (b.type === 'table' || b.type === 'question' ? 180 : 80), 0);
          
          if (totalLength > MAX_PAGE_HEIGHT) {
            const overflowItem = currentPages[i].pop();
            if (i + 1 < currentPages.length) {
              currentPages[i + 1].unshift(overflowItem);
            } else {
              currentPages.push([overflowItem]);
            }
            hasChanged = true;
          }
        }
      }

      if (hasChanged) {
        setPages(currentPages);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pages, isPreviewMode]);

  const addPage = () => {
    setPages((prev) => [...prev, []]);
    setCurrentPageIndex(pages.length);
  };

  const removePage = (pIndex) => {
    if (pages.length <= 1) {
      alert('You must have at least one page.');
      return;
    }
    const nextPages = pages.filter((_, idx) => idx !== pIndex);
    setPages(nextPages);
    setCurrentPageIndex(Math.min(currentPageIndex, nextPages.length - 1));
  };

  const duplicateBlock = (block) => {
    const duplicated = { ...block, instanceId: nextInstanceId(block.type) };
    setPages((prevPages) =>
      prevPages.map((page) => {
        const idx = page.findIndex((b) => b.instanceId === block.instanceId);
        if (idx !== -1) {
          const next = [...page];
          next.splice(idx + 1, 0, duplicated);
          return next;
        }
        return page;
      })
    );
  };

  const moveBlockByOffset = (index, offset) => {
    setPages((prevPages) => {
      const nextPages = [...prevPages];
      const pageBlocks = [...(nextPages[currentPageIndex] || [])];
      const targetIndex = index + offset;
      if (targetIndex < 0 || targetIndex >= pageBlocks.length) return prevPages;
      const temp = pageBlocks[index];
      pageBlocks[index] = pageBlocks[targetIndex];
      pageBlocks[targetIndex] = temp;
      nextPages[currentPageIndex] = pageBlocks;
      return nextPages;
    });
  };

  const handlePaletteDragStart = (e, elementType) => {
    setDragItem({ type: 'palette-element', elementType });
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleCanvasBlockDragStart = (e, index) => {
    setDragItem({ type: 'canvas-block', index, pageIndex: currentPageIndex });
    e.dataTransfer.effectAllowed = 'move';
  };

  const insertBlockAt = (block, targetIndex, targetPageIdx) => {
    setPages((prevPages) => {
      const nextPages = [...prevPages];
      const targetPage = [...(nextPages[targetPageIdx] || [])];
      targetPage.splice(targetIndex, 0, block);
      nextPages[targetPageIdx] = targetPage;
      return nextPages;
    });
  };

  const moveBlockBetweenPages = (fromPageIdx, fromIndex, toPageIdx, toIndex) => {
    setPages((prevPages) => {
      const nextPages = [...prevPages];
      const sourcePage = [...(nextPages[fromPageIdx] || [])];
      const [moved] = sourcePage.splice(fromIndex, 1);
      
      const targetPage = fromPageIdx === toPageIdx ? sourcePage : [...(nextPages[toPageIdx] || [])];
      const adjustedIndex = fromPageIdx === toPageIdx && fromIndex < toIndex ? toIndex - 1 : toIndex;
      targetPage.splice(adjustedIndex, 0, moved);

      nextPages[fromPageIdx] = sourcePage;
      nextPages[toPageIdx] = targetPage;
      return nextPages;
    });
  };

  const handleCardDragOver = (e, index) => {
    if (isPreviewMode) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? 'before' : 'after';
    setDropIndicator({ index, position });
  };

  const handleDropOnBlock = (e, index, targetPageIdx) => {
    if (isPreviewMode) return;
    e.preventDefault();
    e.stopPropagation();
    if (!dragItem || !dropIndicator) return;
    const targetIndex = dropIndicator.position === 'before' ? index : index + 1;
    
    if (dragItem.type === 'palette-element') {
      const block = createBlock(dragItem.elementType);
      if (block) insertBlockAt(block, targetIndex, targetPageIdx);
    } else if (dragItem.type === 'canvas-block') {
      moveBlockBetweenPages(dragItem.pageIndex, dragItem.index, targetPageIdx, targetIndex);
    }
    setDragItem(null);
    setDropIndicator(null);
  };

  const handleContainerDrop = (e, targetPageIdx) => {
    if (isPreviewMode) return;
    e.preventDefault();
    if (!dragItem) return;
    const targetPage = pages[targetPageIdx] || [];
    const targetIndex = targetPage.length;

    if (dragItem.type === 'palette-element') {
      const block = createBlock(dragItem.elementType);
      if (block) insertBlockAt(block, targetIndex, targetPageIdx);
    } else if (dragItem.type === 'canvas-block') {
      moveBlockBetweenPages(dragItem.pageIndex, dragItem.index, targetPageIdx, targetIndex);
    }
    setDragItem(null);
    setDropIndicator(null);
  };

  const appendFromPalette = (elementType) => {
    if (isPreviewMode) return;
    const block = createBlock(elementType);
    if (block) {
      setPages((prevPages) => {
        const nextPages = [...prevPages];
        nextPages[currentPageIndex] = [...(nextPages[currentPageIndex] || []), block];
        return nextPages;
      });
    }
  };

  const removeBlock = (instanceId) => {
    setPages((prev) => prev.map((page) => page.filter((b) => b.instanceId !== instanceId)));
  };

  const clearCanvas = () => {
    setPages((prevPages) => {
      const nextPages = [...prevPages];
      nextPages[currentPageIndex] = [];
      return nextPages;
    });
  };

  const updateBlock = (instanceId, updaterFn) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.map((b) => (b.instanceId === instanceId ? updaterFn(b) : b))
      )
    );
  };

  const updateField = (instanceId, key, value) => updateBlock(instanceId, (b) => ({ ...b, [key]: value }));
  
  const updateQuestionType = (instanceId, newQType) => {
    updateBlock(instanceId, (b) => {
      const defaultOptions = ['A. Option 1', 'B. Option 2', 'C. Option 3', 'D. Option 4'];
      return {
        ...b,
        qType: newQType,
        options: newQType === 'text' ? undefined : (b.options && Array.isArray(b.options) ? b.options : defaultOptions),
        correctAnswer: newQType === 'text' ? '' : (newQType === 'multi' ? [0] : 0)
      };
    });
  };

  const updateTableHeader = (instanceId, colIndex, value) =>
    updateBlock(instanceId, (b) => ({
      ...b,
      headers: b.headers.map((h, i) => (i === colIndex ? value : h)),
    }));
  const updateTableCell = (instanceId, rowIndex, colIndex, value) =>
    updateBlock(instanceId, (b) => ({
      ...b,
      rows: b.rows.map((row, r) => (r === rowIndex ? row.map((c, ci) => (ci === colIndex ? value : c)) : row)),
    }));
  const addTableRow = (instanceId) =>
    updateBlock(instanceId, (b) => ({ ...b, rows: [...b.rows, b.headers.map(() => '')] }));
  const addTableColumn = (instanceId) =>
    updateBlock(instanceId, (b) => ({
      ...b,
      headers: [...b.headers, `Col ${b.headers.length + 1}`],
      rows: b.rows.map((row) => [...row, '']),
    }));
  const removeTableColumn = (instanceId, colIndex) =>
    updateBlock(instanceId, (b) => ({
      ...b,
      headers: b.headers.filter((_, i) => i !== colIndex),
      rows: b.rows.map((row) => row.filter((_, i) => i !== colIndex)),
    }));
  const updateOptionText = (instanceId, optIndex, value) =>
    updateBlock(instanceId, (b) => ({
      ...b,
      options: (b.options || []).map((o, i) => (i === optIndex ? value : o)),
    }));
  const addOption = (instanceId) => updateBlock(instanceId, (b) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const nextLetter = letters[b.options.length] || 'X';
    return { ...b, options: [...(b.options || []), `${nextLetter}. New Option`] };
  });
  const removeOption = (instanceId, optIndex) =>
    updateBlock(instanceId, (b) => ({
      ...b,
      options: (b.options || []).filter((_, i) => i !== optIndex),
      correctAnswer: b.qType === 'single' 
        ? (b.correctAnswer === optIndex ? 0 : (b.correctAnswer > optIndex ? b.correctAnswer - 1 : b.correctAnswer))
        : (b.correctAnswer || []).filter(idx => idx !== optIndex).map(idx => idx > optIndex ? idx - 1 : idx)
    }));

  const handleSaveAssessment = async () => {
    const totalBlocks = pages.reduce((acc, p) => acc + p.length, 0);
    if (totalBlocks === 0) {
      alert('Add at least one block across pages before saving.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please log in again.');
      return;
    }
    setIsSaving(true);
    try {
      const flattenedCanvasBlocks = pages.flat();
      const htmlContent = buildStandaloneHtml(pages, courseTitle);
      
      const res = await fetch(`${API_URL}/api/courses/${activeCourseId}/assessment/${assessmentType}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ html: htmlContent, canvasBlocks: flattenedCanvasBlocks, pages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save assessment');
      setSavedSlug(data.slug);
      alert(`${assessmentType === 'practical' ? 'Practical' : 'Knowledge'} assessment saved successfully! Slug: ${data.slug}`);
      
      if (typeof onBackToDocument === 'function') {
        onBackToDocument(pages);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving assessment: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintDocument = () => {
    const html = buildStandaloneHtml(pages, courseTitle);
    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!printWindow) {
      alert('Popup blocker prevented print window from opening.');
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', background: '#f4efe4', position: 'fixed', top: 0, left: 0, zIndex: 9999, color: '#2a2320', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 1.5rem', background: '#ffffff', borderBottom: '1px solid #e7ded2' }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#2a2320', margin: 0 }}>Form Designer ({assessmentType.toUpperCase()})</h2>
          <span style={{ fontSize: '0.75rem', color: '#8a7f7a' }}>Customize your assessment's structure &amp; content</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              padding: '0.45rem 1rem',
              background: isPreviewMode ? '#b8285a' : '#fbf9f7',
              border: '1px solid #e8e2dc',
              color: isPreviewMode ? '#fff' : '#2a2320',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {isPreviewMode ? <><Edit3 size={15} /> Exit Preview</> : <><Eye size={15} /> Student Preview Mode</>}
          </button>
          <button type="button" className="btn-secondary" onClick={handlePrintDocument} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
            <Printer size={15} /> Print Sheet
          </button>
         
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => { 
              if (typeof onBackToDocument === 'function') { 
                onBackToDocument(pages); 
              } 
            }} 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.45rem 1rem' }}
          >
            <ArrowLeft size={15} /> View Finished Document
          </button>
        </div>
      </div>

      {/* 2-Column Workspace Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* LEFT COLUMN: ELEMENTS PALETTE PANEL */}
        {!isPreviewMode && (
          <div style={{ width: '300px', background: '#ffffff', borderRight: '1px solid #e7ded2', display: 'flex', flexDirection: 'column', padding: '1.25rem', overflowY: 'auto' }}>
            <div style={{ marginBottom: '1.2rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2a2320', marginBottom: '0.2rem' }}>Elements</h3>
              <p style={{ fontSize: '0.78rem', color: '#8a7f7a' }}>Drag an element to the active page or click <strong>+</strong>.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {PALETTE_ELEMENTS.map((el) => {
                const Icon = el.icon;
                return (
                  <div
                    key={el.elementType}
                    className="palette-card"
                    draggable
                    onDragStart={(e) => handlePaletteDragStart(e, el.elementType)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#fbf9f7', border: '1px solid #e8e2dc', borderRadius: '10px', cursor: 'grab', transition: 'all 0.2s' }}
                    title="Drag to active page or click +"
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0e6e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b8285a' }}>
                      <Icon size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: '#2a2320' }}>{el.label}</strong>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#8a7f7a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{el.description}</span>
                    </div>
                    <button type="button" onClick={() => appendFromPalette(el.elementType)} title="Add to active page bottom" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#8a7f7a', padding: '4px' }}>
                      <Plus size={14} />
                    </button>
                    <GripVertical size={14} style={{ color: '#ccc' }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: CENTRAL SHEET BUILDER CANVAS */}
        <div style={{ flex: 1, background: '#f6f3ef', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          
          {/* Top Canvas Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 2rem', background: '#ffffff', borderBottom: '1px solid #e7ded2', zIndex: 5 }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2a2320', margin: 0 }}>
                {isPreviewMode ? 'Student Test View — ' : 'Canvas Builder — '} Active Page {currentPageIndex + 1} of {pages.length}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#8a7f7a', margin: 0 }}>
                {isPreviewMode ? 'Interactive mode enabled.' : 'Pages automatically expand or create new sheets when content grows.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {savedSlug && (
                <a href={`/assessment/${savedSlug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#b8285a', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Live Link <ExternalLink size={12} />
                </a>
              )}
              {!isPreviewMode && pages[currentPageIndex]?.length > 0 && (
                <button type="button" className="btn-secondary" onClick={clearCanvas} title="Clear active page blocks" style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}>
                  <RotateCcw size={13} /> Reset Active Page
                </button>
              )}
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveAssessment}
                disabled={isSaving}
                style={{ background: '#b8285a', borderColor: '#b8285a', padding: '0.45rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {isSaving ? <><Loader2 size={13} className="spin" /> Saving...</> : <><Save size={13} /> Save Form</>}
              </button>
            </div>
          </div>

          {/* Scrollable A4 Document Sheet Area */}
          <div
            ref={workspaceScrollRef}
            style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', paddingBottom: '7rem' }}
          >
            {pages.map((pageBlocks, pIdx) => (
              <div
                key={pIdx}
                onClick={() => setCurrentPageIndex(pIdx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleContainerDrop(e, pIdx)}
                style={{
                  width: '780px',
                  maxWidth: '100%',
                  minHeight: 'auto',
                  height: 'auto',
                  background: '#ffffff',
                  boxShadow: currentPageIndex === pIdx ? '0 0 0 2px #b8285a, 0 10px 25px rgba(0,0,0,0.08)' : '0 10px 25px rgba(0,0,0,0.08)',
                  borderRadius: '12px',
                  padding: '2.5rem 2.8rem',
                  boxSizing: 'border-box',
                  border: currentPageIndex === pIdx ? '1px solid #b8285a' : '1px solid #e8e2dc',
                  position: 'relative',
                  pageBreakAfter: 'always',
                  breakAfter: 'page',
                  overflow: 'visible'
                }}
              >
                
                {/* Sheet Header Masthead */}
                {pIdx === 0 ? (
                  <div style={{ display: 'flex', gap: '1.25rem', borderBottom: '2px solid #3a0d24', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ width: '55px', height: '55px', border: '1px solid #e8e2dc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#8a7f7a', background: '#fbf9f7', borderRadius: '6px', fontSize: '8pt' }}>[LOGO]</div>
                    <div>
                      <h3 style={{ fontSize: '8pt', margin: 0, textTransform: 'uppercase', color: '#8a7f7a' }}>[RTO_LEGAL_NAME] | RTO [RTO_ID]</h3>
                      <h1 style={{ fontSize: '13pt', margin: '0.1rem 0', color: '#2a2320' }}>Assessment Form</h1>
                      <p style={{ fontSize: '9pt', margin: 0, color: '#b8285a', fontWeight: 600 }}>{courseTitle} — Page {pIdx + 1}</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.3rem', marginBottom: '1rem', fontSize: '8pt', color: '#8a7f7a', textAlign: 'right' }}>
                    {courseTitle} — Page {pIdx + 1} (Continuation)
                  </div>
                )}

                {pageBlocks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#8a7f7a', border: '2px dashed #e8e2dc', borderRadius: '12px', marginTop: '1rem' }}>
                    <Inbox size={35} style={{ marginBottom: '0.5rem', color: '#b8285a', opacity: 0.7 }} />
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2a2320', margin: '0 0 4px' }}>Page {pIdx + 1} is empty</p>
                    {!isPreviewMode && <p style={{ fontSize: '0.8rem', margin: 0 }}>Click this page to select it, then drag elements here or click <strong>+</strong>.</p>}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {pageBlocks.map((block, index) => {
                      const isOverBefore = dropIndicator?.index === index && dropIndicator?.position === 'before';
                      const isOverAfter = dropIndicator?.index === index && dropIndicator?.position === 'after';

                      return (
                        <div
                          key={block.instanceId}
                          onDragOver={(e) => {
                            setCurrentPageIndex(pIdx);
                            handleCardDragOver(e, index);
                          }}
                          onDragLeave={() => setDropIndicator(null)}
                          onDrop={(e) => {
                            setCurrentPageIndex(pIdx);
                            handleDropOnBlock(e, index, pIdx);
                          }}
                          className="section-card-wrapper"
                          style={{
                            background: '#fff',
                            border: '1px solid transparent',
                            borderRadius: '6px',
                            padding: block.padding || '0.4rem 0',
                            position: 'relative',
                            borderTop: !isPreviewMode && isOverBefore ? '2px solid #b8285a' : undefined,
                            borderBottom: !isPreviewMode && isOverAfter ? '2px solid #b8285a' : undefined,
                            transition: 'background 0.15s ease',
                          }}
                        >
                          {/* HOVER-ONLY FLOATING TOOLBAR */}
                          {!isPreviewMode && (
                            <div className="section-floating-toolbar" style={{ position: 'absolute', top: '-10px', right: '0', display: 'none', alignItems: 'center', gap: '4px', background: '#ffffff', padding: '3px 6px', borderRadius: '6px', border: '1px solid #e8e2dc', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 5 }}>
                              <div draggable onDragStart={(e) => handleCanvasBlockDragStart(e, index)} style={{ cursor: 'grab', color: '#8a7f7a', padding: '0 2px' }} title="Drag to reorder">
                                <GripVertical size={14} />
                              </div>
                              <button type="button" onClick={() => { setCurrentPageIndex(pIdx); setCroppingBlock(block); setCropPadding(block.padding || '0.4rem 0'); }} style={{ background: '#f6f3ef', border: '1px solid #e8e2dc', borderRadius: '4px', padding: '2px 5px', cursor: 'pointer', color: '#2a2320', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px' }} title="Adjust Spacing"><Crop size={11} /> Spacing</button>
                              <button type="button" onClick={() => duplicateBlock(block)} style={{ background: '#f6f3ef', border: '1px solid #e8e2dc', borderRadius: '4px', padding: '2px 4px', cursor: 'pointer', color: '#2a2320' }} title="Duplicate"><Copy size={12} /></button>
                              <button type="button" disabled={index === 0 && pIdx === 0} onClick={() => moveBlockByOffset(index, -1)} style={{ background: '#f6f3ef', border: '1px solid #e8e2dc', borderRadius: '4px', padding: '2px', cursor: 'pointer' }} title="Move Up"><ChevronUp size={12} /></button>
                              <button type="button" disabled={index === pageBlocks.length - 1 && pIdx === pages.length - 1} onClick={() => moveBlockByOffset(index, 1)} style={{ background: '#f6f3ef', border: '1px solid #e8e2dc', borderRadius: '4px', padding: '2px', cursor: 'pointer' }} title="Move Down"><ChevronDown size={12} /></button>
                              <button type="button" onClick={() => removeBlock(block.instanceId)} style={{ background: '#fde8e8', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '4px', padding: '2px 5px', cursor: 'pointer' }} title="Remove"><Trash2 size={12} /></button>
                            </div>
                          )}

                          {/* Block Editors */}
                          <div>
                            {block.type === 'title' && (
                              <h3 style={{ fontSize: '11pt', fontWeight: 700, color: '#2a2320', margin: '0 0 0.2rem 0', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.15rem' }}>
                                {isPreviewMode ? block.text : (
                                  <input
                                    type="text"
                                    style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '11pt', fontWeight: 700, outline: 'none' }}
                                    value={block.text || ''}
                                    onChange={(e) => updateField(block.instanceId, 'text', e.target.value)}
                                  />
                                )}
                              </h3>
                            )}

                            {block.type === 'description' && (
                              <p style={{ fontSize: '9.5pt', color: '#2a2320', margin: '0 0 0.3rem 0', lineHeight: 1.4 }}>
                                {isPreviewMode ? block.text : (
                                  <textarea
                                    style={{ width: '100%', border: '1px dashed #cbd5e1', padding: '0.2rem', background: 'transparent', fontSize: '9.5pt', minHeight: '40px' }}
                                    value={block.text || ''}
                                    onChange={(e) => updateField(block.instanceId, 'text', e.target.value)}
                                  />
                                )}
                              </p>
                            )}

                            {block.type === 'datetime' && (
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '0.3rem' }}>
                                {isPreviewMode ? (
                                  <div style={{ fontSize: '9pt' }}>
                                    <strong>{block.label}:</strong> <input type="datetime-local" defaultValue={block.value} style={{ marginLeft: '6px', padding: '0.2rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                                  </div>
                                ) : (
                                  <>
                                    <input
                                      type="text"
                                      style={{ flex: 1, padding: '0.3rem', border: '1px solid #e8e2dc', borderRadius: '6px', fontSize: '9pt' }}
                                      value={block.label || ''}
                                      onChange={(e) => updateField(block.instanceId, 'label', e.target.value)}
                                    />
                                    <input
                                      type="datetime-local"
                                      style={{ padding: '0.3rem', border: '1px solid #e8e2dc', borderRadius: '6px', fontSize: '9pt' }}
                                      value={block.value || ''}
                                      onChange={(e) => updateField(block.instanceId, 'value', e.target.value)}
                                    />
                                  </>
                                )}
                              </div>
                            )}

                            {block.type === 'table' && (
                              <div className="table-block-container" style={{ marginBottom: '0.4rem', position: 'relative' }}>
                                {block.title && <strong style={{ display: 'block', fontSize: '9.5pt', marginBottom: '4px', color: '#2a2320' }}>{block.title}</strong>}
                                {!isPreviewMode && (
                                  <input
                                    type="text"
                                    style={{ width: '100%', padding: '0.3rem', marginBottom: '6px', border: '1px solid #e8e2dc', borderRadius: '6px', fontSize: '8.5pt' }}
                                    placeholder="Table Title / Instructions"
                                    value={block.title || ''}
                                    onChange={(e) => updateField(block.instanceId, 'title', e.target.value)}
                                  />
                                )}
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.5pt' }}>
                                  <thead>
                                    <tr>
                                      {(block.headers || []).map((h, colIdx) => (
                                        <th key={colIdx} style={{ border: '1px solid #cbd5e1', padding: '4px 6px', background: '#f8fafc', textAlign: 'left' }}>
                                          {isPreviewMode ? (
                                            <span style={{ fontWeight: 'bold' }}>{h}</span>
                                          ) : (
                                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                              <input style={{ width: '100%', border: 'none', background: 'transparent', fontWeight: 'bold' }} value={h || ''} onChange={(e) => updateTableHeader(block.instanceId, colIdx, e.target.value)} />
                                              <button type="button" onClick={() => removeTableColumn(block.instanceId, colIdx)} disabled={block.headers.length <= 1} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#991b1b' }}><Trash2 size={10} /></button>
                                            </div>
                                          )}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(block.rows || []).map((row, rowIdx) => (
                                      <tr key={rowIdx}>
                                        {row.map((cell, colIdx) => (
                                          <td key={colIdx} style={{ border: '1px solid #cbd5e1', padding: '4px 6px' }}>
                                            {isPreviewMode ? (
                                              <input type="text" defaultValue={cell} placeholder="Enter value..." style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }} />
                                            ) : (
                                              <input style={{ width: '100%', border: 'none', background: 'transparent' }} value={cell || ''} onChange={(e) => updateTableCell(block.instanceId, rowIdx, colIdx, e.target.value)} />
                                            )}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                {!isPreviewMode && (
                                  <div className="table-action-toolbar" style={{ display: 'none', gap: '6px', marginTop: '4px' }}>
                                    <button type="button" className="btn-secondary" onClick={() => addTableRow(block.instanceId)} style={{ fontSize: '10px', padding: '2px 5px' }}><Plus size={10} /> Add Row</button>
                                    <button type="button" className="btn-secondary" onClick={() => addTableColumn(block.instanceId)} style={{ fontSize: '10px', padding: '2px 5px' }}><Plus size={10} /> Add Col</button>
                                  </div>
                                )}
                              </div>
                            )}

                            {block.type === 'question' && (
                              <div className="question-block-container" style={{ marginBottom: '0.4rem', position: 'relative' }}>
                                {!isPreviewMode && (
                                  <div className="question-type-switcher" style={{ display: 'none', position: 'absolute', top: '-25px', left: 0, gap: '4px', background: '#fff', padding: '2px', border: '1px solid #e8e2dc', borderRadius: '4px', zIndex: 3 }}>
                                    <button type="button" onClick={() => updateQuestionType(block.instanceId, 'single')} style={{ padding: '2px 6px', fontSize: '10px', background: block.qType === 'single' ? '#b8285a' : '#f6f3ef', color: block.qType === 'single' ? '#fff' : '#2a2320', border: '1px solid #e8e2dc', borderRadius: '4px', cursor: 'pointer' }}>Single</button>
                                    <button type="button" onClick={() => updateQuestionType(block.instanceId, 'multi')} style={{ padding: '2px 6px', fontSize: '10px', background: block.qType === 'multi' ? '#b8285a' : '#f6f3ef', color: block.qType === 'multi' ? '#fff' : '#2a2320', border: '1px solid #e8e2dc', borderRadius: '4px', cursor: 'pointer' }}>Multi</button>
                                    <button type="button" onClick={() => updateQuestionType(block.instanceId, 'text')} style={{ padding: '2px 6px', fontSize: '10px', background: block.qType === 'text' ? '#b8285a' : '#f6f3ef', color: block.qType === 'text' ? '#fff' : '#2a2320', border: '1px solid #e8e2dc', borderRadius: '4px', cursor: 'pointer' }}>Open</button>
                                  </div>
                                )}

                                <p style={{ fontSize: '9.5pt', fontWeight: 600, color: '#2a2320', margin: '0 0 0.2rem 0' }}>
                                  {isPreviewMode ? block.text : (
                                    <textarea
                                      style={{ width: '100%', border: '1px dashed #cbd5e1', padding: '0.2rem', background: 'transparent', fontSize: '9.5pt' }}
                                      rows={1}
                                      placeholder="Type question prompt here..."
                                      value={block.text || ''}
                                      onChange={(e) => updateField(block.instanceId, 'text', e.target.value)}
                                    />
                                  )}
                                </p>

                                {block.qType === 'text' ? (
                                  isPreviewMode ? (
                                    <textarea style={{ width: '100%', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '9pt', minHeight: '50px', outline: 'none' }} placeholder={block.placeholder || 'Write your answer here...'} />
                                  ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      <input
                                        type="text"
                                        style={{ width: '100%', padding: '0.3rem', border: '1px dashed #cbd5e1', borderRadius: '4px', fontSize: '8.5pt', color: '#8a7f7a' }}
                                        placeholder="Answer space placeholder..."
                                        value={block.placeholder || ''}
                                        onChange={(e) => updateField(block.instanceId, 'placeholder', e.target.value)}
                                      />
                                      <input
                                        type="text"
                                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: '4px', fontSize: '8.5pt', color: '#15803d' }}
                                        placeholder="Suggested Correct Answer / Marking Guide (for Assessors)..."
                                        value={block.sampleAnswer || ''}
                                        onChange={(e) => updateField(block.instanceId, 'sampleAnswer', e.target.value)}
                                      />
                                    </div>
                                  )
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ fontSize: '7.5pt', color: '#b8285a', fontWeight: 600, marginBottom: '2px' }}>
                                      * Select the radio or checkbox next to an option to mark it as the correct answer.
                                    </div>
                                    {(block.options || []).map((opt, optIdx) => {
                                      const isCorrect = block.qType === 'single'
                                        ? block.correctAnswer === optIdx
                                        : (block.correctAnswer || []).includes(optIdx);

                                      return (
                                        <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isCorrect ? '#f0fdf4' : 'transparent', padding: '2px 4px', borderRadius: '4px' }}>
                                          <input
                                            type={block.qType === 'multi' ? 'checkbox' : 'radio'}
                                            name={`correct_${block.instanceId}`}
                                            checked={isCorrect}
                                            onChange={() => {
                                              if (block.qType === 'single') {
                                                updateField(block.instanceId, 'correctAnswer', optIdx);
                                              } else {
                                                const current = block.correctAnswer || [];
                                                const updated = current.includes(optIdx)
                                                  ? current.filter(i => i !== optIdx)
                                                  : [...current, optIdx];
                                                updateField(block.instanceId, 'correctAnswer', updated);
                                              }
                                            }}
                                            title="Mark as correct answer"
                                          />
                                          {isPreviewMode ? (
                                            <span style={{ fontSize: '9pt' }}>{opt}</span>
                                          ) : (
                                            <>
                                              <input
                                                type="text"
                                                style={{ flex: 1, padding: '0.2rem 0.3rem', border: '1px solid #e8e2dc', borderRadius: '4px', fontSize: '8.5pt' }}
                                                value={opt || ''}
                                                onChange={(e) => updateOptionText(block.instanceId, optIdx, e.target.value)}
                                              />
                                              <button type="button" onClick={() => removeOption(block.instanceId, optIdx)} disabled={(block.options || []).length <= 1} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#991b1b' }}><Trash2 size={11} /></button>
                                            </>
                                          )}
                                        </div>
                                      );
                                    })}
                                    {!isPreviewMode && (
                                      <button type="button" onClick={() => addOption(block.instanceId)} style={{ background: 'transparent', border: 'none', color: '#b8285a', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textAlign: 'left', padding: '2px 0', display: 'flex', alignItems: 'center', gap: '3px' }}><Plus size={11} /> Add option</button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* BOTTOM-LEFT PINNED PAGE DRAWER */}
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '0.5rem 0.8rem', borderRadius: '10px', border: '1px solid #e8e2dc', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 10, maxWidth: 'calc(100% - 2rem)', overflowX: 'auto' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {pages.map((_, pIdx) => (
                <div
                  key={pIdx}
                  onClick={() => setCurrentPageIndex(pIdx)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '65px',
                    height: '50px',
                    background: currentPageIndex === pIdx ? '#f0e6e9' : '#fbf9f7',
                    border: currentPageIndex === pIdx ? '2px solid #b8285a' : '1px solid #e8e2dc',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                  }}
                  title={`Go to Page ${pIdx + 1}`}
                >
                  <FileText size={16} color={currentPageIndex === pIdx ? '#b8285a' : '#8a7f7a'} />
                  <span style={{ fontSize: '10px', fontWeight: 600, color: currentPageIndex === pIdx ? '#2a2320' : '#8a7f7a', marginTop: '2px' }}>
                    P. {pIdx + 1}
                  </span>
                  {!isPreviewMode && pages.length > 1 && currentPageIndex === pIdx && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePage(pIdx);
                      }}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: '#991b1b',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      title="Delete Page"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {!isPreviewMode && (
              <>
                <div style={{ width: '1px', height: '32px', background: '#e8e2dc', margin: '0 4px' }} />
                <button
                  type="button"
                  onClick={addPage}
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fbf9f7',
                    border: '1px dashed #b8285a',
                    color: '#b8285a',
                    width: '65px',
                    height: '50px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    gap: '2px'
                  }}
                  title="Add New Page"
                >
                  <Plus size={16} />
                  Add Page
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      <style>{`
        .section-card-wrapper:hover .section-floating-toolbar {
          display: flex !important;
        }
        .section-card-wrapper:hover .question-type-switcher {
          display: flex !important;
        }
        .section-card-wrapper:hover .table-action-toolbar {
          display: flex !important;
        }
        .spin { animation: spin 0.9s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* SECTION SPACING ADJUSTER MODAL */}
      {croppingBlock && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ background: '#ffffff', border: '1px solid #e8e2dc', borderRadius: '12px', padding: '1.5rem', width: '380px', color: '#2a2320', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#b8285a' }}>
              <Crop size={18} /> Spacing & Padding Adjuster
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#8a7f7a', marginBottom: '1rem' }}>Select vertical spacing for this section:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
              {['0.2rem 0', '0.4rem 0', '0.8rem 0', '1.2rem 0'].map((pad) => (
                <button
                  key={pad}
                  type="button"
                  onClick={() => setCropPadding(pad)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: cropPadding === pad ? '#f0e6e9' : '#fbf9f7',
                    border: cropPadding === pad ? '1px solid #b8285a' : '1px solid #e8e2dc',
                    color: '#2a2320',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: cropPadding === pad ? 600 : 400,
                    textAlign: 'left'
                  }}
                >
                  Spacing Preset: {pad}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setCroppingBlock(null)}
                style={{ padding: '0.4rem 0.8rem', background: '#fbf9f7', border: '1px solid #e8e2dc', color: '#2a2320', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateField(croppingBlock.instanceId, 'padding', cropPadding);
                  setCroppingBlock(null);
                }}
                style={{ padding: '0.4rem 1rem', background: '#b8285a', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Apply Spacing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}