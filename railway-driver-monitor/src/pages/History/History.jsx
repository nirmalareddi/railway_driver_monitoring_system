import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiClock, 
  FiEye, 
  FiDownload, 
  FiTrash2, 
  FiSearch,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { Button, IconButton, Tooltip } from '@mui/material';
import { useReportStore } from '../../store/reportStore';
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton';
import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';

export const History = () => {
  const navigate = useNavigate();
  const { reports, loading, error, fetchReports, downloadReport, deleteReport } = useReportStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', color: '#FFF' }}>ANALYSIS HISTORY LOGS</h2>
        <LoadingSkeleton type="table" count={5} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchReports} />;
  }

  // Search filter
  const filteredReports = reports.filter((rep) => {
    return (
      rep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.trainId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDownload = (videoId) => {
    downloadReport(videoId, 'pdf');
  };

  const handleDelete = (reportId) => {
    if (confirm(`Are you sure you want to permanently delete Analysis report ${reportId}?`)) {
      deleteReport(reportId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', color: '#FFF', fontSize: '1.4rem', letterSpacing: '1px' }}>
            HISTORICAL ANALYSES LOGS
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>
            Browse and manage all previous driver safety runs completed by the AI Edge service.
          </p>
        </div>

        {/* Search Input bar */}
        <div style={{ position: 'relative', width: '280px' }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            type="text"
            placeholder="Search by ID, driver, train..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '6px',
              padding: '8px 12px 8px 36px',
              fontSize: '0.8rem',
              color: '#FFF',
              fontFamily: 'var(--font-content)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Main Table view */}
      {filteredReports.length === 0 ? (
        <EmptyState title="No historical analyses found" description="No runs match your search query, or no videos have been uploaded yet." />
      ) : (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(109, 74, 255, 0.15)', color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Report ID</th>
                  <th style={{ padding: '12px 16px' }}>Train ID</th>
                  <th style={{ padding: '12px 16px' }}>Driver</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px' }}>Duration</th>
                  <th style={{ padding: '12px 16px' }}>Incidents</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.map((report) => (
                  <tr 
                    key={report.id} 
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem', color: '#F1F5F9' }}
                    className="interactive-item"
                  >
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--accent-blue)' }}>{report.id}</td>
                    <td style={{ padding: '16px' }}>{report.trainId}</td>
                    <td style={{ padding: '16px' }}>{report.driver}</td>
                    <td style={{ padding: '16px', color: '#64748B' }}>{report.date}</td>
                    <td style={{ padding: '16px' }}>{report.duration}</td>
                    <td style={{ padding: '16px' }}>
                      <span 
                        style={{ 
                          color: report.incidents > 3 ? 'var(--color-danger)' : (report.incidents > 0 ? 'var(--color-warning)' : 'var(--color-success)'), 
                          fontWeight: 700 
                        }}
                      >
                        {report.incidents}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)', background: 'rgba(0, 230, 118, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                        {report.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <Tooltip title="View results">
                          <IconButton 
                            size="small"
                            onClick={() => navigate(`/results?videoId=${report.id}`)}
                            style={{ color: 'var(--accent-blue)', background: 'rgba(0, 229, 255, 0.05)' }}
                          >
                            <FiEye size={15} />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Download PDF report">
                          <IconButton 
                            size="small"
                            onClick={() => handleDownload(report.id)}
                            style={{ color: 'var(--accent-violet)', background: 'rgba(109, 74, 255, 0.05)' }}
                          >
                            <FiDownload size={15} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete record">
                          <IconButton 
                            size="small"
                            onClick={() => handleDelete(report.id)}
                            style={{ color: 'var(--color-danger)', background: 'rgba(255, 59, 107, 0.05)' }}
                          >
                            <FiTrash2 size={15} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls bar */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Showing page {currentPage} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <IconButton 
                  size="small" 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  style={{ color: currentPage === 1 ? '#475569' : 'var(--accent-blue)' }}
                >
                  <FiChevronLeft />
                </IconButton>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <Button
                    key={idx}
                    size="small"
                    onClick={() => handlePageChange(idx + 1)}
                    style={{
                      minWidth: '28px',
                      height: '28px',
                      borderRadius: '4px',
                      background: currentPage === idx + 1 ? 'var(--accent-violet)' : 'transparent',
                      color: '#FFF',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    {idx + 1}
                  </Button>
                ))}
                <IconButton 
                  size="small" 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  style={{ color: currentPage === totalPages ? '#475569' : 'var(--accent-blue)' }}
                >
                  <FiChevronRight />
                </IconButton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
