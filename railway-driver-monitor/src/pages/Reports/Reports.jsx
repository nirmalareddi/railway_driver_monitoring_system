import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FiFileText, 
  FiDownload, 
  FiVideo, 
  FiActivity,
  FiCode,
  FiDatabase,
  FiPrinter
} from 'react-icons/fi';
import { Button } from '@mui/material';
import { useAnalysisStore } from '../../store/analysisStore';
import { useReportStore } from '../../store/reportStore';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';
import ErrorState from '../../components/ErrorState/ErrorState';

export const Reports = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('videoId') || 'mock-vid-123';

  const { results, loadingResults, error, fetchResults } = useAnalysisStore();
  const { downloadReport, downloadVideo } = useReportStore();

  useEffect(() => {
    fetchResults(videoId);
  }, [videoId, fetchResults]);

  if (loadingResults) {
    return <LoadingSkeleton type="chart" count={1} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => fetchResults(videoId)} />;
  }

  if (!results) return null;

  const handleDownload = (format) => {
    if (format === 'video') {
      downloadVideo(videoId);
    } else {
      downloadReport(videoId, format);
    }
  };

  const reportCards = [
    { 
      type: 'detailed-json', 
      title: 'Detailed JSON Log', 
      desc: 'Export full frame-by-frame coordinate maps, eye aspect ratios, and threshold logs. Ideal for AI model verification.',
      icon: FiCode, 
      color: 'var(--accent-blue)', 
      btnText: 'DOWNLOAD JSON' 
    },
    { 
      type: 'summary-json', 
      title: 'Summary JSON Log', 
      desc: 'Contains high-level trip metadata, incident counts, and driver safety score calculations. Compact size.',
      icon: FiDatabase, 
      color: 'var(--accent-violet)', 
      btnText: 'DOWNLOAD JSON' 
    },
    { 
      type: 'csv', 
      title: 'CSV Incident Spreadsheet', 
      desc: 'Export incident logs as a tabular dataset ready to import directly into Microsoft Excel or Pandas dataframes.',
      icon: FiFileText, 
      color: 'var(--color-warning)', 
      btnText: 'DOWNLOAD CSV' 
    },
    { 
      type: 'pdf', 
      title: 'Printable PDF Report', 
      desc: 'Download a clean, formatted executive summary layout with charts, score gauges, and timestamps for printing.',
      icon: FiPrinter, 
      color: 'var(--color-danger)', 
      btnText: 'EXPORT PDF' 
    },
    { 
      type: 'video', 
      title: 'Annotated Video File', 
      desc: 'Download the compiled MP4 video overlaying visual AI bounding boxes, facial meshes, and timeline warning flags.',
      icon: FiVideo, 
      color: 'var(--color-success)', 
      btnText: 'DOWNLOAD VIDEO' 
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page Header */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#FFF', fontSize: '1.4rem', letterSpacing: '1px' }}>
          ANALYTICAL EXPORTS & REPORTS
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>
          Generate and download trip summaries, incident logs, and annotated media files in various developer formats.
        </p>
      </div>

      {/* Summary report statistics overview card */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '24px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
          gap: '20px', 
          textAlign: 'center' 
        }}
      >
        <div style={{ padding: '10px' }}>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Trip Duration</span>
          <strong style={{ fontSize: '1.25rem', color: '#FFF', fontFamily: 'var(--font-title)' }}>{results.duration}</strong>
        </div>
        <div style={{ padding: '10px', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Total Frames</span>
          <strong style={{ fontSize: '1.25rem', color: '#FFF', fontFamily: 'var(--font-title)' }}>{results.totalFrames}</strong>
        </div>
        <div style={{ padding: '10px', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Camera FPS</span>
          <strong style={{ fontSize: '1.25rem', color: '#FFF', fontFamily: 'var(--font-title)' }}>{results.fps} FPS</strong>
        </div>
        <div style={{ padding: '10px', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Resolution</span>
          <strong style={{ fontSize: '1.25rem', color: '#FFF', fontFamily: 'var(--font-title)' }}>{results.resolution}</strong>
        </div>
        <div style={{ padding: '10px', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '6px', textTransform: 'uppercase' }}>Total Incidents</span>
          <strong style={{ fontSize: '1.25rem', color: 'var(--color-danger)', fontFamily: 'var(--font-title)' }}>{results.totalIncidents}</strong>
        </div>
      </div>

      {/* Reports selector grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <FiActivity size={18} style={{ color: 'var(--accent-blue)' }} />
          <h3 style={{ fontSize: '1rem', color: '#FFF', fontWeight: 600, letterSpacing: '0.5px' }}>
            DOWNLOAD COMPILATION ARCHIVE
          </h3>
        </div>

        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '20px' 
          }}
        >
          {reportCards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.type} 
                className="glass-card" 
                style={{ 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div 
                    style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '8px', 
                      background: `${card.color}15`, 
                      border: `1px solid ${card.color}25`,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: card.color,
                      flexShrink: 0
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFF', marginBottom: '6px' }}>
                      {card.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: '1.5' }}>
                      {card.desc}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outlined"
                  onClick={() => handleDownload(card.type)}
                  startIcon={<FiDownload />}
                  style={{
                    borderColor: `${card.color}40`,
                    color: '#FFF',
                    fontFamily: 'var(--font-title)',
                    fontSize: '0.7rem',
                    padding: '8px 16px',
                    background: `${card.color}05`,
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${card.color}15`;
                    e.currentTarget.style.borderColor = card.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${card.color}05`;
                    e.currentTarget.style.borderColor = `${card.color}40`;
                  }}
                >
                  {card.btnText}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reports;
