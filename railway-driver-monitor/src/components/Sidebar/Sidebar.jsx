import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, 
  FiUpload, 
  FiActivity, 
  FiFileText, 
  FiClock, 
  FiSettings, 
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { GiSubway } from 'react-icons/gi';

export const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: FiGrid },
    { name: 'Upload Video', path: '/upload', icon: FiUpload },
    { name: 'Live Monitoring', path: '/live', icon: FiActivity },
    { name: 'Reports', path: '/reports', icon: FiFileText },
    { name: 'History', path: '/history', icon: FiClock },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    // Perform simulated logout operations
    console.log('User logged out');
    alert('Simulating driver/operator logout. Redirecting to dashboard login mockup.');
  };

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
    background: 'rgba(6, 11, 25, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid var(--border-glass)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const itemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    margin: '4px 12px',
    borderRadius: '8px',
    color: isActive ? 'var(--accent-blue)' : '#94A3B8',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: isActive ? 600 : 500,
    background: isActive ? 'rgba(109, 74, 255, 0.12)' : 'transparent',
    border: isActive ? '1px solid rgba(0, 229, 255, 0.2)' : '1px solid transparent',
    boxShadow: isActive ? 'inset 0 0 10px rgba(109, 74, 255, 0.15)' : 'none',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textShadow: isActive ? '0 0 8px rgba(0, 229, 255, 0.25)' : 'none',
  });

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 4, 10, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 999
          }}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        style={{
          ...sidebarStyle,
          left: mobileOpen ? 0 : (window.innerWidth < 768 ? '-100%' : 0),
          width: window.innerWidth < 768 ? 'var(--sidebar-width)' : sidebarStyle.width,
        }}
        className="sidebar-container"
      >
        {/* Logo Section */}
        <div 
          style={{
            height: 'var(--topbar-height)',
            display: 'flex',
            alignItems: 'center',
            padding: collapsed ? '0 20px' : '0 24px',
            gap: '12px',
            borderBottom: '1px solid rgba(109, 74, 255, 0.1)',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-blue))',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--glow-violet)'
            }}
          >
            <GiSubway size={22} style={{ color: '#FFF' }} />
          </div>
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span 
                style={{ 
                  fontFamily: 'var(--font-title)', 
                  fontWeight: 700, 
                  fontSize: '0.95rem',
                  letterSpacing: '1px',
                  background: 'linear-gradient(90deg, #FFFFFF, var(--accent-blue))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                RAILWAY AI
              </span>
              <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.5px' }}>
                DRIVER MONITOR
              </span>
            </div>
          )}
        </div>

        {/* Menu Links */}
        <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
          {menuItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => itemStyle(isActive)}
              className="interactive-item"
              onMouseEnter={(e) => {
                if (!e.currentTarget.style.background.includes('rgba')) {
                  e.currentTarget.style.color = '#FFF';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.style.background.includes('rgba')) {
                  e.currentTarget.style.color = '#94A3B8';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <item.icon size={20} style={{ marginRight: collapsed ? 0 : '16px', minWidth: '20px' }} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions & Collapse Toggle */}
        <div style={{ padding: '12px 0', borderTop: '1px solid rgba(109, 74, 255, 0.1)' }}>
          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              ...itemStyle(false),
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              width: 'calc(100% - 24px)',
              display: 'flex',
              alignItems: 'center',
            }}
            className="interactive-item"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-danger)';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <FiLogOut size={20} style={{ marginRight: collapsed ? 0 : '16px', minWidth: '20px' }} />
            {!collapsed && <span>Logout</span>}
          </button>

          {/* Desktop Toggle Button */}
          {window.innerWidth >= 768 && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(13, 20, 38, 0.6)',
                border: '1px solid rgba(109, 74, 255, 0.2)',
                color: 'var(--accent-blue)',
                cursor: 'pointer',
                margin: '16px auto 0 auto',
                boxShadow: 'var(--glow-blue)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
