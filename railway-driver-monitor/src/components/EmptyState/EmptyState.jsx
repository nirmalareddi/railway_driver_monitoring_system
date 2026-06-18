import React from 'react';
import { FiInbox } from 'react-icons/fi';

export const EmptyState = ({ 
  title = 'No Data Available', 
  description = 'Try adjusting your filters or verify the parameters.', 
  icon: Icon = FiInbox 
}) => {
  return (
    <div 
      className="glass-card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '48px 24px', 
        textAlign: 'center', 
        width: '100%', 
        minHeight: '280px' 
      }}
    >
      <div 
        style={{ 
          background: 'rgba(0, 229, 255, 0.05)', 
          border: '1px solid rgba(0, 229, 255, 0.15)', 
          borderRadius: '50%', 
          padding: '16px', 
          marginBottom: '20px',
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.05)'
        }}
      >
        <Icon size={40} style={{ color: 'var(--accent-blue)', display: 'block' }} />
      </div>
      <h3 
        style={{ 
          fontSize: '1.2rem', 
          fontWeight: 600, 
          color: '#F8FAFC', 
          marginBottom: '8px',
          fontFamily: 'var(--font-title)'
        }}
      >
        {title}
      </h3>
      <p 
        style={{ 
          fontSize: '0.9rem', 
          color: '#94A3B8', 
          maxWidth: '380px', 
          lineHeight: '1.5' 
        }}
      >
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
