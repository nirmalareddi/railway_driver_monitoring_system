import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  FiDownload, 
  FiFileText, 
  FiVideo, 
  FiAlertTriangle, 
  FiPlay,
  FiArrowLeft,
  FiLayers
} from 'react-icons/fi';
import { Button } from '@mui/material';
import { useAnalysisStore } from '../../store/analysisStore';
import { useReportStore } from '../../store/reportStore';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';
import ErrorState from '../../components/ErrorState/ErrorState';

export const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoId = searchParams.get('videoId') || 'mock-vid-123';
  const initialSeek = searchParams.get('seek');

  const { 
    results, 
    timeline, 
    loadingResults, 
    loadingTimeline, 
    error, 
    fetchResults, 
    fetchTimeline 
  } = useAnalysisStore();

  const { downloadReport, downloadVideo } = useReportStore();
  const [activeIncident, setActiveIncident] = useState(null);

  useEffect(() => {
    fetchResults(videoId);
    fetchTimeline(videoId);
  }, [videoId, fetchResults, fetchTimeline]);

  // Handle initial seek query params if coming from Dashboard
  useEffect(() => {
    if (initialSeek && timeline.length > 0) {
      const match = timeline.find((item) => item.timestamp === parseInt(initialSeek));
      if (match) {
        setActiveIncident(match);
      }
    }
  }, [initialSeek, timeline]);

  if (loadingResults || loadingTimeline) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <LoadingSkeleton type="card" count={2} />
        <LoadingSkeleton type="chart" count={1} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => { fetchResults(videoId); fetchTimeline(videoId); }} />;
  }

  if (!results) return null;

  const handleIncidentClick = (incident) => {
    setActiveIncident({ ...incident, _ts: Date.now() }); // Force effect re-trigger with timestamp modifier
  };

  const handleDownloadReport = () => downloadReport(videoId, 'pdf');
  const handleDownloadVideo = () => downloadVideo(videoId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{ 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              color: '#FFF', 
              padding: '10px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h2 style={{ fontFamily: 'var(--font-title)', color: '#FFF', fontSize: '1.4rem', letterSpacing: '1px' }}>
              ANALYSIS RESULTS
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Video ID: {videoId}</span>
          </div>
        </div>

        {/* Top Download Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="outlined"
            onClick={handleDownloadReport}
            startIcon={<FiFileText />}
            style={{
              borderColor: 'var(--border-glass)',
              color: 'var(--accent-blue)',
              fontFamily: 'var(--font-title)',
              fontSize: '0.75rem',
              padding: '8px 16px',
              background: 'rgba(0, 229, 255, 0.02)'
            }}
          >
            PDF Report
          </Button>
          <Button
            variant="contained"
            onClick={handleDownloadVideo}
            startIcon={<FiDownload />}
            style={{
              background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-blue))',
              fontFamily: 'var(--font-title)',
              fontSize: '0.75rem',
              padding: '8px 16px',
              boxShadow: 'var(--glow-violet)'
            }}
          >
            Annotated Video
          </Button>
        </div>
      </div>

      {/* Main Content Sections */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '20px' 
        }}
        className="results-grid"
      >
        {/* Left Column: Player (takes double span if possible) */}
        <div style={{ gridColumn: window.innerWidth >= 1024 ? 'span 2' : 'span 1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
          <VideoPlayer 
            videoUrl={results.videoUrl} 
            timeline={timeline} 
            activeIncident={activeIncident}
          />

          {/* Quick Metrics stats details bar */}
          <div className="glass-card" style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '4px' }}>Duration</span>
              <strong style={{ fontSize: '1rem', color: '#FFF' }}>{results.duration}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '4px' }}>FPS</span>
              <strong style={{ fontSize: '1rem', color: '#FFF' }}>{results.fps}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '4px' }}>Frames</span>
              <strong style={{ fontSize: '1rem', color: '#FFF' }}>{results.totalFrames}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '4px' }}>Resolution</span>
              <strong style={{ fontSize: '1rem', color: '#FFF' }}>{results.resolution}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Incident Summary panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary Counts Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '16px', textTransform: 'uppercase' }}>
              Incident Frequency
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Drowsiness */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255, 59, 107, 0.05)', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#F8FAFC' }}>Drowsiness Detected</span>
                <strong style={{ fontSize: '1rem', color: 'var(--color-danger)' }}>{results.incidentsSummary.drowsiness}</strong>
              </div>

              {/* Attention Loss */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255, 179, 0, 0.05)', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#F8FAFC' }}>Attention Loss</span>
                <strong style={{ fontSize: '1rem', color: 'var(--color-warning)' }}>{results.incidentsSummary.attentionLoss}</strong>
              </div>

              {/* Mobile Usage */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(109, 74, 255, 0.05)', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#F8FAFC' }}>Mobile Usage Detected</span>
                <strong style={{ fontSize: '1rem', color: 'var(--accent-violet)' }}>{results.incidentsSummary.mobileUsage}</strong>
              </div>

              {/* Face Not Visible */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(0, 229, 255, 0.05)', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: '#F8FAFC' }}>Face Not Visible</span>
                <strong style={{ fontSize: '1rem', color: 'var(--accent-blue)' }}>{results.incidentsSummary.faceNotVisible}</strong>
              </div>

              {/* Total Incidents */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFF' }}>Total Logged Incidents</span>
                <strong style={{ fontSize: '1.25rem', color: '#FFF', fontFamily: 'var(--font-title)', textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>
                  {results.totalIncidents}
                </strong>
              </div>
            </div>
          </div>

          {/* Jump To Incident List */}
          <div className="glass-card" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '16px', textTransform: 'uppercase' }}>
              Scrub to Incident
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1, maxHeight: '240px' }}>
              {timeline.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleIncidentClick(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="interactive-item"
                >
                  <img 
                    src={item.thumbnail} 
                    alt={item.type} 
                    style={{ width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F1F5F9' }}>{item.type}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontFamily: 'var(--font-title)' }}>
                        {item.timeString}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.65rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                      {item.description}
                    </p>
                  </div>
                  <div 
                    style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: 'rgba(0, 229, 255, 0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'var(--accent-blue)' 
                    }}
                  >
                    <FiPlay size={10} style={{ marginLeft: '1px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
