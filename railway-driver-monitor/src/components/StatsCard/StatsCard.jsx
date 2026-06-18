import React from 'react';
import { motion } from 'framer-motion';

export const StatsCard = ({ title, count, icon: Icon, color, glowColor, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card"
      style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        minWidth: '220px',
        borderBottom: `3px solid ${color}`,
        boxShadow: `0 4px 24px -6px rgba(0,0,0,0.4)`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 32px 0 ${glowColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 24px -6px rgba(0,0,0,0.4)`;
      }}
    >
      <div>
        <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {title}
        </span>
        <h2 
          style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: '#FFFFFF', 
            margin: '8px 0 4px 0',
            fontFamily: 'var(--font-title)',
            textShadow: `0 0 10px ${color}40`
          }}
        >
          {count}
        </h2>
        {trend && (
          <span style={{ fontSize: '0.75rem', color: trend.startsWith('+') ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
            {trend} from yesterday
          </span>
        )}
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${color}20, ${color}05)`,
          border: `1px solid ${color}40`,
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 15px ${color}10`
        }}
      >
        <Icon size={28} style={{ color: color }} />
      </div>
    </motion.div>
  );
};

export default StatsCard;
