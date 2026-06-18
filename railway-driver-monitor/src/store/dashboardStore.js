import { create } from 'zustand';
import { dashboardService } from '../services/dashboardService';

export const useDashboardStore = create((set) => ({
  dashboardData: null,
  chartsData: [],
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await dashboardService.getDashboardData();
      set({ dashboardData: data, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch dashboard data', loading: false });
    }
  },

  fetchChartsData: async () => {
    try {
      const data = await dashboardService.getCharts();
      set({ chartsData: data });
    } catch (err) {
      console.error('Failed to fetch charts data:', err.message);
    }
  },

  resetStore: () => set({ dashboardData: null, chartsData: [], loading: false, error: null })
}));
