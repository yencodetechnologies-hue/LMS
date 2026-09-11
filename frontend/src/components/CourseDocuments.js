import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Save, Loader2 } from 'lucide-react';

import DashboardLayout from '../components/DashboardLayout';
import MappingDocTab from '../components/documents/MappingDocTab';
import KnowledgeAssessmentDesignPage from '../components/documents/KnowledgeAssessmentDesignPage';
import KnowledgeAnswerGuideTab from '../components/documents/KnowledgeAnswerGuideTab';
import PracticalAssessmentTab from '../components/documents/PracticalAssessmentTab';
import PracticalMarkingGuideTab from '../components/documents/PracticalMarkingGuide';
import JobPackTemplateTab from '../components/documents/JobPackTemplateTab';
import { API_URL } from '../data/service';

import '../styles/CourseDocuments.css';

export default function CourseDocuments() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditingBuilder, setIsEditingBuilder] = useState(false);

  const tabs = [
    { id: 'mapping', title: '1. Mapping Document', code: 'AT-ICTBWN307-00' },
    { id: 'assessment', title: '2. Knowledge Assessment', code: 'AT-ICTBWN307-01' },
    { id: 'answer-guide', title: '3. Knowledge Answer Guide', code: 'AT-ICTBWN307-01-AG' },
    { id: 'practical', title: '4. Practical Assessment', code: 'AT-ICTBWN307-02' },
    { id: 'marking-guide', title: '5. Practical Marking Guide', code: 'AT-ICTBWN307-02-AG' },
    { id: 'job-pack', title: '6. Job Pack Template', code: 'JP-ICTBWN307-01' },
  ];

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses/${courseId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setCourse(data.course || { title: 'ICTBWN307 Use optical measuring instruments — Release 1', _id: courseId });
        }
      } catch (err) {
        console.error('Failed to load course details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <div className="table-loading" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={24} className="spin-icon" /> Loading templates...
      </div>
    );
  }

  const navigationHeader = (
    <div className="doc-manager-header">
      <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard/courses')}>
        <ArrowLeft size={16} /> Back to Courses
      </button>
      <div className="doc-manager-actions">
        {activeTab !== 1 && (
          <>
            <button type="button" className="btn-secondary" onClick={() => window.print()}>
              <Printer size={16} /> Print Document
            </button>
            <button type="button" className="btn-primary" onClick={() => alert('Document state saved.')}>
              <Save size={16} /> Save Document
            </button>
          </>
        )}
      </div>
    </div>
  );

  const tabSelectionBar = (
    <div className="doc-tabs-bar">
      {tabs.map((tab, idx) => (
        <button
          key={tab.id}
          type="button"
          className={`doc-tab-btn ${activeTab === idx ? 'active' : ''}`}
          onClick={() => {
            setActiveTab(idx);
            setIsEditingBuilder(false);
          }}
        >
          <span className="doc-tab-label">{tab.title}</span>
          <span className="doc-tab-code">{tab.code}</span>
        </button>
      ))}
    </div>
  );

  /* =============================================================
     FULLSCREEN CHECK: If active tab is Knowledge Assessment AND 
     user clicked edit, render completely without DashboardLayout (No Sidebar).
  ============================================================== */
  if (activeTab === 1 && isEditingBuilder) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#f4efe4', overflow: 'hidden', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', width: '100%', height: '100%' }}>
          <KnowledgeAssessmentDesignPage 
            course={course} 
            onEditModeChange={(editing) => setIsEditingBuilder(editing)} 
          />
        </div>
      </div>
    );
  }

  /* =============================================================
     STANDARD VIEW (With DashboardLayout Sidebar)
  ============================================================== */
  return (
    <DashboardLayout
      title="Course Compliance Documents"
      subtitle={course ? `Viewing evidence and assessment suite for: ${course.title}` : 'Loading...'}
    >
      {navigationHeader}

      <div className="doc-manager-container">
        {tabSelectionBar}

        <div className="doc-sheet-viewport">
          <div className="doc-sheet">
            {activeTab === 0 && <MappingDocTab course={course} />}
            {activeTab === 1 && (
              <KnowledgeAssessmentDesignPage 
                course={course} 
                onEditModeChange={(editing) => setIsEditingBuilder(editing)} 
              />
            )}
            {activeTab === 2 && <KnowledgeAnswerGuideTab course={course} />}
            {activeTab === 3 && <PracticalAssessmentTab course={course} />}
            {activeTab === 4 && <PracticalMarkingGuideTab course={course} />}
            {activeTab === 5 && <JobPackTemplateTab course={course} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}