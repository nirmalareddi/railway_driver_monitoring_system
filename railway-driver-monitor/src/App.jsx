import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import UploadVideo from './pages/UploadVideo/UploadVideo';
import Processing from './pages/Processing/Processing';
import Results from './pages/Results/Results';
import Timeline from './pages/Timeline/Timeline';
import Reports from './pages/Reports/Reports';
import LiveMonitor from './pages/LiveMonitor/LiveMonitor';
import History from './pages/History/History';
import Settings from './pages/Settings/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/results" element={<Results />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/live" element={<LiveMonitor />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
