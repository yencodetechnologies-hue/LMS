import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../data/service';

export default function ViewAssessmentBySlug() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses/assessment/slug/${slug}`);
        if (!res.ok) throw new Error('Assessment not found');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [slug]);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading assessment...</div>;
  if (error) return <div style={{ padding: '3rem', textAlign: 'center', color: '#dc2626' }}>{error}</div>;

  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
      {/* Renders the complete HTML document inside an iframe */}
      <iframe
        title={data.courseTitle}
        srcDoc={data.html}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  );
}