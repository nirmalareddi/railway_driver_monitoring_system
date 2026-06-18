import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FiFilter, 
  FiClock, 
  FiAlertCircle, 
  FiSearch,
  FiActivity,
  FiPlay,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { Button, MenuItem, Select, FormControl, InputLabel, TextField } from '@mui/material';
import { useAnalysisStore } from '../../store/analysisStore';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';
import ErrorState from '../../components/ErrorState/ErrorState';

export const Timeline = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('videoId') || 'mock-vid-123';

  const { 
    results, 
    timeline, 
    loadingResults, 
    loadingTimeline, 
    error,
    fetchResults, 
    fetchTimeline 
  } = useAnalysisStore();

  const [activeIncident, setActiveIncident] = useState(null);
  
  // Filtering States
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResults(videoId);
    fetchTimeline(videoId);
  }, [videoId, fetchResults, fetchTimeline]);

  // Set default active incident
  useEffect(() => {
    if (timeline.length > 0 && !activeIncident) {
      setActiveIncident(timeline[0]);
    }
  }, [timeline, activeIncident]);

  if (loadingResults || loadingTimeline) {
    return <LoadingSkeleton type="chart" count={2} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => { fetchResults(videoId); fetchTimeline(videoId); }} />;
  }

  // Filter logic
  const filteredTimeline = timeline.filter((item) => {
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesSeverity = filterSeverity === 'All' || item.severity === filterSeverity;
    const matchesSearch = searchQuery === '' || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSeverity && matchesSearch;
  });

  const handleCardClick = (incident) => {
    setActiveIncident(incident);
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'var(--color-danger)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--accent-blue)';
      default: return '#94A3B8';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#FFF', fontSize: '1.4rem', letterSpacing: '1px' }}>
          CHRONOLOGICAL INCIDENT TIMELINE
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>
          Review driver detections frame-by-frame along a synchronized linear timeline.
        </p>
      </div>

      {/* Filter Options panel */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '16px 20px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          gap: '16px',
          zIndex: 5
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)', fontSize: '0.9rem', fontWeight: 600 }}>
          <FiFilter /> <span>FILTERS:</span>
        </div>

        {/* Filter Type */}
        <FormControl size="small" style={{ minWidth: '160px' }}>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            displayEmpty
            sx={{
              color: '#FFF',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '6px',
              fontFamily: 'var(--font-title)',
              fontSize: '0.75rem',
              '& .MuiSelect-select': { padding: '8px 12px' },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: 'rgba(13, 20, 38, 0.95)',
                  border: '1px solid var(--border-glass)',
                  color: '#FFF'
                }
              }
            }}
          >
            <MenuItem value="All">All Detections</MenuItem>
            <MenuItem value="Drowsiness">Drowsiness</MenuItem>
            <MenuItem value="Attention Loss">Attention Loss</MenuItem>
            <MenuItem value="Mobile Usage">Mobile Usage</MenuItem>
            <MenuItem value="Face Not Visible">Face Not Visible</MenuItem>
          </Select>
        </FormControl>

        {/* Filter Severity */}
        <FormControl size="small" style={{ minWidth: '140px' }}>
          <Select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            displayEmpty
            sx={{
              color: '#FFF',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '6px',
              fontFamily: 'var(--font-title)',
              fontSize: '0.75rem',
              '& .MuiSelect-select': { padding: '8px 12px' },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' }
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: 'rgba(13, 20, 38, 0.95)',
                  border: '1px solid var(--border-glass)',
                  color: '#FFF'
                }
              }
            }}
          >
            <MenuItem value="All">All Severities</MenuItem>
            <MenuItem value="High">High Severity</MenuItem>
            <MenuItem value="Medium">Medium Severity</MenuItem>
            <MenuItem value="Low">Low Severity</MenuItem>
          </Select>
        </FormControl>

        {/* Search Field */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            type="text"
            placeholder="Search incident logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '6px',
              padding: '8px 12px 8px 36px',
              fontSize: '0.8rem',
              color: '#FFF',
              fontFamily: 'var(--font-content)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Main Split Layout: Player on Left, Event Info Card on Right */}
      {results && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ gridColumn: window.innerWidth >= 1024 ? 'span 2' : 'span 1' }}>
            <VideoPlayer 
              videoUrl={results.videoUrl} 
              timeline={timeline} 
              activeIncident={activeIncident}
            />
          </div>

          {/* Incident detail description box */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiActivity size={18} style={{ color: 'var(--accent-blue)' }} />
              <h3 style={{ fontSize: '0.95rem', color: '#FFF', fontFamily: 'var(--font-title)' }}>
                INCIDENT METADATA
              </h3>
            </div>

            {activeIncident ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                <img 
                  src={activeIncident.thumbnail} 
                  alt={activeIncident.type}
                  style={{ width: '100%', height: '180px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.05)' }}
                />
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>{activeIncident.type}</h4>
                    <span 
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        border: `1px solid ${getSeverityColor(activeIncident.severity)}`,
                        color: getSeverityColor(activeIncident.severity),
                        background: `${getSeverityColor(activeIncident.severity)}10`
                      }}
                    >
                      {activeIncident.severity}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#94A3B8', margin: '8px 0' }}>
                    <FiClock /> 
                    <span>Occurred at: <strong style={{ color: '#FFF' }}>{activeIncident.timeString}</strong> ({activeIncident.timestamp}s)</span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: '1.5', marginTop: '12px' }}>
                    {activeIncident.description}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#64748B' }}>
                Select an incident to view details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Horizontal scrolling timeline container */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Linear Detections Stream ({filteredTimeline.length})
          </h3>
        </div>

        {filteredTimeline.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748B' }}>
            No incident markers match the active filters.
          </div>
        ) : (
          <div 
            style={{ 
              display: 'flex', 
              gap: '16px', 
              overflowX: 'auto', 
              padding: '8px 4px 16px 4px', 
              scrollBehavior: 'smooth'
            }}
          >
            {filteredTimeline.map((item) => {
              const isActive = activeIncident?.id === item.id;
              const borderCol = getSeverityColor(item.severity);

              return (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  style={{
                    flexShrink: 0,
                    width: '200px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(109, 74, 255, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                    border: isActive ? `1.5px solid ${borderCol}` : '1.5px solid rgba(255, 255, 255, 0.03)',
                    padding: '12px',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? `0 0 15px ${borderCol}25` : 'none'
                  }}
                  className="interactive-item"
                >
                  <div style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', height: '100px', marginBottom: '8px' }}>
                    <img 
                      src={item.thumbnail} 
                      alt={item.type} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div 
                      style={{ 
                        position: 'absolute', 
                        bottom: '6px', 
                        left: '6px', 
                        background: 'rgba(0,0,0,0.7)', 
                        color: 'var(--accent-blue)', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-title)'
                      }}
                    >
                      {item.timeString}
                    </div>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.type}
                    </span>
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        fontSize: '0.6rem', 
                        fontWeight: 700, 
                        color: borderCol, 
                        textTransform: 'uppercase', 
                        marginTop: '4px' 
                      }}
                    >
                      {item.severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
