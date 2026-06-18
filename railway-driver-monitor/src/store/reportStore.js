import { create } from 'zustand';
import { reportService } from '../services/reportService';

export const useReportStore = create((set, get) => ({
  reports: [],
  loading: false,
  error: null,

  fetchReports: async () => {
    set({ loading: true, error: null });
    try {
      const reports = await reportService.getReports();
      set({ reports, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch reports', loading: false });
    }
  },

  downloadReport: async (videoId, format) => {
    try {
      await reportService.downloadReport(videoId, format);
    } catch (err) {
      console.error(`Failed to download report for format ${format}:`, err.message);
    }
  },

  downloadVideo: async (videoId) => {
    try {
      await reportService.downloadVideo(videoId);
    } catch (err) {
      console.error(`Failed to download video:`, err.message);
    }
  },

  deleteReport: async (reportId) => {
    // Simulate delete from server
    await new Promise((resolve) => setTimeout(resolve, 400));
    const currentReports = get().reports;
    set({
      reports: currentReports.filter((rep) => rep.id !== reportId)
    });
  },

  resetStore: () => set({ reports: [], loading: false, error: null })
}));
