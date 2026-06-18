import React from 'react';
import { FiAlertOctagon, FiClock, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const IncidentList = ({ incidents = [], onSelectIncident }) => {
  const getSeverityStyle = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return {
          bg: 'rgba(255, 59, 107, 0.12)',
          border: '1px solid rgba(255, 59, 107, 0.25)',
          color: 'var(--color-danger)'
        };
      case 'medium':
        return {
          bg: 'rgba(255, 179, 0, 0.12)',
          border: '1px solid rgba(255, 179, 0, 0.25)',
          color: 'var(--color-warning)'
        };
      case 'low':
        default:
        return {
          bg: 'rgba(0, 229, 255, 0.12)',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          color: 'var(--accent-blue)'
        };
    }
  };

  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        minHeight: '280px'
      }}
    >
      <h3 style={{ fontSize: '0.95rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '20px', textTransform: 'uppercase' }}>
        Recent AI Incidents
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1 }}>
        {incidents.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748B' }}>No incidents logged today.</div>
        ) : (
          incidents.map((incident, idx) => {
            const sev = getSeverityStyle(incident.severity);
            return (
              <motion.div
                key={incident.id || idx}
                whileHover={{ x: 4 }}
                onClick={() => onSelectIncident && onSelectIncident(incident)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '8px',
                  cursor: onSelectIncident ? 'pointer' : 'default',
                  transition: 'background 0.2s ease'
                }}
                className="interactive-item"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div 
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '8px', 
                      background: sev.bg, 
                      border: sev.border,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: sev.color
                    }}
                  >
                    <FiAlertOctagon size={18} />
                  </div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#F1F5F9' }}>
                      {incident.type}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                      <FiClock size={12} />
                      {incident.timestamp}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span 
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      backgroundColor: sev.bg,
                      border: sev.border,
                      color: sev.color,
                      boxShadow: `inset 0 0 6px ${sev.color}15`
                    }}
                  >
                    {incident.severity}
                  </span>
                  {onSelectIncident && <FiChevronRight size={16} style={{ color: '#475569' }} />}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default IncidentList;
