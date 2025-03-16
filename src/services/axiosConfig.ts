import axios from 'axios';

// Force the API URL to be http://localhost:5000/api regardless of environment variables
const API_URL = 'http://localhost:5000/api';

console.log('API_URL being used:', API_URL); // Debug log

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to prevent long waiting times
  timeout: 10000
});

// Add token to requests if available
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Adding auth token to request:', token.substring(0, 10) + '...');
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No auth token found in localStorage');
  }
  
  // Log the full request for debugging
  console.log('Full request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  
  return config;
}, error => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
      data: error.config?.data
    });
    
    // More detailed error handling
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Is the backend server running at', API_URL, '?');
      console.error('Try checking if the server is running and accessible');
      
      // Test the backend connection
      fetch(`${API_URL}/health`)
        .then(response => {
          if (response.ok) {
            console.log('Backend health check successful, but the original request failed');
            return response.json();
          } else {
            console.error('Backend health check failed with status:', response.status);
            throw new Error(`Health check failed: ${response.status}`);
          }
        })
        .then(data => console.log('Health check response:', data))
        .catch(err => console.error('Health check error:', err));
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.warn('Authentication error - redirecting to login');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export { API_URL };
export default axiosInstance; 