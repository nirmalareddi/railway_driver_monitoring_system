import React, { useRef, useState, useEffect } from 'react';
import { 
  FiPlay, 
  FiPause, 
  FiMaximize, 
  FiVolume2, 
  FiVolumeX, 
  FiSkipForward,
  FiActivity
} from 'react-icons/fi';

export const VideoPlayer = ({ videoUrl, timeline = [], activeIncident, onTimeUpdate }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);

  // Sync seek command if an active incident is clicked in parent
  useEffect(() => {
    if (activeIncident && videoRef.current) {
      videoRef.current.currentTime = activeIncident.timestamp;
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [activeIncident]);

  useEffect(() => {
    // Check if current playback time is near any incident to overlay notification boxes
    const currentSecond = Math.floor(currentTime);
    const activeEvt = timeline.find(
      (evt) => currentSecond >= evt.timestamp && currentSecond < evt.timestamp + 4
    );
    setActiveAlert(activeEvt || null);
  }, [currentTime, timeline]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);
    if (onTimeUpdate) onTimeUpdate(current);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleProgressClick = (e) => {
    if (!videoRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="glass-card" 
      style={{ 
        position: 'relative', 
        width: '100%', 
        overflow: 'hidden', 
        background: '#000', 
        borderRadius: '12px',
        border: '1px solid rgba(109, 74, 255, 0.25)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.6)'
      }}
    >
      {/* Target Bounding Box / Detection Face Grid HUD (Simulated Overlay) */}
      {activeAlert && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '30%', 
            left: activeAlert.type === 'Drowsiness' ? '35%' : '45%', 
            width: '150px', 
            height: '150px', 
            border: '2px solid var(--color-danger)', 
            boxShadow: 'var(--glow-danger)',
            borderRadius: '8px', 
            pointerEvents: 'none', 
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '8px',
            animation: 'pulse 0.5s infinite alternate'
          }}
        >
          <span style={{ fontSize: '0.6rem', color: 'var(--color-danger)', fontWeight: 800, textTransform: 'uppercase', background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: '2px', alignSelf: 'flex-start' }}>
            SCAN MATCH
          </span>
          <span style={{ fontSize: '0.6rem', color: 'var(--color-danger)', fontWeight: 800, textTransform: 'uppercase', background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: '2px', alignSelf: 'flex-end' }}>
            {activeAlert.type}
          </span>
        </div>
      )}

      {/* Floating Detection Banner Overlay */}
      {activeAlert && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '20px', 
            background: 'rgba(255, 59, 107, 0.9)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 59, 107, 0.3)',
            boxShadow: 'var(--glow-danger)',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-title)',
            letterSpacing: '1px',
            animation: 'pulse 1s infinite alternate'
          }}
        >
          <FiActivity size={16} />
          <span>{activeAlert.type.toUpperCase()} DETECTED</span>
        </div>
      )}

      <div style={{ color: "white" }}>
  
</div>

<video
  ref={videoRef}
  src="http://localhost:8000/video"
  controls
  preload="metadata"
  onClick={togglePlay}
  onTimeUpdate={handleTimeUpdate}
  onLoadedMetadata={handleLoadedMetadata}
  onError={(e) => {
  console.error("Video playback error");
}}
  style={{
    width: '100%',
    display: 'block',
    maxHeight: '500px',
    objectFit: 'contain'
  }}
/>

      {/* CUSTOM PLAYER HUD CONTROLS */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(2, 4, 10, 0.95) 0%, rgba(2, 4, 10, 0.4) 80%, transparent 100%)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 10
        }}
      >
        {/* Scrubber Timeline Bar and Markers */}
        <div style={{ position: 'relative', padding: '4px 0', cursor: 'pointer' }}>
          {/* Timeline markers */}
          {timeline.map((item) => {
            const markerPos = duration ? (item.timestamp / duration) * 100 : 0;
            return (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) {
                    videoRef.current.currentTime = item.timestamp;
                  }
                }}
                style={{
                  position: 'absolute',
                  left: `${markerPos}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: item.color || 'var(--color-danger)',
                  border: '1.5px solid #FFFFFF',
                  boxShadow: `0 0 10px ${item.color || 'var(--color-danger)'}`,
                  zIndex: 5,
                  cursor: 'pointer'
                }}
                title={`${item.type} at ${item.timeString}`}
              />
            );
          })}

          {/* Progress Slider Track */}
          <div 
            ref={progressRef}
            onClick={handleProgressClick}
            style={{
              height: '4px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '2px',
              position: 'relative'
            }}
          >
            <div 
              style={{
                height: '100%',
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                background: 'var(--accent-blue)',
                boxShadow: 'var(--glow-blue)',
                borderRadius: '2px'
              }}
            />
          </div>
        </div>

        {/* Action Controls list */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Play/Pause */}
            <button 
              onClick={togglePlay}
              style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}
            </button>

            {/* Time display */}
            <span style={{ fontSize: '0.8rem', color: '#E2E8F0', fontFamily: 'var(--font-title)' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Volume Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={toggleMute}
                style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{
                  width: '60px',
                  accentColor: 'var(--accent-blue)',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Fullscreen */}
            <button 
              onClick={toggleFullscreen}
              style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <FiMaximize size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
