import React, { useEffect, useState } from 'react';

export const SafetyGauge = ({ score = 92 }) => {
  const [offset, setOffset] = useState(314.16);
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // 314.16

  useEffect(() => {
    // Animate the progress circular line
    const progressOffset = circumference - (score / 100) * circumference;
    const timer = setTimeout(() => setOffset(progressOffset), 300);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  // Determine status configurations based on the safety score
  const getStatusConfig = (val) => {
    if (val >= 90) return { label: 'Excellent', color: 'var(--color-success)', shadow: 'var(--glow-success)' };
    if (val >= 75) return { label: 'Attention Required', color: 'var(--color-warning)', shadow: 'var(--glow-warning)' };
    return { label: 'Critical Risk', color: 'var(--color-danger)', shadow: 'var(--glow-danger)' };
  };

  const status = getStatusConfig(score);

  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        minHeight: '280px'
      }}
    >
      <h3 style={{ fontSize: '0.95rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '20px', textTransform: 'uppercase' }}>
        Safety Score Gauge
      </h3>

      <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
        {/* SVG Circular Ring */}
        <svg width="150" height="150" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-blue)" />
              <stop offset="100%" stopColor={status.color} />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Background Track */}
          <circle 
            cx="60" 
            cy="60" 
            r={radius} 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="8" 
            fill="transparent" 
          />
          
          {/* Active Scoring Ring */}
          <circle 
            cx="60" 
            cy="60" 
            r={radius} 
            stroke="url(#gaugeGradient)" 
            strokeWidth="8" 
            fill="transparent" 
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter="url(#glowFilter)"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </svg>

        {/* Center Percentage Display */}
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <span 
            style={{ 
              fontSize: '2.25rem', 
              fontWeight: 800, 
              color: '#FFFFFF',
              fontFamily: 'var(--font-title)',
              textShadow: `0 0 12px ${status.color}50`
            }}
          >
            {score}%
          </span>
          <span 
            style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: status.color, 
              letterSpacing: '1px', 
              textTransform: 'uppercase',
              marginTop: '4px',
              textAlign: 'center',
              maxWidth: '100px'
            }}
          >
            {status.label}
          </span>
        </div>
      </div>
      
      {/* Bottom Indicator Bar */}
      <div style={{ marginTop: '20px', width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: `linear-gradient(90deg, var(--accent-blue), ${status.color})`, boxShadow: status.shadow, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
};

export default SafetyGauge;
