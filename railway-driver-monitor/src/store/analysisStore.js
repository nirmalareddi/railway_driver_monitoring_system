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
    if (pollingInterval) clearInterval(pollingInterval);

    set({
      processingPercent: 0,
      processingStatus: null,
      error: null
    });

    const poll = async () => {
      try {
        const { processingPercent } = get();

        const status =
          await analysisService.getProcessingStatus(
            videoId,
            processingPercent
          );

        set({
          processingStatus: status,
          processingPercent: status.percentage
        });

        if (status.percentage >= 100) {
          if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
          }

          const waitForCompletion = async () => {
  try {
    const status =
      await analysisService.getStatus(videoId);

    console.log(
      'Current Job Status:',
      status.status
    );

    if (status.status === 'completed') {

      console.log(
        'Analysis completed.'
      );

      if (onComplete) {
        onComplete();
      }

      return;
    }
  } catch (e) {
    console.log(
      'Waiting for analysis completion...'
    );
  }

  setTimeout(waitForCompletion, 5000);
};

waitForCompletion();
        }
      } catch (err) {
        set({
          error:
            err.message ||
            'Error occurred during analysis processing.'
        });

        if (pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
      }
    };

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
    set({
      loadingResults: true,
      error: null
    });

    try {
      const results =
        await analysisService.getResults(videoId);

      set({
        results,
        loadingResults: false,
        error: null
      });
    } catch (err) {
      set({
        error:
          err.message ||
          'Failed to fetch analysis results',
        loadingResults: false
      });
    }
  },

  fetchTimeline: async (videoId) => {
  set({
    loadingTimeline: true,
    error: null
  });

  try {
    const timeline =
      await analysisService.getTimeline(videoId);

    set({
      timeline,
      loadingTimeline: false,
      error: null
    });
  } catch (err) {
    set({
      error:
        err.message ||
        'Failed to fetch incident timeline',
      loadingTimeline: false
    });
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