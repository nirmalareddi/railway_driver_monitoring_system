import React, { useRef, useState } from 'react';
import { FiUploadCloud, FiFile, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const UploadZone = ({ 
  file, 
  setFile, 
  progress, 
  uploading, 
  error, 
  onError 
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    // Check extension
    const allowedExtensions = /(\.mp4|\.avi|\.mov)$/i;
    if (!allowedExtensions.exec(selectedFile.name)) {
      if (onError) onError('Invalid file format. Please upload an MP4, AVI, or MOV video.');
      return;
    }

    // Check size limit (e.g. 500MB max for safety)
    const maxSize = 500 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      if (onError) onError('File is too large. Max allowed size is 500 MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Drag & Drop Input Form */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp4,.avi,.mov"
        onChange={handleFileInput}
        style={{ display: 'none' }}
        disabled={uploading}
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? onButtonClick : null}
        className="glass-card"
        style={{
          border: dragActive 
            ? '2px dashed var(--accent-blue)' 
            : '2px dashed var(--border-glass)',
          boxShadow: dragActive ? 'var(--glow-blue)' : 'none',
          padding: '48px 24px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          background: dragActive ? 'rgba(0, 229, 255, 0.04)' : 'var(--card-glass)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '320px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if (!uploading) {
            e.currentTarget.style.borderColor = 'var(--accent-violet)';
            e.currentTarget.style.boxShadow = 'var(--glow-violet)';
          }
        }}
        onMouseLeave={(e) => {
          if (!uploading) {
            e.currentTarget.style.borderColor = 'var(--border-glass)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        <FiUploadCloud 
          size={56} 
          style={{ 
            color: dragActive ? 'var(--accent-blue)' : 'var(--accent-violet)',
            marginBottom: '16px',
            filter: 'drop-shadow(0px 0px 8px rgba(109, 74, 255, 0.4))'
          }} 
        />

        {uploading ? (
          <div style={{ width: '100%', maxWidth: '300px' }}>
            <span style={{ display: 'block', fontSize: '1.05rem', fontWeight: 600, color: '#FFF', marginBottom: '8px' }}>
              Uploading Analysis Video...
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '6px' }}>
              <span>{progress}% Completed</span>
              <span>{file?.name}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${progress}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, var(--accent-violet), var(--accent-blue))',
                  boxShadow: 'var(--glow-blue)',
                  transition: 'width 0.1s ease'
                }} 
              />
            </div>
          </div>
        ) : file ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)' }}>
              <FiCheck size={20} />
              <span style={{ fontWeight: 600 }}>Video selected successfully</span>
            </div>
            <span style={{ fontSize: '0.9rem', color: '#E2E8F0', wordBreak: 'break-all' }}>{file.name}</span>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', marginTop: '8px', textDecoration: 'underline' }}>
              Click to replace file
            </span>
          </div>
        ) : (
          <div>
            <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 600, color: '#F1F5F9', marginBottom: '8px' }}>
              Drag & Drop Driver Video
            </span>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              or click here to search local directory
            </span>
            <div style={{ display: 'inline-flex', gap: '8px', fontSize: '0.7rem', color: '#94A3B8', padding: '6px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
              <span>MP4</span><span>•</span><span>AVI</span><span>•</span><span>MOV</span>
            </div>
          </div>
        )}
      </div>

      {/* Warning/Error Output */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: '12px', padding: '10px 16px', background: 'rgba(255, 59, 107, 0.05)', border: '1px solid rgba(255, 59, 107, 0.15)', borderRadius: '6px' }}>
          <FiAlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
