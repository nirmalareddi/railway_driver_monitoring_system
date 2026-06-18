import { create } from 'zustand';
import { uploadService } from '../services/uploadService';

export const useUploadStore = create((set) => ({
  file: null,
  progress: 0,
  uploading: false,
  error: null,
  result: null,

  setFile: (file) => set({ file, error: null, progress: 0, result: null }),

  uploadVideoFile: async (navigate) => {
    const { file } = useUploadStore.getState();
    if (!file) {
      set({ error: 'Please select or drag a video file first.' });
      return;
    }

    set({ uploading: true, error: null, progress: 0 });
    try {
      const response = await uploadService.uploadVideo(file, (progress) => {
        set({ progress });
      });
      set({ uploading: false, result: response });

if (navigate) {
  navigate('/processing');
}
    } catch (err) {
      set({ uploading: false, error: err.message || 'Video upload failed.' });
    }
  },

  resetStore: () => set({ file: null, progress: 0, uploading: false, error: null, result: null })
}));
