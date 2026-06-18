import React, { useState, useEffect } from 'react';
import { FiMenu, FiBell, FiUser, FiInfo } from 'react-icons/fi';
import { Badge, Menu, MenuItem, IconButton, Tooltip } from '@mui/material';

export const Topbar = ({ collapsed, setMobileOpen }) => {
  const [time, setTime] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const notifications = [
    { id: 1, text: 'Alert: Drowsiness detected on Train T-802', time: '10 mins ago', read: false },
    { id: 2, text: 'System Update: AI Models loaded successfully', time: '1 hour ago', read: true },
    { id: 3, text: 'Report Generated: Attention Loss Report for T-104', time: '2 hours ago', read: true },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: window.innerWidth < 768 ? 0 : (collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'),
        height: 'var(--topbar-height)',
        background: 'rgba(6, 11, 25, 0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 998,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Mobile Toggle & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#F8FAFC',
            cursor: 'pointer',
            display: window.innerWidth < 768 ? 'block' : 'none'
          }}
        >
          <FiMenu size={22} />
        </button>

        {/* System Online Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="pulse-dot" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34D399', letterSpacing: '0.5px' }}>
            SYSTEM ONLINE
          </span>
        </div>
      </div>

      {/* Clock, Notifications, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Real-time Clock */}
        <div 
          style={{ 
            fontFamily: 'var(--font-title)', 
            fontSize: '0.85rem', 
            color: 'var(--accent-blue)',
            background: 'rgba(0, 229, 255, 0.05)',
            border: '1px solid rgba(0, 229, 255, 0.1)',
            padding: '6px 12px',
            borderRadius: '6px',
            letterSpacing: '1px'
          }}
          className="topbar-clock"
        >
          {time.toLocaleTimeString()}
        </div>

        {/* Notification Bell */}
        <div>
          <IconButton 
            onClick={handleOpenMenu}
            style={{ color: '#F1F5F9' }}
          >
            <Badge 
              badgeContent={notifications.filter(n => !n.read).length} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  background: 'var(--color-danger)',
                  boxShadow: 'var(--glow-danger)',
                  fontFamily: 'var(--font-title)'
                }
              }}
            >
              <FiBell size={20} />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            disableScrollLock
            sx={{
              '& .MuiPaper-root': {
                background: 'rgba(13, 20, 38, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-glass)',
                color: '#FFF',
                marginTop: '12px',
                width: '320px',
                borderRadius: '8px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
              }
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(109, 74, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiInfo style={{ color: 'var(--accent-blue)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem', fontFamily: 'var(--font-title)' }}>System Notifications</span>
            </div>
            {notifications.map((notif) => (
              <MenuItem 
                key={notif.id} 
                onClick={handleCloseMenu}
                sx={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px',
                  whiteSpace: 'normal',
                  background: notif.read ? 'transparent' : 'rgba(109, 74, 255, 0.05)',
                  '&:hover': {
                    background: 'rgba(109, 74, 255, 0.1)'
                  }
                }}
              >
                <div style={{ fontSize: '0.85rem', color: '#E2E8F0', fontWeight: notif.read ? 400 : 600 }}>
                  {notif.text}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  {notif.time}
                </div>
              </MenuItem>
            ))}
          </Menu>
        </div>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flexDirection: 'column', alignItems: 'flex-end', display: window.innerWidth < 600 ? 'none' : 'flex' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFF' }}>Operator Unit Alpha</span>
            <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>AI Chief Supervisor</span>
          </div>
          <Tooltip title="Operator Profile">
            <IconButton
              style={{
                background: 'rgba(109, 74, 255, 0.1)',
                border: '1px solid rgba(109, 74, 255, 0.2)',
                color: 'var(--accent-blue)',
                padding: '10px'
              }}
            >
              <FiUser size={18} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
