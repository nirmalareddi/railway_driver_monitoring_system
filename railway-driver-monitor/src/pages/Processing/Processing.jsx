import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLoader, FiCheckCircle, FiClock, FiCpu } from 'react-icons/fi';
import { useAnalysisStore } from '../../store/analysisStore';

export const Processing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoId = searchParams.get('videoId');

if (!videoId) {
  return (
    <ErrorState
      message="No Job ID found."
      onRetry={() => navigate('/')}
    />
  );
}

  const { 
    processingStatus, 
    processingPercent, 
    error,
    startPollingProcessing,
    stopPollingProcessing 
  } = useAnalysisStore();

  useEffect(() => {
    startPollingProcessing(videoId, () => {
      // Navigate to results page after short completed delay
      setTimeout(() => {
        navigate(`/results?videoId=${videoId}`);
      }, 1200);
    });

    return () => stopPollingProcessing();
  }, [videoId, startPollingProcessing, stopPollingProcessing, navigate]);

  if (error) {
    return (
      <div className="glass-card" style={{ padding: '36px', textAlign: 'center', borderLeft: '4px solid var(--color-danger)' }}>
        <p style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{error}</p>
        <button 
          onClick={() => startPollingProcessing(videoId)}
          style={{ background: 'var(--accent-violet)', color: '#FFF', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '16px' }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Fallback defaults if status hasn't loaded yet
  const steps = processingStatus?.allSteps || [
    'Reading Video',
    'Extracting Frames',
    'Detecting Drowsiness',
    'Detecting Attention Loss',
    'Detecting Mobile Usage',
    'Detecting Face Visibility',
    'Generating Report'
  ];

  const currentStepIndex = processingStatus?.stepIndex ?? 0;
  const estimatedTime = processingStatus?.estimatedTimeRemaining || '--';
  const currentStep = processingStatus?.currentStep || 'Initializing...';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '750px', margin: '40px auto' }}>
      {/* Processing HUD Header */}
      <div className="glass-card" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px', position: 'relative' }}>
        <div className="scanning-line" />
        
        {/* Animated Radar Spinner */}
        <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
          <div 
            style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '50%', 
              border: '2px solid rgba(0, 229, 255, 0.1)', 
              borderTopColor: 'var(--accent-blue)', 
              animation: 'spin 1.5s linear infinite',
              boxShadow: 'var(--glow-blue)'
            }} 
          />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--accent-blue)' 
            }}
          >
            <FiCpu size={32} style={{ animation: 'pulse 1s infinite alternate' }} />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-title)', color: '#FFF', fontSize: '1.25rem', letterSpacing: '1px' }}>
            AI PIPELINE RUNNING
          </h2>
          <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-blue)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {currentStep}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', fontSize: '0.75rem', color: '#94A3B8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiClock /> Time Remaining: <strong style={{ color: '#FFF' }}>{estimatedTime}</strong>
            </span>
            <span>•</span>
            <span>Video ID: <strong style={{ color: '#FFF' }}>{videoId}</strong></span>
          </div>
        </div>

        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFF', fontFamily: 'var(--font-title)', textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>
          {processingPercent}%
        </div>
      </div>

      {/* Global Progress Line Bar */}
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', width: '100%' }}>
        <div 
          style={{ 
            width: `${processingPercent}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, var(--accent-violet), var(--accent-blue))',
            boxShadow: 'var(--glow-blue)',
            transition: 'width 0.5s ease-in-out'
          }} 
        />
      </div>

      {/* Checklist list card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '20px', textTransform: 'uppercase' }}>
          Pipeline Milestones
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex || processingPercent === 100;
            const isActive = idx === currentStepIndex && processingPercent < 100;
            const isPending = idx > currentStepIndex && processingPercent < 100;

            return (
              <div 
                key={step} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: isActive ? 'rgba(109, 74, 255, 0.05)' : 'rgba(255,255,255,0.01)',
                  border: isActive ? '1px solid rgba(109,74,255,0.2)' : '1px solid rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  opacity: isPending ? 0.4 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                <span 
                  style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: isActive || isCompleted ? 600 : 400,
                    color: isCompleted ? 'var(--color-success)' : (isActive ? 'var(--accent-blue)' : '#94A3B8')
                  }}
                >
                  {step}
                </span>

                <div>
                  {isCompleted ? (
                    <FiCheckCircle size={18} style={{ color: 'var(--color-success)', filter: 'drop-shadow(0px 0px 4px rgba(0, 230, 118, 0.3))' }} />
                  ) : isActive ? (
                    <FiLoader size={18} style={{ color: 'var(--accent-blue)', animation: 'spin 1.5s linear infinite' }} />
                  ) : (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#334155' }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Processing;
