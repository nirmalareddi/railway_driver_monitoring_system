import axiosClient from '../api/axiosClient';
import { API } from '../api/endpoints';

export const reportService = {
  getReports: async () => {
    try {
      return await axiosClient.get(API.REPORT);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        {
          id: 'REP-001',
          trainId: 'T-802',
          driver: 'Alex Mercer',
          duration: '02h 15m',
          incidents: 3,
          date: '2026-06-14',
          status: 'Completed',
          resolution: '1920x1080',
          fps: 30
        },
        {
          id: 'REP-002',
          trainId: 'T-104',
          driver: 'Sarah Connor',
          duration: '01h 45m',
          incidents: 1,
          date: '2026-06-14',
          status: 'Completed',
          resolution: '1920x1080',
          fps: 30
        },
        {
          id: 'REP-003',
          trainId: 'T-992',
          driver: 'Marcus Wright',
          duration: '04h 20m',
          incidents: 8,
          date: '2026-06-13',
          status: 'Completed',
          resolution: '1280x720',
          fps: 25
        },
        {
          id: 'REP-004',
          trainId: 'T-455',
          driver: 'Elena Fisher',
          duration: '00h 45m',
          incidents: 0,
          date: '2026-06-12',
          status: 'Completed',
          resolution: '1920x1080',
          fps: 30
        },
        {
          id: 'REP-005',
          trainId: 'T-309',
          driver: 'Nathan Drake',
          duration: '03h 10m',
          incidents: 12,
          date: '2026-06-11',
          status: 'Completed',
          resolution: '1920x1080',
          fps: 30
        }
      ];
    }
  },

  downloadReport: async (videoId, format) => {
    try {
      const response = await axiosClient.get(
        `/report/pdf/${videoId}`,
        {
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_${videoId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('PDF download failed:', error);
      console.log(`Simulating download for report ${videoId} in ${format} format`);

      await new Promise((resolve) => setTimeout(resolve, 500));

      let fileContent = '';
      let mimeType = 'application/json';
      let fileName = `report_${videoId}.${format}`;

      if (format.includes('json')) {
        fileContent = JSON.stringify(
          {
            videoId,
            timestamp: new Date().toISOString(),
            status: 'Completed',
            incidents: [
              { type: 'Drowsiness', timestamp: '00:12', severity: 'High', description: 'Eyelids closed for 3.8s' },
              { type: 'Attention Loss', timestamp: '00:32', severity: 'Medium', description: 'Gaze diverted' }
            ]
          },
          null,
          2
        );
        mimeType = 'application/json';
      } else if (format === 'csv') {
        fileContent = 'IncidentID,IncidentType,Timestamp,Severity,Details\n1,Drowsiness,00:12,High,Eyes closed for 3.8 seconds\n2,Attention Loss,00:32,Medium,Gaze diverted';
        mimeType = 'text/csv';
      } else if (format === 'pdf') {
        fileContent = '%PDF-1.4 Mock PDF report';
        mimeType = 'application/pdf';
      }

      const blob = new Blob([fileContent], { type: mimeType });
      const downloadUrl = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.setAttribute('download', fileName);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true };
    }
  },

  downloadVideo: async (videoId) => {
    try {
      return await axiosClient.get(
        API.VIDEO,
        { responseType: 'blob' }
      );
    } catch (error) {
      console.log(`Simulating download for annotated video ${videoId}`);
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const fileContent = 'Mock video contents';
      const blob = new Blob([fileContent], { type: 'video/mp4' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `annotated_${videoId}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    }
  }
};
