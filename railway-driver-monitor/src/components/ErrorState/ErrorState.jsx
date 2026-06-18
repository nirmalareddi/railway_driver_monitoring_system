import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export const ErrorState = ({ 
  message = 'An error occurred while communicating with the AI service.', 
  onRetry 
}) => {
  return (
    <div 
      className="glass-card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '36px 24px', 
        textAlign: 'center', 
        width: '100%', 
        minHeight: '220px',
        borderLeft: '4px solid var(--color-danger)'
      }}
    >
      <div 
        style={{ 
          background: 'rgba(255, 59, 107, 0.05)', 
          border: '1px solid rgba(255, 59, 107, 0.15)', 
          borderRadius: '50%', 
          padding: '12px', 
          marginBottom: '16px',
          boxShadow: '0 0 15px rgba(255, 59, 107, 0.05)'
        }}
      >
        <FiAlertTriangle size={32} style={{ color: 'var(--color-danger)', display: 'block' }} />
      </div>
      <p 
        style={{ 
          fontSize: '0.95rem', 
          color: '#E2E8F0', 
          fontWeight: 500,
          marginBottom: '20px', 
          maxWidth: '400px',
          lineHeight: '1.5' 
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry} 
          style={{ 
            background: 'var(--accent-violet)', 
            border: 'none', 
            borderRadius: '6px', 
            color: '#FFFFFF', 
            padding: '10px 20px', 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            fontFamily: 'var(--font-title)',
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer',
            boxShadow: 'var(--glow-violet)',
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(109, 74, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'var(--glow-violet)';
          }}
        >
          <FiRefreshCw size={14} className="retry-icon" />
          RETRY CONNECTION
        </button>
      )}
    </div>
  );
};

export default ErrorState;
