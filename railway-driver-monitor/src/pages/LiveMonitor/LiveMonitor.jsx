import React, { useState, useEffect } from 'react';
import { 
  FiTv, 
  FiAlertOctagon, 
  FiClock, 
  FiInfo, 
  FiPower,
  FiVolume2,
  FiRefreshCw
} from 'react-icons/fi';
import { Button } from '@mui/material';

export const LiveMonitor = () => {
  const [logs, setLogs] = useState([
    { id: 1, text: 'Live AI feed stream connected successfully.', type: 'info', time: '11:10:04' },
    { id: 2, text: 'Driver calibration grid verification complete.', type: 'success', time: '11:10:08' },
    { id: 3, text: 'Active tracking: EAR metric stabilized at 0.31.', type: 'info', time: '11:10:12' }
  ]);
  const [metrics, setMetrics] = useState({ ear: 0.31, gaze: 'Center', fps: 98.4, activeDetections: 0 });
  const [streamActive, setStreamActive] = useState(true);

  // Simulate real-time metrics updates
  useEffect(() => {
    if (!streamActive) return;
    const interval = setInterval(() => {
      const randomEar = (0.24 + Math.random() * 0.12).toFixed(2);
      const gazes = ['Center', 'Center', 'Left Signal', 'Right Console', 'Center'];
      const randomGaze = gazes[Math.floor(Math.random() * gazes.length)];
      const randomFps = (95 + Math.random() * 5).toFixed(1);

      setMetrics((prev) => ({
        ...prev,
        ear: randomEar,
        gaze: randomGaze,
        fps: randomFps
      }));

      // Randomly spawn mock incidents
      if (Math.random() > 0.85) {
        const incidentTypes = ['Attention Loss', 'Drowsiness Alert', 'Mobile Usage Detected'];
        const randomIncident = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
        const newLog = {
          id: Date.now(),
          text: `WARNING: ${randomIncident} triggered on primary feed.`,
          type: randomIncident.includes('Attention') ? 'warning' : 'danger',
          time: new Date().toTimeString().split(' ')[0]
        };

        setLogs((prev) => [newLog, ...prev.slice(0, 15)]);
        
        // Flash count
        setMetrics((prev) => ({ ...prev, activeDetections: prev.activeDetections + 1 }));
        setTimeout(() => {
          setMetrics((prev) => ({ ...prev, activeDetections: Math.max(0, prev.activeDetections - 1) }));
        }, 3000);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [streamActive]);

  const handleClearLogs = () => setLogs([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', color: '#FFF', fontSize: '1.4rem', letterSpacing: '1px' }}>
            LIVE SYSTEM TELEMETRY
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Primary Feed Terminal: Active Stream 01</span>
        </div>
        <Button
          variant="contained"
          onClick={() => setStreamActive(!streamActive)}
          color={streamActive ? 'error' : 'primary'}
          startIcon={<FiPower />}
          style={{
            background: streamActive ? 'var(--color-danger)' : 'var(--accent-violet)',
            fontFamily: 'var(--font-title)',
            fontSize: '0.75rem',
            boxShadow: streamActive ? 'var(--glow-danger)' : 'var(--glow-violet)'
          }}
        >
          {streamActive ? 'DISCONNECT FEED' : 'CONNECT FEED'}
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Left Column: Simulated Camera Feed Overlay */}
        <div style={{ gridColumn: window.innerWidth >= 1024 ? 'span 2' : 'span 1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div 
            className="glass-card" 
            style={{ 
              position: 'relative', 
              aspectRatio: '16/9', 
              background: '#040712', 
              borderRadius: '12px', 
              overflow: 'hidden',
              border: streamActive && metrics.activeDetections > 0 ? '2px solid var(--color-danger)' : '1px solid var(--border-glass)',
              boxShadow: streamActive && metrics.activeDetections > 0 ? 'var(--glow-danger)' : 'none'
            }}
          >
            {/* HUD Scanning Grid Lines */}
            {streamActive && (
              <>
                <div className="scanning-line" />
                
                {/* Visual Camera Overlay Bounding Crosshair */}
                <div style={{ position: 'absolute', top: '10%', left: '10%', width: '20px', height: '20px', borderTop: '2px solid rgba(0, 229, 255, 0.4)', borderLeft: '2px solid rgba(0, 229, 255, 0.4)' }} />
                <div style={{ position: 'absolute', top: '10%', right: '10%', width: '20px', height: '20px', borderTop: '2px solid rgba(0, 229, 255, 0.4)', borderRight: '2px solid rgba(0, 229, 255, 0.4)' }} />
                <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '20px', height: '20px', borderBottom: '2px solid rgba(0, 229, 255, 0.4)', borderLeft: '2px solid rgba(0, 229, 255, 0.4)' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '20px', height: '20px', borderBottom: '2px solid rgba(0, 229, 255, 0.4)', borderRight: '2px solid rgba(0, 229, 255, 0.4)' }} />
                
                {/* Face landmarks mockup representation (Vector map nodes overlay) */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '45%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '180px',
                    height: '180px',
                    border: '1.5px dashed rgba(0, 229, 255, 0.25)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Eye indicators dots */}
                  <div style={{ display: 'flex', gap: '30px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', boxShadow: 'var(--glow-blue)' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', boxShadow: 'var(--glow-blue)' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: '30px', width: '24px', height: '4px', background: 'var(--accent-blue)', borderRadius: '2px' }} />
                </div>
              </>
            )}

            {/* Displaying Live placeholder image when active, or static feed offline message */}
            {streamActive ? (
              <div 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundImage: 'radial-gradient(circle, rgba(13,20,38,0.2) 0%, rgba(2,4,10,0.9) 100%), url("https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.7
                }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyCenter: 'center', justifyContent: 'center', color: '#64748B', gap: '12px' }}>
                <FiTv size={48} />
                <span style={{ fontFamily: 'var(--font-title)', fontSize: '0.9rem', letterSpacing: '1px' }}>STREAM TERMINATED</span>
              </div>
            )}

            {/* Stream Telemetry Overlays */}
            {streamActive && (
              <div 
                style={{ 
                  position: 'absolute', 
                  bottom: '20px', 
                  left: '20px', 
                  background: 'rgba(0,0,0,0.75)', 
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  padding: '10px 16px', 
                  borderRadius: '6px',
                  display: 'flex',
                  gap: '20px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-title)',
                  color: '#FFF'
                }}
              >
                <div>EAR: <strong style={{ color: 'var(--accent-blue)' }}>{metrics.ear}</strong></div>
                <div>GAZE: <strong style={{ color: 'var(--accent-blue)' }}>{metrics.gaze}</strong></div>
                <div>SPEED: <strong style={{ color: 'var(--accent-blue)' }}>{metrics.fps} FPS</strong></div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Alert Logs Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active alerts widget */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--color-danger)' }}>
            <FiAlertOctagon size={28} style={{ color: 'var(--color-danger)' }} />
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Active Threats</span>
              <strong style={{ fontSize: '1.5rem', color: '#FFF' }}>
                {streamActive ? metrics.activeDetections : 0} Detections
              </strong>
            </div>
          </div>

          {/* Logs terminal output */}
          <div className="glass-card" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                System Event Stream
              </h3>
              <button 
                onClick={handleClearLogs}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-title)' }}
              >
                Clear
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', fontFamily: 'monospace', fontSize: '0.75rem' }}>
              {logs.length === 0 ? (
                <div style={{ color: '#475569', textAlign: 'center', padding: '40px 0' }}>Terminal logs cleared. Waiting for event streams...</div>
              ) : (
                logs.map((log) => (
                  <div 
                    key={log.id} 
                    style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      color: log.type === 'danger' ? 'var(--color-danger)' : (log.type === 'warning' ? 'var(--color-warning)' : '#E2E8F0'),
                      borderBottom: '1px solid rgba(255,255,255,0.01)',
                      paddingBottom: '6px'
                    }}
                  >
                    <span style={{ color: '#64748B' }}>[{log.time}]</span>
                    <span>{log.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitor;
