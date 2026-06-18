import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000,
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.warn('Axios interceptor: Endpoint offline or returned error. Fallback to mock data.', error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
