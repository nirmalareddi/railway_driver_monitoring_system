import React, { useState } from 'react';
import { 
  FiSettings, 
  FiUser, 
  FiBell, 
  FiSliders, 
  FiCheck,
  FiLink
} from 'react-icons/fi';
import { Button, Switch } from '@mui/material';

export const Settings = () => {
  const [profile, setProfile] = useState({
    name: 'Operator Unit Alpha',
    email: 'supervisor.alpha@railway.ai',
    role: 'AI Chief Supervisor'
  });

  const [thresholds, setThresholds] = useState({
    drowsinessSensitivity: 80,
    attentionLossSeconds: 4,
    mobileDetections: true,
    audioAlerts: true
  });

  const [apiUrl, setApiUrl] = useState(
    localStorage.getItem('api_override_url') || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  );
  
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    // Save locally
    localStorage.setItem('api_override_url', apiUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '850px', margin: '0 auto' }}>
      {/* Page Header */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#FFF', fontSize: '1.4rem', letterSpacing: '1px' }}>
          SYSTEM PREFERENCES & SETUP
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>
          Adjust driver detection thresholds, configure AI server endpoints, and modify operator profile settings.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Profile Section */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FiUser size={18} style={{ color: 'var(--accent-blue)' }} />
            <h3 style={{ fontSize: '0.95rem', color: '#FFF', fontFamily: 'var(--font-title)' }}>OPERATOR PROFILE</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '6px' }}>Operator Username</label>
              <input 
                type="text" 
                value={profile.name} 
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  color: '#FFF',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '6px' }}>Notification Email</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  color: '#FFF',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* AI Thresholds Section */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FiSliders size={18} style={{ color: 'var(--accent-blue)' }} />
            <h3 style={{ fontSize: '0.95rem', color: '#FFF', fontFamily: 'var(--font-title)' }}>DETECTION THRESHOLDS</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Drowsiness Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ color: '#E2E8F0' }}>Drowsiness Sensitivity (EAR Percentile)</span>
                <strong style={{ color: 'var(--accent-blue)' }}>{thresholds.drowsinessSensitivity}%</strong>
              </div>
              <input 
                type="range" 
                min="50" 
                max="95" 
                value={thresholds.drowsinessSensitivity}
                onChange={(e) => setThresholds({ ...thresholds, drowsinessSensitivity: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
              />
            </div>

            {/* Attention Loss seconds input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ color: '#E2E8F0' }}>Attention Loss Event Duration Threshold</span>
                <strong style={{ color: 'var(--accent-blue)' }}>{thresholds.attentionLossSeconds} seconds</strong>
              </div>
              <input 
                type="range" 
                min="2" 
                max="10" 
                value={thresholds.attentionLossSeconds}
                onChange={(e) => setThresholds({ ...thresholds, attentionLossSeconds: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
              />
            </div>

            {/* Feature Toggles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#E2E8F0', fontWeight: 500 }}>Mobile Object Inference</span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B' }}>Analyze frames for handheld phones/tablets.</span>
              </div>
              <Switch 
                checked={thresholds.mobileDetections} 
                onChange={(e) => setThresholds({ ...thresholds, mobileDetections: e.target.checked })} 
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent-blue)' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'var(--accent-blue)' }
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#E2E8F0', fontWeight: 500 }}>Live Audio Alarms</span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B' }}>Play alarms in the web client if critical risks trigger.</span>
              </div>
              <Switch 
                checked={thresholds.audioAlerts} 
                onChange={(e) => setThresholds({ ...thresholds, audioAlerts: e.target.checked })} 
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent-blue)' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'var(--accent-blue)' }
                }}
              />
            </div>
          </div>
        </div>

        {/* API Endpoint Section */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FiLink size={18} style={{ color: 'var(--accent-blue)' }} />
            <h3 style={{ fontSize: '0.95rem', color: '#FFF', fontFamily: 'var(--font-title)' }}>API EDGE ENDPOINT</h3>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginBottom: '6px' }}>AI Server Base URL</label>
            <input 
              type="text" 
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                color: '#FFF',
                fontFamily: 'monospace',
                outline: 'none'
              }}
            />
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748B', marginTop: '6px' }}>
              Vite dev configuration is mapping from VITE_API_BASE_URL. Overwriting here updates the active client base URL in localStorage.
            </span>
          </div>
        </div>

        {/* Save Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', alignSelf: 'flex-end', marginTop: '8px' }}>
          {savedSuccess && (
            <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiCheck /> Preferences saved successfully.
            </span>
          )}
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            style={{
              background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-blue))',
              fontFamily: 'var(--font-title)',
              fontSize: '0.8rem',
              padding: '10px 24px',
              boxShadow: 'var(--glow-violet)'
            }}
          >
            SAVE PREFERENCES
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
