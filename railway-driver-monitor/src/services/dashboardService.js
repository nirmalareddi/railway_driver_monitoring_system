import axiosClient from '../api/axiosClient';
import { API } from '../api/endpoints';

export const dashboardService = {
  getDashboardData: async () => {
    try {
      return await axiosClient.get(API.DASHBOARD);
    } catch (error) {
      console.log('Using mock dashboard data');
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        totalAnalyses: 1284,
        drowsinessCount: 42,
        attentionLossCount: 88,
        mobileUsageCount: 23,
        faceNotVisibleCount: 16,
        safetyScore: 92,
        safetyStatus: 'Excellent',
        systemHealth: 98,
        recentIncidents: [
          { id: 1, type: 'Drowsiness', timestamp: '2026-06-15 10:45:12', severity: 'High', color: '#FF3B6B' },
          { id: 2, type: 'Attention Loss', timestamp: '2026-06-15 09:30:04', severity: 'Medium', color: '#FFB300' },
          { id: 3, type: 'Mobile Usage', timestamp: '2026-06-15 08:15:22', severity: 'High', color: '#FF3B6B' },
          { id: 4, type: 'Face Not Visible', timestamp: '2026-06-15 07:11:45', severity: 'Low', color: '#00E5FF' },
          { id: 5, type: 'Drowsiness', timestamp: '2026-06-15 06:05:00', severity: 'High', color: '#FF3B6B' }
        ],
        lastSevenDays: [
          { date: 'Mon', analyses: 12, incidents: 2 },
          { date: 'Tue', analyses: 15, incidents: 4 },
          { date: 'Wed', analyses: 18, incidents: 1 },
          { date: 'Thu', analyses: 10, incidents: 3 },
          { date: 'Fri', analyses: 22, incidents: 5 },
          { date: 'Sat', analyses: 8, incidents: 0 },
          { date: 'Sun', analyses: 11, incidents: 2 }
        ],
        recentReports: [
          { id: 'REP-001', trainId: 'T-802', driver: 'Alex Mercer', duration: '02h 15m', incidents: 3, date: '2026-06-14' },
          { id: 'REP-002', trainId: 'T-104', driver: 'Sarah Connor', duration: '01h 45m', incidents: 1, date: '2026-06-14' },
          { id: 'REP-003', trainId: 'T-992', driver: 'Marcus Wright', duration: '04h 20m', incidents: 8, date: '2026-06-13' }
        ]
      };
    }
  },

  getCharts: async () => {
    try {
      return await axiosClient.get(`${API.DASHBOARD}/charts`);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return [
        { time: '08:00', drowsiness: 1, attentionLoss: 3, mobileUsage: 0, faceNotVisible: 1 },
        { time: '10:00', drowsiness: 2, attentionLoss: 1, mobileUsage: 1, faceNotVisible: 0 },
        { time: '12:00', drowsiness: 0, attentionLoss: 4, mobileUsage: 2, faceNotVisible: 2 },
        { time: '14:00', drowsiness: 3, attentionLoss: 2, mobileUsage: 0, faceNotVisible: 1 },
        { time: '16:00', drowsiness: 1, attentionLoss: 1, mobileUsage: 0, faceNotVisible: 0 },
        { time: '18:00', drowsiness: 0, attentionLoss: 3, mobileUsage: 1, faceNotVisible: 3 },
        { time: '20:00', drowsiness: 2, attentionLoss: 0, mobileUsage: 1, faceNotVisible: 0 }
      ];
    }
  }
};
