import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Auto-collapse sidebar on smaller tablet screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar Navigation */}
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />

      {/* Main Content Area */}
      <div 
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          marginLeft: window.innerWidth < 768 ? 0 : (collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'),
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Topbar HUD */}
        <Topbar 
          collapsed={collapsed} 
          setMobileOpen={setMobileOpen} 
        />

        {/* Content outlet wrapper */}
        <main 
          style={{
            flex: 1,
            padding: '24px',
            marginTop: 'var(--topbar-height)',
            width: '100%',
            maxWidth: '1600px',
            marginRight: 'auto',
            marginLeft: 'auto'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              style={{ width: '100%', height: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
