import axiosClient from '../api/axiosClient';
import { API } from '../api/endpoints';

export const uploadService = {
  uploadVideo: async (file, onUploadProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload video
      const uploadResponse = await axiosClient.post(
        API.UPLOAD,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onUploadProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onUploadProgress(percentCompleted);
            }
          }
        }
      );

      console.log('Upload Success:', uploadResponse);

      // Start analysis in background
      axiosClient.post(API.ANALYZE)
        .then((res) => {
          console.log('Analysis Started:', res);
        })
        .catch((err) => {
          console.error('Analysis Error:', err);
        });

      return {
        videoId: 'latest',
        fileName: file.name,
        status: 'Processing'
      };

    } catch (error) {
      console.error('UPLOAD ERROR:', error);

      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Status:', error.response.status);
      }

      throw error;
    }
  },

  getUploadStatus: async (videoId) => {
    try {
      return {
        videoId,
        status: 'Processing'
      };
    } catch (error) {
      return {
        videoId,
        status: 'Unknown'
      };
    }
  }
};