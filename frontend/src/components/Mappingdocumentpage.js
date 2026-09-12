import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { API_URL } from '../data/service';
import MappingDocTab from '../components/documents/MappingDocTab';

// Print/PDF stylesheet — scoped to #printable-mapping-document so it only
// affects this document's sheet, and forces correct A4 pagination:
// - @page sets the physical page size/margins for the print engine
// - the on-screen box-shadow/rounded-card chrome is stripped for print
// - .page-break-before (already used to separate each numbered section)
// is honoured so each major section starts on its own page
const PRINT_STYLES = `
  @media print {
    @page {
      size: A4;
      margin: 12mm;
    }

    body * {
      visibility: hidden;
    }

    #printable-mapping-document,
    #printable-mapping-document * {
      visibility: visible;
    }

    #printable-mapping-document {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      max-width: 100%;
      margin: 0;
      padding: 0;
      box-shadow: none;
      border: none;
    }

    .mapping-doc-toolbar,
    .no-print {
      display: none !important;
    }

    #printable-mapping-document table {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    #printable-mapping-document tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    #printable-mapping-document .doc-sec-title {
      page-break-after: avoid;
      break-after: avoid;
    }

    #printable-mapping-document .doc-element-subheading {
      page-break-after: avoid;
      break-after: avoid;
    }
  }
`;

export default function MappingDocumentPage() {
  const { rtoNumber, courseId } = useParams();

  const [rtoData, setRtoData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/jobpack/${rtoNumber}/${courseId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load mapping document data');

        setRtoData(data.order);
        setCourseData(data.course);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rtoNumber, courseId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="dashboard-loading">Loading Mapping Document...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  return (
    <div>
      <style>{PRINT_STYLES}</style>

      <div
        className="mapping-doc-toolbar"
        style={{
          maxWidth: '840px',
          width: '100%',
          margin: '0 auto 1rem auto',
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '1rem 1rem 0 1rem',
        }}
      >
        <button
          type="button"
          onClick={handlePrint}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.85rem',
            padding: '0.5rem 1rem',
            background: '#b8285a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          <Printer size={15} /> Print / Save as PDF
        </button>
      </div>

      <MappingDocTab course={courseData} rtoData={rtoData} />
    </div>
  );
}