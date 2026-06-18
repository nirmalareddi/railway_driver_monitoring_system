import React from 'react';

export const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = (key) => {
    switch (type) {
      case 'card':
        return (
          <div key={key} className="glass-card p-6 h-32 flex flex-col justify-between shimmer" style={{ minWidth: '150px' }}>
            <div className="h-4 bg-slate-700/50 rounded" style={{ width: '40%' }}></div>
            <div className="h-8 bg-slate-700/50 rounded" style={{ width: '60%' }}></div>
          </div>
        );
      case 'table':
        return (
          <div key={key} className="flex gap-4 p-4 border-b border-slate-800/80 shimmer" style={{ alignItems: 'center' }}>
            <div className="h-4 bg-slate-700/50 rounded flex-1"></div>
            <div className="h-4 bg-slate-700/50 rounded" style={{ width: '100px' }}></div>
            <div className="h-4 bg-slate-700/50 rounded" style={{ width: '80px' }}></div>
            <div className="h-4 bg-slate-700/50 rounded" style={{ width: '60px' }}></div>
          </div>
        );
      case 'chart':
        return (
          <div key={key} className="glass-card p-6 h-72 flex items-end justify-between gap-4 shimmer" style={{ width: '100%' }}>
            <div className="bg-slate-700/40 rounded" style={{ height: '30%', width: '12%' }}></div>
            <div className="bg-slate-700/40 rounded" style={{ height: '55%', width: '12%' }}></div>
            <div className="bg-slate-700/40 rounded" style={{ height: '80%', width: '12%' }}></div>
            <div className="bg-slate-700/40 rounded" style={{ height: '45%', width: '12%' }}></div>
            <div className="bg-slate-700/40 rounded" style={{ height: '70%', width: '12%' }}></div>
            <div className="bg-slate-700/40 rounded" style={{ height: '90%', width: '12%' }}></div>
            <div className="bg-slate-700/40 rounded" style={{ height: '35%', width: '12%' }}></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'contents' }}>
      {Array.from({ length: count }).map((_, idx) => renderSkeleton(idx))}
    </div>
  );
};

export default LoadingSkeleton;
