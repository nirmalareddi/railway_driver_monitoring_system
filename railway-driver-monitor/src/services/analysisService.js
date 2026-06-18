import axiosClient from '../api/axiosClient';
import { API } from '../api/endpoints';

export const analysisService = {
  getProcessingStatus: async (videoId, currentPercent = 0) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const steps = [
      'Reading Video',
      'Extracting Frames',
      'Detecting Drowsiness',
      'Detecting Attention Loss',
      'Detecting Mobile Usage',
      'Detecting Face Visibility',
      'Generating Report'
    ];

    const nextPercent = Math.min(currentPercent + 15, 100);

    const currentStepIndex = Math.min(
      Math.floor((nextPercent / 100) * steps.length),
      steps.length - 1
    );

    const remainingSeconds = Math.max(
      Math.ceil((100 - nextPercent) * 0.4),
      0
    );

    return {
      videoId,
      percentage: nextPercent,
      currentStep: steps[currentStepIndex],
      stepIndex: currentStepIndex,
      allSteps: steps,
      estimatedTimeRemaining:
        remainingSeconds > 0
          ? `${remainingSeconds}s`
          : 'Completed',
      status:
        nextPercent >= 100
          ? 'Completed'
          : 'Processing'
    };
  },

  getResults: async () => {
    const report = await axiosClient.get('/report');

    return {
      videoId: 'latest',
      videoUrl: 'http://localhost:8000/video',

      // Replace these later with real values from backend
      duration: '01m 53s',
      durationSeconds: 113,
      totalFrames: 3386,
      fps: 30,
      resolution: '1280x720',

      totalIncidents: report.total_events || 0,

      incidentsSummary: {
        drowsiness:
          report.event_summary?.drowsiness || 0,

        attentionLoss:
          report.event_summary?.attention_loss || 0,

        mobileUsage:
          report.event_summary?.mobile_usage || 0,

        faceNotVisible:
          report.event_summary?.face_not_visible || 0
      }
    };
  },

  getTimeline: async () => {
    const events = await axiosClient.get('/events');

    return events.map((event, index) => ({
      id: index + 1,

      type: event.event
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()),

      timestamp: Math.floor(event.timestamp),

      timeString:
        `${Math.floor(event.timestamp / 60)
          .toString()
          .padStart(2, '0')}:${Math.floor(event.timestamp % 60)
          .toString()
          .padStart(2, '0')}`,

      severity: 'Medium',

      thumbnail: null,

      description:
        `${event.event} detected at ${event.timestamp}s`
    }));
  }
};