import { create } from 'zustand';
import { analysisService } from '../services/analysisService';

let pollingInterval = null;

export const useAnalysisStore = create((set, get) => ({
  processingStatus: null,
  processingPercent: 0,
  results: null,
  timeline: [],
  loadingResults: false,
  loadingTimeline: false,
  error: null,

  startPollingProcessing: (videoId, onComplete) => {
    // Clear any existing poll
    if (pollingInterval) clearInterval(pollingInterval);
    set({ processingPercent: 0, processingStatus: null, error: null });

    const poll = async () => {
      try {
        const { processingPercent } = get();
        const status = await analysisService.getProcessingStatus(videoId, processingPercent);
        
        set({
          processingStatus: status,
          processingPercent: status.percentage
        });

        if (status.percentage >= 100) {
          if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
          }
          if (onComplete) onComplete();
        }
      } catch (err) {
        set({ error: err.message || 'Error occurred during analysis processing.' });
        if (pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
      }
    };

    // Run first call instantly
    poll();
    pollingInterval = setInterval(poll, 2000);
  },

  stopPollingProcessing: () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  },

  fetchResults: async (videoId) => {
    set({ loadingResults: true, error: null });
    try {
      const results = await analysisService.getResults(videoId);
      set({ results, loadingResults: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch analysis results', loadingResults: false });
    }
  },

  fetchTimeline: async (videoId) => {
    set({ loadingTimeline: true, error: null });
    try {
      const timeline = await analysisService.getTimeline(videoId);
      set({ timeline, loadingTimeline: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch incident timeline', loadingTimeline: false });
    }
  },

  resetStore: () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    set({
      processingStatus: null,
      processingPercent: 0,
      results: null,
      timeline: [],
      loadingResults: false,
      loadingTimeline: false,
      error: null
    });
  }
}));
