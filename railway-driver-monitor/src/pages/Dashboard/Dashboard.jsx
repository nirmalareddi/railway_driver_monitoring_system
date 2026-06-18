import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiFileText, 
  FiEyeOff, 
  FiZap, 
  FiCpu, 
  FiDisc, 
  FiAlertTriangle, 
  FiCheckCircle,
  FiPhone,
  FiUserMinus,
  FiActivity
} from 'react-icons/fi';
import { Grid, Button } from '@mui/material';
import { useDashboardStore } from '../../store/dashboardStore';
import StatsCard from '../../components/StatsCard/StatsCard';
import SafetyGauge from '../../components/SafetyGauge/SafetyGauge';
import IncidentList from '../../components/IncidentList/IncidentList';
import IncidentsChart from '../../components/Charts/IncidentsChart';
import SafetyTrendChart from '../../components/Charts/SafetyTrendChart';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';
import ErrorState from '../../components/ErrorState/ErrorState';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    dashboardData, 
    chartsData, 
    loading, 
    error, 
    fetchDashboardData, 
    fetchChartsData 
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
    fetchChartsData();
  }, [fetchDashboardData, fetchChartsData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#FFF' }}>DASHBOARD OVERVIEW</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <LoadingSkeleton type="card" count={5} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <LoadingSkeleton type="chart" count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => { fetchDashboardData(); fetchChartsData(); }} />;
  }

  if (!dashboardData) return null;

  const handleSelectIncident = (incident) => {
    // Navigate to Results page (we can simulate video ID)
    navigate(`/results?videoId=mock-vid-123&seek=${incident.id === 1 ? 12 : incident.id === 2 ? 32 : 58}`);
  };

  const statCardsData = [
    { title: 'Total Analyses', count: dashboardData.totalAnalyses, icon: FiDisc, color: 'var(--accent-blue)', glow: 'rgba(0, 229, 255, 0.15)', trend: '+12' },
    { title: 'Drowsiness Incidents', count: dashboardData.drowsinessCount, icon: FiZap, color: 'var(--color-danger)', glow: 'rgba(255, 59, 107, 0.15)', trend: '+2' },
    { title: 'Attention Loss', count: dashboardData.attentionLossCount, icon: FiEyeOff, color: 'var(--color-warning)', glow: 'rgba(255, 179, 0, 0.15)', trend: '+5' },
    { title: 'Mobile Usage', count: dashboardData.mobileUsageCount, icon: FiPhone, color: 'var(--accent-violet)', glow: 'rgba(109, 74, 255, 0.15)', trend: '+1' },
    { title: 'Face Not Visible', count: dashboardData.faceNotVisibleCount, icon: FiUserMinus, color: '#94A3B8', glow: 'rgba(148, 163, 184, 0.15)', trend: '-3' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#FFF', fontSize: '1.5rem', letterSpacing: '1px' }}>
          AI DRIVER MONITORING DASHBOARD
        </h2>
        <Button 
          variant="contained" 
          onClick={() => navigate('/upload')}
          style={{
            background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-blue))',
            fontFamily: 'var(--font-title)',
            fontSize: '0.8rem',
            padding: '8px 20px',
            boxShadow: 'var(--glow-violet)'
          }}
        >
          New Analysis
        </Button>
      </div>

      {/* Top statistics section */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px' 
        }}
      >
        {statCardsData.map((card, i) => (
          <StatsCard 
            key={i} 
            title={card.title} 
            count={card.count} 
            icon={card.icon} 
            color={card.color} 
            glowColor={card.glow} 
            trend={card.trend} 
          />
        ))}
      </div>

      {/* Middle dashboard widgets */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}
      >
        <SafetyGauge score={dashboardData.safetyScore} />
        <IncidentList incidents={dashboardData.recentIncidents} onSelectIncident={handleSelectIncident} />
        <IncidentsChart data={chartsData} />
      </div>

      {/* Bottom dashboard details */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
          gap: '20px' 
        }}
      >
        {/* Safety Trend Graph */}
        <SafetyTrendChart data={dashboardData.lastSevenDays} />

        {/* System Health Status */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '280px' 
          }}
        >
          <h3 style={{ fontSize: '0.95rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '20px', textTransform: 'uppercase' }}>
            System Integrity Log
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
            {/* GPU Temperature */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0', fontWeight: 500 }}>
                  <FiCpu style={{ color: 'var(--accent-blue)' }} /> GPU AI Processing Speed
                </span>
                <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>98.5 FPS</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', background: 'var(--accent-blue)', boxShadow: 'var(--glow-blue)' }} />
              </div>
            </div>

            {/* Inference Latency */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0', fontWeight: 500 }}>
                  <FiActivity style={{ color: 'var(--accent-violet)' }} /> AI Inference Latency
                </span>
                <span style={{ color: 'var(--accent-violet)', fontWeight: 600 }}>12.4 ms</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '95%', height: '100%', background: 'var(--accent-violet)', boxShadow: 'var(--glow-violet)' }} />
              </div>
            </div>

            {/* Camera Connectivity */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <FiCheckCircle style={{ color: 'var(--color-success)' }} />
                <span>Primary AI Camera Stream</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)', background: 'rgba(0, 230, 118, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>CONNECTED</span>
            </div>

            {/* API Endpoint status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <FiCheckCircle style={{ color: 'var(--color-success)' }} />
                <span>Edge Backend API Connection</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)', background: 'rgba(0, 230, 118, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>OPERATIONAL</span>
            </div>
          </div>
        </div>

        {/* Recent reports list table */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '24px', 
            gridColumn: '1 / -1',
            minHeight: '260px'
          }}
        >
          <h3 style={{ fontSize: '0.95rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '20px', textTransform: 'uppercase' }}>
            Recent Video Analyses
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(109, 74, 255, 0.15)', color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Report ID</th>
                  <th style={{ padding: '12px 16px' }}>Train ID</th>
                  <th style={{ padding: '12px 16px' }}>Driver</th>
                  <th style={{ padding: '12px 16px' }}>Trip Duration</th>
                  <th style={{ padding: '12px 16px' }}>Total Incidents</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentReports.map((report) => (
                  <tr 
                    key={report.id} 
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem', color: '#F1F5F9' }}
                    className="interactive-item"
                  >
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--accent-blue)' }}>{report.id}</td>
                    <td style={{ padding: '16px' }}>{report.trainId}</td>
                    <td style={{ padding: '16px' }}>{report.driver}</td>
                    <td style={{ padding: '16px' }}>{report.duration}</td>
                    <td style={{ padding: '16px' }}>
                      <span 
                        style={{ 
                          color: report.incidents > 3 ? 'var(--color-danger)' : 'var(--color-warning)', 
                          fontWeight: 700 
                        }}
                      >
                        {report.incidents}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#64748B' }}>{report.date}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <Button 
                        size="small"
                        onClick={() => navigate(`/results?videoId=${report.id}`)}
                        style={{
                          background: 'rgba(109, 74, 255, 0.1)',
                          border: '1px solid rgba(109, 74, 255, 0.2)',
                          color: 'var(--accent-blue)',
                          fontFamily: 'var(--font-title)',
                          fontSize: '0.7rem',
                          padding: '4px 12px'
                        }}
                      >
                        Open Analysis
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
