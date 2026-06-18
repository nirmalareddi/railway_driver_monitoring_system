import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiZap, 
  FiEyeOff, 
  FiPhone, 
  FiUserMinus, 
  FiPlayCircle, 
  FiCpu 
} from 'react-icons/fi';
import { Button } from '@mui/material';
import { useUploadStore } from '../../store/uploadStore';
import UploadZone from '../../components/UploadZone/UploadZone';

export const UploadVideo = () => {
  const navigate = useNavigate();
  const { 
    file, 
    setFile, 
    progress, 
    uploading, 
    error, 
    setFile: resetFileState,
    uploadVideoFile 
  } = useUploadStore();

  const handleUploadClick = () => {
    // Initiate upload and let store navigate to /processing on success
    uploadVideoFile(navigate);
  };

  const handleSetError = (msg) => {
    useUploadStore.setState({ error: msg });
  };

  const detectionFeatures = [
    { title: 'Drowsiness Detection', desc: 'Monitors blink rate, eye-closure durations, and yawning gestures using facial landmark metrics.', icon: FiZap, color: 'var(--color-danger)' },
    { title: 'Attention Loss Tracking', desc: 'Analyzes head-pose rotation and coordinates gaze vectors to identify when attention is diverted.', icon: FiEyeOff, color: 'var(--color-warning)' },
    { title: 'Mobile Device Usage', desc: 'Detects mobile phones, tablets, or other handheld devices in the camera frame using object detection.', icon: FiPhone, color: 'var(--accent-violet)' },
    { title: 'Face Visibility Check', desc: 'Flags sensor occlusion, camera obstruction, or driver displacement outside the active safety grid.', icon: FiUserMinus, color: 'var(--accent-blue)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#FFF', fontSize: '1.5rem', letterSpacing: '1px' }}>
          INGEST CABIN VIDEO FEED
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>
          Upload high-resolution cabin footage to run AI analytical models on driver activity.
        </p>
      </div>

      {/* Main Upload Zone card */}
      <UploadZone 
        file={file}
        setFile={setFile}
        progress={progress}
        uploading={uploading}
        error={error}
        onError={handleSetError}
      />

      {/* Action Button */}
      {file && !uploading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ alignSelf: 'center' }}
        >
          <Button
            variant="contained"
            onClick={handleUploadClick}
            startIcon={<FiPlayCircle />}
            style={{
              background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-blue))',
              fontFamily: 'var(--font-title)',
              fontSize: '0.9rem',
              padding: '12px 32px',
              borderRadius: '8px',
              boxShadow: 'var(--glow-violet)',
              fontWeight: 600
            }}
          >
            START AI ANALYSIS
          </Button>
        </motion.div>
      )}

      {/* Information Cards (AI will analyze...) */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <FiCpu size={18} style={{ color: 'var(--accent-blue)' }} />
          <h3 style={{ fontSize: '1rem', color: '#FFF', fontWeight: 600, letterSpacing: '0.5px' }}>
            INTEGRATED AI DETECTOR GRID
          </h3>
        </div>

        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '16px' 
          }}
        >
          {detectionFeatures.map((feat, i) => (
            <div 
              key={i} 
              className="glass-card" 
              style={{ 
                padding: '20px', 
                borderLeft: `3px solid ${feat.color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '6px', 
                  background: `${feat.color}15`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: feat.color
                }}
              >
                <feat.icon size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFF', marginBottom: '4px' }}>
                  {feat.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;
